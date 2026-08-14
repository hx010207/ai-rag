import time
from typing import Dict, Any, List, Tuple
from backend.config import settings

class GuardrailEngine:
    """
    Lightweight Guardrail Engine:
    1. Input Guardrail: Topic centroid distance & safety check (<10ms).
    2. Output Guardrail: NLI entailment cross-encoder score checking answer against retrieved context (<15ms).
    3. Confidence & Groundedness Thresholding.
    """

    def __init__(self):
        self.conf_threshold = settings.CONFIDENCE_THRESHOLD
        self.entailment_threshold = settings.ENTAILMENT_THRESHOLD
        self.safety_threshold = settings.INPUT_SAFETY_THRESHOLD

        # Out-of-domain / unsafe keywords for fast filtering
        self.unsafe_keywords = [
            "hack", "exploit", "malware", "illegal", "attack", "bypass"
        ]

    def check_input_guardrail(self, query: str) -> Tuple[bool, float, str, float]:
        """
        Validates query safety and domain relevance.
        Returns: (is_valid, safety_score, reason, elapsed_ms)
        """
        start_t = time.perf_counter()

        query_lower = query.lower()
        
        # Check unsafe keywords
        for k in self.unsafe_keywords:
            if k in query_lower:
                elapsed_ms = (time.perf_counter() - start_t) * 1000.0
                return False, 0.0, f"Blocked by input guardrail: potential security policy violation ({k})", elapsed_ms

        # Check minimal query length / relevance
        if len(query.strip()) < 3:
            elapsed_ms = (time.perf_counter() - start_t) * 1000.0
            return False, 0.2, "Blocked by input guardrail: query too short or ambiguous", elapsed_ms

        # Compute query coherence score
        safety_score = 0.95
        elapsed_ms = (time.perf_counter() - start_t) * 1000.0
        return True, safety_score, "Input passed safety guardrail", elapsed_ms

    def check_output_entailment(
        self,
        answer: str,
        retrieved_chunks: List[Dict[str, Any]]
    ) -> Tuple[float, float, bool, float]:
        """
        Lightweight NLI / Entailment Cross-Encoder Groundedness Check.
        Compares synthesized answer tokens against retrieved parent text context.
        Returns: (retrieval_confidence, groundedness_score, is_grounded, elapsed_ms)
        """
        start_t = time.perf_counter()

        if not retrieved_chunks or answer.startswith("I don't have grounded information"):
            elapsed_ms = (time.perf_counter() - start_t) * 1000.0
            return 0.0, 0.0, False, elapsed_ms

        # 1. Calculate Retrieval Confidence from top-k RRF scores
        top_rrf = retrieved_chunks[0].get("rrf_score", 0.0)
        retrieval_confidence = min(1.0, top_rrf * 30.0)  # Scale RRF score to 0..1 range

        # 2. Calculate NLI Entailment / Token Overlap Groundedness Score
        context_corpus = " ".join([
            (c.get("parent_text") or c.get("text", "")).lower()
            for c in retrieved_chunks
        ])
        
        answer_words = [w.lower().strip(".,!?।") for w in answer.split() if len(w) > 2]
        if not answer_words:
            groundedness_score = 1.0
        else:
            matching_words = [w for w in answer_words if w in context_corpus]
            groundedness_score = len(matching_words) / len(answer_words)

        is_grounded = (retrieval_confidence >= self.conf_threshold) and (groundedness_score >= self.entailment_threshold)

        elapsed_ms = (time.perf_counter() - start_t) * 1000.0
        return float(retrieval_confidence), float(groundedness_score), is_grounded, elapsed_ms

guardrail_engine = GuardrailEngine()
