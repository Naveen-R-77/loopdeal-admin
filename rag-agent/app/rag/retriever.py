from app.models.embeddings import embed_text
from app.database.vectordb import search

# Retrieval logic for enterprise context fetch
def retrieve(query):
    # Embed the user's query
    embedding = embed_text(query)

    # Search in ChromaDB
    docs = search(embedding)

    # Combine relevant snippets
    context = "\n\n--- [KNOWLEDGE SOURCE] ---\n\n".join(docs)

    return context
