from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.security import hash_password, verify_password, create_access_token
from app.models.customer import Customer
from app.schemas.customer import CustomerRegister, CustomerLogin, CustomerTokenResponse, CustomerOut


class CustomerService:
    @staticmethod
    def register(db: Session, data: CustomerRegister) -> CustomerOut:
        existing = db.query(Customer).filter(Customer.email == data.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already registered",
            )
        customer = Customer(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def login(db: Session, data: CustomerLogin) -> CustomerTokenResponse:
        customer = db.query(Customer).filter(Customer.email == data.email).first()
        if not customer or not verify_password(data.password, customer.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        access_token = create_access_token(data={"sub": str(customer.id), "role": "customer"})
        return CustomerTokenResponse(
            access_token=access_token,
            customer=CustomerOut.model_validate(customer),
        )
