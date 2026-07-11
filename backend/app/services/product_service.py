from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_product_list(
        self,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        category_id: Optional[UUID] = None,
        is_active: Optional[bool] = None,
    ):
        query = self.db.query(Product).options(joinedload(Product.category))

        if search:
            query = query.filter(Product.name.ilike(f"%{search}%"))
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if is_active is not None:
            query = query.filter(Product.is_active == is_active)

        total = query.count()
        items = query.order_by(Product.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

        return items, total

    def get_product_by_id(self, product_id: UUID) -> Product:
        product = (
            self.db.query(Product)
            .options(joinedload(Product.category))
            .filter(Product.id == product_id)
            .first()
        )
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product

    def create_product(self, data: ProductCreate) -> Product:
        self._get_category_or_404(data.category_id)

        product = Product(**data.model_dump())
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return self.get_product_by_id(product.id)

    def update_product(self, product_id: UUID, data: ProductUpdate) -> Product:
        product = self.get_product_by_id(product_id)
        update_data = data.model_dump(exclude_unset=True)

        if "category_id" in update_data:
            self._get_category_or_404(update_data["category_id"])

        for key, value in update_data.items():
            setattr(product, key, value)

        self.db.commit()
        self.db.refresh(product)
        return self.get_product_by_id(product.id)

    def delete_product(self, product_id: UUID) -> None:
        product = self.get_product_by_id(product_id)
        self.db.delete(product)
        self.db.commit()

    def update_status(self, product_id: UUID, is_active: bool) -> Product:
        product = self.get_product_by_id(product_id)
        product.is_active = is_active
        self.db.commit()
        self.db.refresh(product)
        return product

    def update_stock(self, product_id: UUID, available_quantity: int) -> Product:
        product = self.get_product_by_id(product_id)
        product.available_quantity = available_quantity
        self.db.commit()
        self.db.refresh(product)
        return product

    def _get_category_or_404(self, category_id: UUID) -> Category:
        category = self.db.query(Category).filter(Category.id == category_id).first()
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return category