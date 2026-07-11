from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class OrderItemOut(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    unit_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: UUID
    customer_id: UUID
    total: float
    status: str
    created_at: datetime
    items: list[OrderItemOut]

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    items: list[OrderOut]
    total: int