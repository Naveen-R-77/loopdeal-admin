import chromadb
import os

# Database setup for LoopDeal's AI Knowledge Base
DB_PATH = os.path.join(os.getcwd(), "chroma_db")

# Persistent ChromaDB client
try:
    client = chromadb.PersistentClient(path=DB_PATH)
except:
    # Fallback to local client if persistence fails (e.g., file permissions)
    client = chromadb.Client()

collection = client.get_or_create_collection("loopdeal_knowledge")

def add_document(doc_id, text, embedding):
    # Inserts or updates a document snippet with its vector
    collection.add(
        ids=[doc_id],
        documents=[text],
        embeddings=[embedding]
    )

def search(query_embedding):
    # Returns the top 4 most relevant text results
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=4
    )

    # Flatten results (Chroma returns lists within lists)
    return results["documents"][0]
