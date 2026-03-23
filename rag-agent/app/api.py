from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uvicorn

# Adjusted imports for local structure
from app.rag.retriever import retrieve
from app.rag.generator import generate_answer
from app.rag.ingest import ingest_documents

app = FastAPI(title="LoopDeal AI RAG Agent API")

# Enable CORS for the Admin Dashboard to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the dashboard URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory DB needs to be populated on start
print("Ingesting LoopDeal enterprise documents on startup...")
try:
    ingest_documents()
except Exception as e:
    print(f"Initial ingestion failed: {e}. Ensure data/docs is populated.")

class QueryRequest(BaseModel):
    query: str

from fastapi.responses import StreamingResponse
import json

@app.post("/ask")
async def ask_question(request: QueryRequest):
    async def generate_stream():
        try:
            context = retrieve(request.query)
            # Generator must be updated to yield chunks
            for chunk in generate_answer(request.query, context, stream=True):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        except Exception as e:
            print(f"Streaming Error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate_stream(), media_type="text/event-stream")

@app.post("/ingest")
async def re_ingest():
    try:
        ingest_documents()
        return {"message": "Enterprise documents re-ingested successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
