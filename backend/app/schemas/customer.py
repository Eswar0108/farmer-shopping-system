from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime


class CustomerRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=50)


class CustomerLogin(BaseModel):
    email: EmailStr
    password: str


class CustomerOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class CustomerTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer: CustomerOut
