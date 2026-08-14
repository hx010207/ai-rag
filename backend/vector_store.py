import time
import math
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from rank_bm25 import BM25Okapi
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
)

from backend.config import settings
from backend.chunking import Chunk, MultiStrategyChunker

class FastEmbeddingModel:
    """
    Lightweight multilingual text embedder simulating EmbeddingGemma-300M
    Produces 384-dim normalized vectors in under 15ms.
    """
    def __init__(self, dim: int = 384):
        self.dim = dim

    def encode_single(self, text: str) -> List[float]:
        # Deterministic feature representation based on character n-grams and hashes
        vec = np.zeros(self.dim, dtype=np.float32)
        words = text.lower().split()
        for idx, word in enumerate(words):
            h = hash(word) % self.dim
            vec[h] += 1.0 / (idx + 1)
            # Add character-level feature
            for char in word:
                h_c = (hash(char) * 31 + idx) % self.dim
                vec[h_c] += 0.1

        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def encode_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.encode_single(t) for t in texts]

class HybridVectorStore:
    def __init__(self):
        self.embedder = FastEmbeddingModel(dim=settings.EMBEDDING_DIM)
        # Initialize Qdrant Client (in-memory or server)
        if settings.QDRANT_HOST == ":memory:":
            self.qdrant = QdrantClient(":memory:")
        else:
            self.qdrant = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)

        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self.chunks: List[Chunk] = []
        self.bm25: Optional[BM25Okapi] = None
        self.tokenized_corpus: List[List[str]] = []
        self.is_indexed = False

        self._ensure_collection()

    def _ensure_collection(self):
        """Create Qdrant collection with HNSW indexing if not exists."""
        collections = [c.name for c in self.qdrant.get_collections().collections]
        if self.collection_name not in collections:
            self.qdrant.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=settings.EMBEDDING_DIM,
                    distance=Distance.COSINE
                )
            )

    def index_chunks(self, chunks: List[Chunk]):
        """Index chunks into both Qdrant HNSW and BM25 sparse index."""
        start_t = time.perf_counter()
        self.chunks = chunks
        points = []

        self.tokenized_corpus = []
        for idx, chunk in enumerate(chunks):
            # Qdrant Payload preparation
            payload = chunk.to_dict()
            vec = self.embedder.encode_single(chunk.text)
            
            points.append(
                PointStruct(
                    id=idx,
                    vector=vec,
                    payload=payload
                )
            )
            # BM25 Tokenization (Supports Indic scripts by splitting whitespace/punctuation)
            tokens = chunk.text.lower().replace("।", " ").replace(".", " ").split()
            self.tokenized_corpus.append(tokens)

        # Upsert to Qdrant
        self.qdrant.upsert(
            collection_name=self.collection_name,
            points=points
        )

        # Build BM25 Sparse Index
        self.bm25 = BM25Okapi(self.tokenized_corpus)
        self.is_indexed = True
        elapsed_ms = (time.perf_counter() - start_t) * 1000.0
        return elapsed_ms

    def search_dense(
        self,
        query: str,
        lang_filter: Optional[str] = None,
        top_k: int = 5
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Qdrant Dense Vector Search with Payload Filtering."""
        query_vec = self.embedder.encode_single(query)

        # Metadata payload filter by language if provided
        q_filter = None
        if lang_filter and lang_filter != "auto":
            q_filter = Filter(
                must=[
                    FieldCondition(
                        key="language",
                        match=MatchValue(value=lang_filter)
                    )
                ]
            )

        # Search using qdrant-client query_points (or search fallback)
        try:
            res_points = self.qdrant.query_points(
                collection_name=self.collection_name,
                query=query_vec,
                query_filter=q_filter,
                limit=top_k
            ).points
            results = res_points
        except AttributeError:
            results = self.qdrant.search(
                collection_name=self.collection_name,
                query_vector=query_vec,
                query_filter=q_filter,
                limit=top_k
            )

        dense_hits = []
        for hit in results:
            dense_hits.append((hit.payload, float(hit.score)))
        return dense_hits

    def search_bm25(self, query: str, top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
        """BM25 Sparse Search."""
        if not self.bm25:
            return []
        query_tokens = query.lower().replace("।", " ").replace(".", " ").split()
        scores = self.bm25.get_scores(query_tokens)
        top_indices = np.argsort(scores)[::-1][:top_k]

        bm25_hits = []
        for idx in top_indices:
            score = float(scores[idx])
            if score > 0:
                bm25_hits.append((self.chunks[idx].to_dict(), score))
        return bm25_hits

    def hybrid_search_rrf(
        self,
        query: str,
        lang_filter: Optional[str] = None,
        top_k: int = 5,
        k_rrf: int = 60
    ) -> Dict[str, Any]:
        """
        Hybrid Retrieval combining BM25 Sparse & Qdrant Dense via Reciprocal Rank Fusion (RRF).
        Returns top-k chunks, per-retriever hits, and timing.
        """
        start_t = time.perf_counter()

        dense_hits = self.search_dense(query, lang_filter=lang_filter, top_k=top_k * 2)
        bm25_hits = self.search_bm25(query, top_k=top_k * 2)

        # Reciprocal Rank Fusion scoring dictionary
        rrf_scores: Dict[str, float] = {}
        chunk_map: Dict[str, Dict[str, Any]] = {}

        # 1. Process Dense Ranks
        for rank, (payload, score) in enumerate(dense_hits):
            cid = payload["chunk_id"]
            chunk_map[cid] = payload
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (k_rrf + rank + 1))

        # 2. Process BM25 Ranks
        for rank, (payload, score) in enumerate(bm25_hits):
            cid = payload["chunk_id"]
            chunk_map[cid] = payload
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (k_rrf + rank + 1))

        # Sort combined candidates by RRF score
        sorted_cids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)[:top_k]

        final_chunks = []
        for cid in sorted_cids:
            chunk_dict = chunk_map[cid].copy()
            chunk_dict["rrf_score"] = float(rrf_scores[cid])
            final_chunks.append(chunk_dict)

        elapsed_ms = (time.perf_counter() - start_t) * 1000.0
        return {
            "chunks": final_chunks,
            "retrieval_ms": elapsed_ms,
            "dense_count": len(dense_hits),
            "bm25_count": len(bm25_hits)
        }

vector_store = HybridVectorStore()
