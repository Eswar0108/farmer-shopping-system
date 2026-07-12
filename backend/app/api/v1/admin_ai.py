from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.ai_service import generate_product_description, suggest_price
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/admin/ai", tags=["Admin AI"])


class DescribeRequest(BaseModel):
    name: str
    price: float
    category: str
    farmer_name: str


class DescribeResponse(BaseModel):
    description: str


class SuggestPriceRequest(BaseModel):
    product_name: str
    category: str


class SuggestPriceResponse(BaseModel):
    price: str
    range: str
    reason: str


@router.post("/describe", response_model=DescribeResponse)
def describe_product(
    request: DescribeRequest,
    admin=Depends(get_current_admin)
):
    """Generate a product description using AI."""
    description = generate_product_description(
        name=request.name,
        price=request.price,
        category=request.category,
        farmer_name=request.farmer_name
    )
    return DescribeResponse(description=description)


@router.post("/suggest-price", response_model=SuggestPriceResponse)
def suggest_product_price(
    request: SuggestPriceRequest,
    admin=Depends(get_current_admin)
):
    """Suggest a competitive price using AI."""
    result = suggest_price(
        product_name=request.product_name,
        category=request.category
    )
    return SuggestPriceResponse(**result)