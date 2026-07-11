from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_customer
from app.models.customer import Customer
from app.services.order_service import OrderService
from app.schemas.order import OrderOut, OrderListResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(db)


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def checkout(
    customer: Customer = Depends(get_current_customer),
    service: OrderService = Depends(get_order_service),
):
    return service.checkout(customer.id)


@router.get("", response_model=OrderListResponse)
def list_orders(
    customer: Customer = Depends(get_current_customer),
    service: OrderService = Depends(get_order_service),
):
    items = service.get_orders(customer.id)
    return OrderListResponse(items=items, total=len(items))


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: UUID,
    customer: Customer = Depends(get_current_customer),
    service: OrderService = Depends(get_order_service),
):
    return service.get_order_by_id(order_id, customer.id)