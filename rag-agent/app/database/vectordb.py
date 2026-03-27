import chromadb
import os

# Database setup for LoopDeal's AI Knowledge Base
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "chroma_db")

# Persistent ChromaDB client
try:
    client = chromadb.PersistentClient(path=DB_PATH)
except:
    client = chromadb.Client()

# Reset collection logic: Delete if exists and create fresh to sync with Cloud Embeddings
try:
    client.delete_collection("loopdeal_knowledge")
except:
    pass

collection = client.get_or_create_collection("loopdeal_knowledge")

def add_document(doc_id, text, embedding):
    collection.upsert(
        ids=[doc_id],
        documents=[text],
        embeddings=[embedding]
    )

def search(query_embedding):
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=4
    )
    if not results or not results["documents"] or len(results["documents"][0]) == 0:
        return []
    return results["documents"][0]
