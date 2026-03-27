import os
import requests

def embed_text(text):
    """
    Ultra-lightweight cloud embeddings via Hugging Face.
    Correcting URL to use the new Hugging Face Router.
    """
    hf_token = os.environ.get("HF_TOKEN")
    
    # New Hugging Face Router URL
    API_URL = "https://router.huggingface.co/models/BAAI/bge-small-en-v1.5"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": text, "options": {"wait_for_model": True}})
        
        if response.status_code != 200:
             print(f"Embedding API Error: {response.text}")
             return [0.0] * 384 
        
        result = response.json()
        
        # Handle Nested Output: [[0.1, 0.2, ...]] or [0.1, 0.2, ...]
        if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
            return result[0]
        
        return result
        
    except Exception as e:
        print(f"Network error during embedding: {e}")
        return [0.0] * 384
