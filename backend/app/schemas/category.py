from pydantic import BaseModel, Field
from uuid import UUID


class CategoryOut(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
