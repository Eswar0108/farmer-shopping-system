from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.services.product_service import ProductService
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductOut,
    ProductListResponse,
    ProductStatusUpdate,
    ProductStockUpdate,
)

router = APIRouter(prefix="/products", tags=["Products"])


def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(db)


@router.get("", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[UUID] = Query(None),
    is_active: Optional[bool] = Query(None),
    service: ProductService = Depends(get_product_service),
):
    items, total = service.get_product_list(
        page=page, limit=limit, search=search, category_id=category_id, is_active=is_active
    )
    return ProductListResponse(items=items, total=total, page=page, limit=limit)


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: UUID, service: ProductService = Depends(get_product_service)):
    return service.get_product_by_id(product_id)


@router.post("", response_model=ProductOut, status_code=201)
def create_product(
    data: ProductCreate,
    service: ProductService = Depends(get_product_service),
    admin=Depends(get_current_admin),
):
    return service.create_product(data)


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: UUID,
    data: ProductUpdate,
    service: ProductService = Depends(get_product_service),
    admin=Depends(get_current_admin),
):
    return service.update_product(product_id, data)


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: UUID,
    service: ProductService = Depends(get_product_service),
    admin=Depends(get_current_admin),
):
    service.delete_product(product_id)


@router.patch("/{product_id}/status", response_model=ProductOut)
def update_product_status(
    product_id: UUID,
    data: ProductStatusUpdate,
    service: ProductService = Depends(get_product_service),
    admin=Depends(get_current_admin),
):
    return service.update_status(product_id, data.is_active)


@router.patch("/{product_id}/stock", response_model=ProductOut)
def update_product_stock(
    product_id: UUID,
    data: ProductStockUpdate,
    service: ProductService = Depends(get_product_service),
    admin=Depends(get_current_admin),
):
    return service.update_stock(product_id, data.available_quantity)