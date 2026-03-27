import os
from app.models.embeddings import embed_text
from app.database.vectordb import add_document

# Robust Path calculation: get the root directory by going up 3 levels from ingest.py (app/rag/ingest.py)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_PATH = os.path.join(BASE_DIR, "data", "docs")

def ingest_documents():
    print(f"Ingestion starting... Scanning: {DATA_PATH}")
    if not os.path.exists(DATA_PATH):
        print(f"CRITICAL: Docs directory not found at: {DATA_PATH}")
        return

    files = [f for f in os.listdir(DATA_PATH) if f.endswith(".txt") or f.endswith(".md")]
    print(f"Found {len(files)} docs to ingest: {files}")

    for file in files:
        file_path = os.path.join(DATA_PATH, file)
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        # Simple chunking for now
        chunks = text.split("\n\n")

        for i, chunk in enumerate(chunks):
            if len(chunk.strip()) < 10:
                continue

            # Embed chunk
            print(f"Ingesting part {i} of {file}...")
            embedding = embed_text(chunk)

            # Store in DB
            add_document(f"{file}_{i}", chunk, embedding)

    print(f"SUCCESS: Successfully ingested enterprise knowledge from: {DATA_PATH}")
