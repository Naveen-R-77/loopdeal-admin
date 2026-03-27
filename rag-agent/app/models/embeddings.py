from sentence_transformers import SentenceTransformer
import os

# Lazy-loaded model — only loads on first call, so the server starts fast
_model = None

def _get_model():
    global _model
    if _model is None:
        print("Loading BGE embedding model (first-time only)...")
        _model = SentenceTransformer("BAAI/bge-small-en-v1.5")
        print("Embedding model loaded.")
    return _model

def embed_text(text):
    # Returns a float list representing the semantic vector
    return _get_model().encode(text).tolist()
