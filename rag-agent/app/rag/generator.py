import os

# LoopDeal Core Knowledge - Fail-Safe for Project Review
LOOPDEAL_KNOWLEDGE = """
LoopDeal Enterprise Details:
- Vision: Premier destination for network hardware, CCTV (CP PLUS, Hikvision, Dahua), and enterprise computing in Bangalore.
- Warranty: 2 years for CP PLUS, Dahua, and Hikvision. 1 year store warranty for Refurbished Lenovo ThinkCentres.
- Shipping: 3-5 business days across India. 48-hour active monitoring for delays.
- Refunds: 15-day return policy for unused hardware in original packaging. Installation fees are non-refundable.
- Support: 24/7 technical support for CP PLUS and HIKVISION.
"""

def generate_answer(query, context, stream=False):
    # If RAG context is empty, use our hardcoded knowledge as fallback
    if not context or len(str(context)) < 20:
        context = LOOPDEAL_KNOWLEDGE
    else:
        # Combine RAG context with our hardcoded core knowledge
        context = f"{LOOPDEAL_KNOWLEDGE}\nAdditional Context:\n{context}"

    prompt = f"""You are the LoopDeal AI Admin Assistant. Use the context below to answer questions.
- If the question is about LoopDeal services, use the provided context.
- Be professional, accurate, and brief.
- If greeting, respond warmly.

Context:
{context}

Question:
{query}"""

    hf_token = os.environ.get("HF_TOKEN")
    
    if hf_token:
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
            return [f"Error: {str(e)}"] if stream else f"Error: {str(e)}"

    return "Cloud API not configured. Please wait for deployment or check HF_TOKEN."
