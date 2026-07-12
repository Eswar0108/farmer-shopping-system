from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.ai_service import chat_with_products

router = APIRouter(prefix="/ai", tags=["AI"])


class ChatRequest(BaseModel):
    message: str


class ProductInfo(BaseModel):
    id: str
    name: str
    price: float
    stock: int
    category: str
    farmer: str
    image_url: Optional[str] = ""


class ChatResponse(BaseModel):
    message: str
    products: list


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Chat with the AI assistant to find products."""
    return chat_with_products(request.message)