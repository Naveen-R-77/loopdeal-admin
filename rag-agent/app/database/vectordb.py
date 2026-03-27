import chromadb
import os

# Database setup for LoopDeal's AI Knowledge Base
DB_PATH = os.path.join(os.getcwd(), "chroma_db")

# Persistent ChromaDB client
try:
    client = chromadb.PersistentClient(path=DB_PATH)
except:
    client = chromadb.Client()

collection = client.get_or_create_collection("loopdeal_knowledge")

def add_document(doc_id, text, embedding):
    # USE UPSERT instead of add to prevent "ID already exists" errors
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
    # If no results found, return an empty list safely
    if not results or not results["documents"]:
        return []
    return results["documents"][0]
