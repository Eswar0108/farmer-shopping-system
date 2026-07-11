from app.core.database import SessionLocal
from app.models.category import Category
from app.models.product import Product

def seed():
    db = SessionLocal()
    
    # Ensure categories exist
    categories = {
        "Fruits": db.query(Category).filter_by(name="Fruits").first(),
        "Vegetables": db.query(Category).filter_by(name="Vegetables").first(),
        "Grains": db.query(Category).filter_by(name="Grains").first(),
        "Dairy": db.query(Category).filter_by(name="Dairy").first(),
    }
    
    # Seed products
    products = [
        {
            "name": "Organic Alphonso Mangoes",
            "category_id": categories["Fruits"].id,
            "farmer_name": "Farmer Ramesh",
            "description": "Sweet, juicy, and naturally ripened Alphonso mangoes from Devgad.",
            "price": 450.00,
            "available_quantity": 50,
            "image_url": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400"
        },
        {
            "name": "Kashmiri Red Apples",
            "category_id": categories["Fruits"].id,
            "farmer_name": "Farmer Majid",
            "description": "Crisp and sweet premium quality apples directly from Kashmir valleys.",
            "price": 180.00,
            "available_quantity": 120,
            "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"
        },
        {
            "name": "Elakki Bananas",
            "category_id": categories["Fruits"].id,
            "farmer_name": "Farmer Gowda",
            "description": "Small, sweet, and highly nutritious bananas native to South India.",
            "price": 80.00,
            "available_quantity": 200,
            "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"
        },
        {
            "name": "Organic Vine Tomatoes",
            "category_id": categories["Vegetables"].id,
            "farmer_name": "Farmer Patil",
            "description": "Juicy, chemical-free organic vine tomatoes.",
            "price": 40.00,
            "available_quantity": 150,
            "image_url": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"
        },
        {
            "name": "Fresh Spinach (Palak)",
            "category_id": categories["Vegetables"].id,
            "farmer_name": "Farmer Shinde",
            "description": "Iron-rich, fresh leafy green spinach bunch harvested daily.",
            "price": 30.00,
            "available_quantity": 80,
            "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"
        },
        {
            "name": "Organic Farm Potatoes",
            "category_id": categories["Vegetables"].id,
            "farmer_name": "Farmer Yadav",
            "description": "Earthy, nutrient-dense farm potatoes grown without pesticides.",
            "price": 35.00,
            "available_quantity": 300,
            "image_url": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"
        },
        {
            "name": "Premium Basmati Rice",
            "category_id": categories["Grains"].id,
            "farmer_name": "Farmer Singh",
            "description": "Aromatic, long-grain basmati rice aged to perfection.",
            "price": 120.00,
            "available_quantity": 500,
            "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
        },
        {
            "name": "Organic Wheat Atta",
            "category_id": categories["Grains"].id,
            "farmer_name": "Farmer Chaudhary",
            "description": "Stone-ground premium Sharbati wheat flour.",
            "price": 65.00,
            "available_quantity": 400,
            "image_url": "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400"
        },
        {
            "name": "Fresh Paneer",
            "category_id": categories["Dairy"].id,
            "farmer_name": "Farmer Kurien",
            "description": "Soft and fresh farm paneer made from whole milk.",
            "price": 320.00,
            "available_quantity": 60,
            "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"
        },
        {
            "name": "A2 Desi Cow Ghee",
            "category_id": categories["Dairy"].id,
            "farmer_name": "Farmer Sharma",
            "description": "Pure A2 desi cow milk ghee prepared using the traditional Bilona method.",
            "price": 680.00,
            "available_quantity": 100,
            "image_url": "https://images.unsplash.com/photo-1589733901241-5e39127b4d4d?w=400"
        },
        {
            "name": "Fresh Whole Milk",
            "category_id": categories["Dairy"].id,
            "farmer_name": "Farmer Kurien",
            "description": "Creamy, pasteurized farm-fresh cow milk.",
            "price": 64.00,
            "available_quantity": 150,
            "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"
        }
    ]

    for prod_data in products:
        existing = db.query(Product).filter_by(name=prod_data["name"]).first()
        if existing:
            existing.price = prod_data["price"]
            existing.available_quantity = prod_data["available_quantity"]
            existing.description = prod_data["description"]
        else:
            db.add(Product(**prod_data))
    
    db.commit()
    db.close()
    print("Database successfully seeded with realistic Indian products!")

if __name__ == "__main__":
    seed()
