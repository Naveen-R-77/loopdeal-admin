from sentence_transformers import SentenceTransformer

# Load the lightweight BGE embedding model
# Highly efficient for local or edge deployment
model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def embed_text(text):
    # Returns a float list representing the semantic vector
    return model.encode(text).tolist()
