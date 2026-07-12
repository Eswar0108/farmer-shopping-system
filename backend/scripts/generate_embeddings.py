import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.product import Product
from app.models.category import Category
from app.services.ai_service import get_or_create_collection, embedding_model


def generate_all_embeddings():
    print("Connecting to database...")
    db = SessionLocal()
    try:
        products = db.query(Product).filter(Product.is_active == True).all()
        if not products:
            print("No active products found to embed.")
            return

        print(f"Found {len(products)} active products. Initializing ChromaDB collection...")
        collection = get_or_create_collection()

        ids = []
        embeddings = []
        documents = []
        metadatas = []

        for p in products:
            # Build description text block for embeddings
            category_name = p.category.name if p.category else "General"
            discount = float(p.discount_amount)
            selling_price = max(0.0, float(p.price) - discount)
            discount_text = f" Discount: ₹{discount:.2f} off. Special Price: ₹{selling_price:.2f}." if discount > 0 else ""
            doc_text = f"Product: {p.name}. Category: {category_name}. Farmer: {p.farmer_name}. Price: ₹{p.price:.2f}.{discount_text} Description: {p.description or ''}"
            
            print(f"Generating embedding for: '{p.name}'...")
            emb = embedding_model.encode(doc_text).tolist()

            ids.append(str(p.id))
            embeddings.append(emb)
            documents.append(doc_text)
            metadatas.append({
                "product_id": str(p.id),
                "name": p.name,
                "price": selling_price,
                "stock": int(p.available_quantity),
                "category": category_name,
                "farmer": p.farmer_name,
                "image_url": p.image_url or ""
            })

        print("Upserting vectors into ChromaDB...")
        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
        print("Embeddings successfully generated and stored in ChromaDB!")

    except Exception as e:
        print(f"Error generating embeddings: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    generate_all_embeddings()
