from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_customer
from app.models.customer import Customer
from app.services.cart_service import CartService
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartOut

router = APIRouter(prefix="/cart", tags=["Cart"])


def get_cart_service(db: Session = Depends(get_db)) -> CartService:
    return CartService(db)


@router.get("", response_model=CartOut)
def get_cart(
    customer: Customer = Depends(get_current_customer),
    service: CartService = Depends(get_cart_service),
):
    return service.get_cart(customer.id)


@router.post("/items", status_code=status.HTTP_201_CREATED)
def add_to_cart(
    data: CartItemCreate,
    customer: Customer = Depends(get_current_customer),
    service: CartService = Depends(get_cart_service),
):
    return service.add_to_cart(customer.id, data)


@router.put("/items/{product_id}")
def update_cart_item(
    product_id: UUID,
    data: CartItemUpdate,
    customer: Customer = Depends(get_current_customer),
    service: CartService = Depends(get_cart_service),
):
    return service.update_cart_item(customer.id, product_id, data)


@router.delete("/items/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_cart(
    product_id: UUID,
    customer: Customer = Depends(get_current_customer),
    service: CartService = Depends(get_cart_service),
):
    service.remove_from_cart(customer.id, product_id)