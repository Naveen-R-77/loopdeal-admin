# Lazy-loaded model — only loads when embed_text is actually called
_model = None

def embed_text(text):
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        print("Loading BGE embedding model for the first time...")
        _model = SentenceTransformer("BAAI/bge-small-en-v1.5")
        print("Embedding model loaded.")
    
    # Returns a float list representing the semantic vector
    return _model.encode(text).tolist()
