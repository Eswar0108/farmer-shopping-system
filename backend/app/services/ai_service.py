import os
import json
from groq import Groq
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from app.core.config import settings

# Initialize Groq
groq_client = Groq(api_key=settings.GROQ_API_KEY)

# Initialize embedding model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(
    path="./chroma_db",
    settings=Settings(anonymized_telemetry=False)
)

PRODUCTS_COLLECTION = "products"


def get_or_create_collection():
    """Get or create the products collection in ChromaDB."""
    try:
        return chroma_client.get_collection(PRODUCTS_COLLECTION)
    except ValueError:
        return chroma_client.create_collection(
            name=PRODUCTS_COLLECTION,
            metadata={"hnsw:space": "cosine"}
        )


def generate_product_description(name: str, price: float, category: str, farmer_name: str) -> str:
    """Generate a product description using Groq LLM."""
    prompt = f"""Write a friendly, appealing product description for a farmer's market product.
Product: {name}
Price: ₹{price}
Category: {category}
Farmer: {farmer_name}

Write 2-3 sentences. Highlight quality, freshness, and uses. Keep it natural and persuasive."""

    response = groq_client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful product description writer for a farmer's marketplace in India."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=200
    )
    return response.choices[0].message.content.strip()


def suggest_price(product_name: str, category: str) -> dict:
    """Suggest a competitive price using Groq LLM."""
    prompt = f"""Suggest a competitive price for this farmer's market product.
Product: {product_name}
Category: {category}

Return only the suggested price in INR (₹), a price range, and a brief reason. Format as:
Price: ₹XX
Range: ₹XX - ₹XX
Reason: Brief explanation"""

    response = groq_client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": "You are a pricing expert for an Indian farmer's marketplace. Respond only with the requested format."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=150
    )
    text = response.choices[0].message.content.strip()
    
    # Parse the response
    lines = text.split('\n')
    result = {"price": "", "range": "", "reason": ""}
    for line in lines:
        if line.lower().startswith('price'):
            result["price"] = line.split(':', 1)[1].strip()
        elif line.lower().startswith('range'):
            result["range"] = line.split(':', 1)[1].strip()
        elif line.lower().startswith('reason'):
            result["reason"] = line.split(':', 1)[1].strip()
    
    return result


def chat_with_products(query: str) -> dict:
    """Search products by semantic similarity and generate AI response."""
    # Check if user message is a greeting
    clean_query = query.strip().lower().rstrip('?!.')
    greetings = {"hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "hola", "yo"}
    is_greeting = clean_query in greetings or any(clean_query.startswith(g + " ") for g in greetings)
    
    products = []
    context = "No products found matching your query."
    
    if not is_greeting:
        # 1. Convert query to embedding
        query_emb = embedding_model.encode(query).tolist()
        
        # 2. Search similar products
        collection = get_or_create_collection()
        results = collection.query(
            query_embeddings=[query_emb],
            n_results=5,
            include=["documents", "metadatas", "distances"]
        )
        
        # 3. Build context from results using semantic distance threshold
        if results['metadatas'] and results['metadatas'][0]:
            distances = results['distances'][0] if 'distances' in results and results['distances'] else [0.0] * len(results['metadatas'][0])
            for idx, meta in enumerate(results['metadatas'][0]):
                dist = distances[idx]
                # Cosine distance < 0.65 indicates reasonable semantic relevance
                if dist < 0.65:
                    products.append({
                        "id": meta.get("product_id", ""),
                        "name": meta.get("name", ""),
                        "price": meta.get("price", 0),
                        "stock": meta.get("stock", 0),
                        "category": meta.get("category", ""),
                        "farmer": meta.get("farmer", ""),
                        "image_url": meta.get("image_url", "")
                    })
            
            if products:
                context = "\n".join([
                    f"- {p['name']} by {p['farmer']}: ₹{p['price']}, {p['stock']} in stock, Category: {p['category']}"
                    for p in products
                ])

    # 4. Generate response with Groq
    system_instruction = f"""You are a friendly shopping assistant for a farmer products marketplace in India.
Answer questions using ONLY the products provided below.
If a product matches the user's need, recommend it with price in ₹.
If no products match, suggest alternatives or ask clarifying questions.
If the user greets you (e.g., says hi, hello), respond with a warm greeting and ask how you can help them shop today. Do not show products for simple greetings.
If the user's question is completely unrelated to our store, products, farming, or agriculture, politely inform them that you can only assist with shopping and product-related inquiries on the Farmer Shop.
Be concise and friendly.

Available products:
{context}"""

    response = groq_client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": system_instruction
            },
            {"role": "user", "content": query}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    return {
        "message": response.choices[0].message.content,
        "products": products
    }