from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemOut, CartOut


class CartService:
    def __init__(self, db: Session):
        self.db = db

    def get_cart(self, customer_id: UUID) -> CartOut:
        cart = self.db.query(Cart).filter(Cart.customer_id == customer_id).first()
        if not cart:
            return CartOut(items=[], total_items=0, grand_total=0.0)

        cart_items = []
        total_items = 0
        grand_total = 0.0

        for item in cart.items:
            product = item.product
            unit_price = max(0.0, float(product.price) - float(product.discount_amount))
            subtotal = unit_price * item.quantity
            cart_items.append(
                CartItemOut(
                    id=item.id,
                    product_id=product.id,
                    product_name=product.name,
                    product_image_url=product.image_url,
                    price=unit_price,
                    quantity=item.quantity,
                    subtotal=subtotal,
                    max_stock=product.available_quantity,
                )
            )
            total_items += item.quantity
            grand_total += subtotal

        return CartOut(items=cart_items, total_items=total_items, grand_total=grand_total)

    def add_to_cart(self, customer_id: UUID, data: CartItemCreate) -> CartItem:
        product = self.db.query(Product).filter(Product.id == data.product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        if not product.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product is not active")
        if data.quantity > product.available_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.available_quantity} units available in stock",
            )

        # Get or create Cart for the customer
        cart = self.db.query(Cart).filter(Cart.customer_id == customer_id).first()
        if not cart:
            cart = Cart(customer_id=customer_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)

        # Check if item already in cart
        existing = (
            self.db.query(CartItem)
            .filter(
                and_(CartItem.cart_id == cart.id, CartItem.product_id == data.product_id)
            )
            .first()
        )

        if existing:
            new_qty = existing.quantity + data.quantity
            if new_qty > product.available_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot add more. Only {product.available_quantity} units available, you already have {existing.quantity}",
                )
            existing.quantity = new_qty
            self.db.commit()
            self.db.refresh(existing)
            return existing

        cart_item = CartItem(cart_id=cart.id, product_id=data.product_id, quantity=data.quantity)
        self.db.add(cart_item)
        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    def update_cart_item(self, customer_id: UUID, product_id: UUID, data: CartItemUpdate) -> CartItem:
        cart = self.db.query(Cart).filter(Cart.customer_id == customer_id).first()
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")

        cart_item = (
            self.db.query(CartItem)
            .filter(
                and_(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
            )
            .first()
        )
        if not cart_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in cart")

        product = cart_item.product
        if data.quantity > product.available_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.available_quantity} units available in stock",
            )

        cart_item.quantity = data.quantity
        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    def remove_from_cart(self, customer_id: UUID, product_id: UUID) -> None:
        cart = self.db.query(Cart).filter(Cart.customer_id == customer_id).first()
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")

        cart_item = (
            self.db.query(CartItem)
            .filter(
                and_(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
            )
            .first()
        )
        if not cart_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in cart")
        self.db.delete(cart_item)
        self.db.commit()