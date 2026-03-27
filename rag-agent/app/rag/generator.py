import os

def generate_answer(query, context, stream=False):
    prompt = f"""Use the context below to answer the question about LoopDeal.
    - Be professional and brief.
    - If the user greeting, greet them back warmly.
    
Context:
{context}

Question:
{query}"""

    hf_token = os.environ.get("HF_TOKEN")
    
    if hf_token:
        # Lazy load HF client
        from huggingface_hub import InferenceClient
        client = InferenceClient(api_key=hf_token)
        try:
            if stream:
                def hf_stream_gen():
                    for chunk in client.chat_completion(
                        model="Qwen/Qwen2.5-7B-Instruct",
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=512,
                        stream=True
                    ):
                        yield chunk.choices[0].delta.content or ""
                return hf_stream_gen()
            else:
                response = client.chat_completion(
                    model="Qwen/Qwen2.5-7B-Instruct",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=512
                )
                return response.choices[0].message.content
        except Exception as e:
            print(f"Hugging Face API Error: {e}")
            return [f"Error using Hugging Face Cloud: {str(e)}"] if stream else f"Error: {str(e)}"

    # Default: Local Ollama (fallback for local dev)
    try:
        import ollama
        if stream:
            def ollama_stream_gen():
                for chunk in ollama.chat(
                    model="llama3.2",
                    messages=[{"role": "user", "content": prompt}],
                    stream=True
                ):
                    yield chunk["message"]["content"]
            return ollama_stream_gen()
        else:
            response = ollama.chat(
                model="llama3.2",
                messages=[{"role": "user", "content": prompt}],
            )
            return response["message"]["content"]
    except Exception as e:
        print(f"Ollama API Error: {e}")
        return [str(e)] if stream else f"Error: {str(e)}"
