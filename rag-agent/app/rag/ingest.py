import os
from app.models.embeddings import embed_text
from app.database.vectordb import add_document

# Ingestion logic for LoopDeal enterprise documents
# Path is relative to the directory from which the script is run
DATA_PATH = os.path.join(os.getcwd(), "data", "docs")

def ingest_documents():
    if not os.path.exists(DATA_PATH):
        print(f"Docs directory not found at: {DATA_PATH}")
        return

    for file in os.listdir(DATA_PATH):
        if not file.endswith(".txt") and not file.endswith(".md"):
            continue

        file_path = os.path.join(DATA_PATH, file)
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        # Simple chunking for now
        chunks = text.split("\n\n")

        for i, chunk in enumerate(chunks):
            if len(chunk.strip()) < 10:
                continue

            # Embed chunk
            embedding = embed_text(chunk)

            # Store in DB
            add_document(f"{file}_{i}", chunk, embedding)

    print(f"Successfully ingested enterprise knowledge from: {DATA_PATH}")


if __name__ == "__main__":
    ingest_documents()
