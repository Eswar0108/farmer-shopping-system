from uuid import UUID
from decimal import Decimal
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.order import Order, OrderItem


class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def checkout(self, customer_id: UUID) -> Order:
        cart = self.db.query(Cart).filter(Cart.customer_id == customer_id).first()
        if not cart or not cart.items:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

        total = Decimal(0)
        order_items_data = []

        for cart_item in cart.items:
            # Row locking with with_for_update() inside database transaction
            product = self.db.query(Product).filter(Product.id == cart_item.product_id).with_for_update().first()
            if not product:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
            if not product.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product '{product.name}' is no longer active",
                )
            if product.available_quantity < cart_item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.name}'. Available: {product.available_quantity}, requested: {cart_item.quantity}",
                )

            # Deduct stock
            product.available_quantity -= cart_item.quantity

            discounted_price = product.price - product.discount_amount
            if discounted_price < Decimal("0.00"):
                discounted_price = Decimal("0.00")
            subtotal = discounted_price * cart_item.quantity
            total += subtotal
            order_items_data.append({
                "product_id": product.id,
                "unit_price": discounted_price,
                "quantity": cart_item.quantity,
            })

        # Create order
        order = Order(customer_id=customer_id, total=total, status="confirmed")
        self.db.add(order)
        self.db.flush()

        for item_data in order_items_data:
            self.db.add(OrderItem(order_id=order.id, **item_data))

        # Clear cart (deleting Cart cascades to delete all CartItems)
        self.db.delete(cart)
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_orders(self, customer_id: UUID) -> list[Order]:
        return (
            self.db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.customer_id == customer_id)
            .order_by(Order.created_at.desc())
            .all()
        )

    def get_order_by_id(self, order_id: UUID, customer_id: UUID) -> Order:
        order = (
            self.db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.id == order_id, Order.customer_id == customer_id)
            .first()
        )
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return order