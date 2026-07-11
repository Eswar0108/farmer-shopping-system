from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate


class CategoryService:
    @staticmethod
    def list_categories(db: Session) -> list[Category]:
        return db.query(Category).order_by(Category.name).all()

    @staticmethod
    def create_category(db: Session, data: CategoryCreate) -> Category:
        category = Category(name=data.name)
        db.add(category)
        db.commit()
        db.refresh(category)
        return category
