from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.customer import CustomerRegister, CustomerLogin, CustomerOut, CustomerTokenResponse
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customer/auth", tags=["Customer Authentication"])


@router.post("/register", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def register(data: CustomerRegister, db: Session = Depends(get_db)):
    return CustomerService.register(db, data)


@router.post("/login", response_model=CustomerTokenResponse)
def login(data: CustomerLogin, db: Session = Depends(get_db)):
    return CustomerService.login(db, data)
