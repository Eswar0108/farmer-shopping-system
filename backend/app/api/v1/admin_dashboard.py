from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.product import Product
from app.models.category import Category
from app.models.order import Order
from app.schemas.admin_dashboard import DashboardStatsResponse, LowStockProduct, RecentOrder
from sqlalchemy import func

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    # 1. Total & Active Products
    total_products = db.query(Product).count()
    active_products = db.query(Product).filter(Product.is_active == True).count()
    inactive_products = total_products - active_products

    # 2. Total Inventory quantity
    total_inventory_res = db.query(func.sum(Product.available_quantity)).scalar()
    total_inventory = int(total_inventory_res) if total_inventory_res is not None else 0

    # 3. Total Categories
    total_categories = db.query(Category).count()

    # 4. Total Orders & Revenue
    total_orders = db.query(Order).count()
    total_revenue_res = db.query(func.sum(Order.total)).scalar()
    total_revenue = float(total_revenue_res) if total_revenue_res is not None else 0.0

    # 5. Low Stock Products (< 5 quantity)
    low_stock_items = (
        db.query(Product)
        .filter(Product.available_quantity < 5)
        .order_by(Product.available_quantity.asc())
        .limit(10)
        .all()
    )
    low_stock_products = [
        LowStockProduct(
            id=item.id,
            name=item.name,
            available_quantity=item.available_quantity,
            price=float(item.price)
        )
        for item in low_stock_items
    ]

    # 6. Recent Orders (with customer email)
    recent_orders_items = (
        db.query(Order)
        .options(joinedload(Order.customer))
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )
    recent_orders = [
        RecentOrder(
            id=item.id,
            customer_email=item.customer.email if item.customer else "Unknown Customer",
            total=float(item.total),
            status=item.status,
            created_at=item.created_at
        )
        for item in recent_orders_items
    ]

    # 7. Category Distribution
    category_counts = (
        db.query(Category.name, func.count(Product.id))
        .outerjoin(Product, Category.id == Product.category_id)
        .group_by(Category.name)
        .all()
    )
    category_distribution = {name: count for name, count in category_counts}

    return DashboardStatsResponse(
        total_products=total_products,
        active_products=active_products,
        inactive_products=inactive_products,
        total_inventory=total_inventory,
        total_categories=total_categories,
        total_orders=total_orders,
        total_revenue=total_revenue,
        low_stock_products=low_stock_products,
        recent_orders=recent_orders,
        category_distribution=category_distribution
    )
