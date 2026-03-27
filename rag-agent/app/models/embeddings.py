import os
from huggingface_hub import InferenceClient

# Global client to avoid re-initializing
_client = None

def get_client():
    global _client
    if _client is None:
        hf_token = os.environ.get("HF_TOKEN")
        _client = InferenceClient(api_key=hf_token)
    return _client

def embed_text(text):
    """
    Ultra-lightweight cloud embeddings via Hugging Face InferenceClient.
    Letting the library handle the routing to prevent 'Not Found' errors.
    """
    client = get_client()
    
    try:
        # Use feature_extraction which is for embeddings
        # model="BAAI/bge-small-en-v1.5"
        result = client.feature_extraction(
            text, 
            model="BAAI/bge-small-en-v1.5"
        )
        
        import numpy as np
        # Convert to list if it's a numpy array or nested list
        if hasattr(result, "tolist"):
            return result.tolist()
        
        # Handle 2D output [[...]]
        if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
            return result[0]
            
        return result
        
    except Exception as e:
        print(f"Embedding Error via Client: {e}")
        return [0.0] * 384
