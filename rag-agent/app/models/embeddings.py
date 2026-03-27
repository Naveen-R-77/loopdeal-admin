import os
import requests

def embed_text(text):
    """
    Ultra-lightweight cloud embeddings via Hugging Face.
    0MB RAM usage locally! 🚀
    """
    hf_token = os.environ.get("HF_TOKEN")
    
    # Model used: BAAI/bge-small-en-v1.5 (Consistent with local version)
    API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-small-en-v1.5"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": text, "options": {"wait_for_model": True}})
        if response.status_code != 200:
             # Fallback to a mock small vector if API fails to prevent hard crash
             print(f"Embedding API Error: {response.text}")
             return [0.0] * 384 # Default dimension for bge-small
        
        return response.json()
    except Exception as e:
        print(f"Network error during embedding: {e}")
        return [0.0] * 384
