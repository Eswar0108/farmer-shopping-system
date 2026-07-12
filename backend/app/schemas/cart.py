from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID


class CartItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(..., ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemOut(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    product_image_url: Optional[str] = None
    price: float
    quantity: int
    subtotal: float
    max_stock: int
    discount_amount: float

    class Config:
        from_attributes = True


class CartOut(BaseModel):
    items: list[CartItemOut]
    total_items: int
    grand_total: float