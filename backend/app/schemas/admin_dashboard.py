from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class LowStockProduct(BaseModel):
    id: UUID
    name: str
    available_quantity: int
    price: float


class RecentOrder(BaseModel):
    id: UUID
    customer_email: str
    total: float
    status: str
    created_at: datetime


class DashboardStatsResponse(BaseModel):
    total_products: int
    active_products: int
    inactive_products: int
    total_inventory: int
    total_categories: int
    total_orders: int
    total_revenue: float
    low_stock_products: list[LowStockProduct]
    recent_orders: list[RecentOrder]
    category_distribution: dict[str, int]
