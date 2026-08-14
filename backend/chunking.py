import re
from typing import List, Dict, Any, Optional

class ChunkMetadata:
    def __init__(
        self,
        chunk_id: str,
        passage_id: str,
        chunking_strategy: str,
        language: str,
        query_id: str,
        is_selected: int,
        parent_passage_id: Optional[str] = None,
        start_char: int = 0,
        end_char: int = 0,
    ):
        self.chunk_id = chunk_id
        self.passage_id = passage_id
        self.chunking_strategy = chunking_strategy
        self.language = language
        self.query_id = query_id
        self.is_selected = is_selected
        self.parent_passage_id = parent_passage_id or passage_id
        self.start_char = start_char
        self.end_char = end_char

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "passage_id": self.passage_id,
            "chunking_strategy": self.chunking_strategy,
            "language": self.language,
            "query_id": self.query_id,
            "is_selected": self.is_selected,
            "parent_passage_id": self.parent_passage_id,
            "start_char": self.start_char,
            "end_char": self.end_char,
        }

class Chunk:
    def __init__(self, text: str, metadata: ChunkMetadata, parent_text: Optional[str] = None):
        self.text = text
        self.metadata = metadata
        self.parent_text = parent_text or text

    def to_dict(self) -> Dict[str, Any]:
        d = self.metadata.to_dict()
        d["text"] = self.text
        d["parent_text"] = self.parent_text
        return d

class MultiStrategyChunker:
    """
    Implements multi-strategy chunking layer for MSMARCO-XI Indic dataset:
    1. Native Passage-level Chunks
    2. Sentence-Window / Semantic Splitting (>150 tokens)
    3. Sliding-Window Overlap Chunking (256 tokens, 20% overlap)
    4. Hierarchical Parent-Child Chunking
    """
    
    @staticmethod
    def estimate_tokens(text: str) -> int:
        """Rough token estimation (1 token ~= 4 chars or space split)."""
        return max(len(text.split()), len(text) // 4)

    @classmethod
    def process_passage(cls, passage_record: Dict[str, Any]) -> List[Chunk]:
        chunks: List[Chunk] = []
        passage_id = passage_record.get("passage_id", "pass_unk")
        raw_text = passage_record.get("passage_text", "")
        language = passage_record.get("language", "en")
        query_id = passage_record.get("query_id", "q_unk")
        is_selected = passage_record.get("is_selected", 1)

        token_count = cls.estimate_tokens(raw_text)

        # 1. Native Passage Chunk (Always preserve as baseline first-class unit)
        native_meta = ChunkMetadata(
            chunk_id=f"{passage_id}_native",
            passage_id=passage_id,
            chunking_strategy="native_passage",
            language=language,
            query_id=query_id,
            is_selected=is_selected,
            parent_passage_id=passage_id,
            start_char=0,
            end_char=len(raw_text)
        )
        chunks.append(Chunk(text=raw_text, metadata=native_meta, parent_text=raw_text))

        # 2. Sentence-Window / Semantic Splitting (>150 tokens or > 3 sentences)
        sentences = re.split(r'(?<=[.!?।])\s+', raw_text)
        if token_count > 150 or len(sentences) > 3:
            for idx, sent in enumerate(sentences):
                sent = sent.strip()
                if not sent:
                    continue
                start_pos = raw_text.find(sent)
                sent_meta = ChunkMetadata(
                    chunk_id=f"{passage_id}_sent_{idx}",
                    passage_id=passage_id,
                    chunking_strategy="sentence_window",
                    language=language,
                    query_id=query_id,
                    is_selected=is_selected,
                    parent_passage_id=passage_id,
                    start_char=start_pos if start_pos != -1 else 0,
                    end_char=(start_pos + len(sent)) if start_pos != -1 else len(sent)
                )
                # Parent-child relationship: Small sentence child linked to full parent passage
                chunks.append(Chunk(text=sent, metadata=sent_meta, parent_text=raw_text))

        # 3. Sliding-Window Overlap Chunking (For longer passages)
        if len(raw_text) > 300:
            window_size = 200
            overlap = 40
            step = window_size - overlap
            for i in range(0, len(raw_text), step):
                chunk_str = raw_text[i:i + window_size]
                if len(chunk_str.strip()) < 30:
                    continue
                slide_meta = ChunkMetadata(
                    chunk_id=f"{passage_id}_slide_{i}",
                    passage_id=passage_id,
                    chunking_strategy="sliding_window",
                    language=language,
                    query_id=query_id,
                    is_selected=is_selected,
                    parent_passage_id=passage_id,
                    start_char=i,
                    end_char=i + len(chunk_str)
                )
                chunks.append(Chunk(text=chunk_str, metadata=slide_meta, parent_text=raw_text))

        return chunks

    @classmethod
    def process_all_passages(cls, passages: List[Dict[str, Any]]) -> List[Chunk]:
        all_chunks: List[Chunk] = []
        for p in passages:
            all_chunks.extend(cls.process_passage(p))
        return all_chunks
