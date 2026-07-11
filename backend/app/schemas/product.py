from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID
from app.schemas.category import CategoryOut


class ProductOut(BaseModel):
    id: UUID
    name: str
    category_id: UUID
    category: Optional[CategoryOut] = None
    farmer_name: str
    description: Optional[str] = None
    price: float
    available_quantity: int
    image_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category_id: UUID
    farmer_name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    available_quantity: int = Field(..., ge=0)
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category_id: Optional[UUID] = None
    farmer_name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    available_quantity: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class ProductStatusUpdate(BaseModel):
    is_active: bool


class ProductStockUpdate(BaseModel):
    available_quantity: int = Field(..., ge=0)


class ProductListResponse(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    limit: int