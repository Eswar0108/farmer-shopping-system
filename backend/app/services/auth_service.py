from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.models.admin import Admin
from app.schemas.auth import LoginRequest, TokenResponse


class AuthService:
    @staticmethod
    def login(db: Session, data: LoginRequest) -> TokenResponse:
        admin = db.query(Admin).filter(Admin.email == data.email).first()
        if not admin or not verify_password(data.password, admin.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        access_token = create_access_token(data={"sub": str(admin.id), "role": "admin"})
        return TokenResponse(access_token=access_token)

    @staticmethod
    def seed_admin(db: Session) -> dict:
        existing = db.query(Admin).filter(Admin.email == settings.ADMIN_EMAIL).first()
        if existing:
            return {"message": "Admin already exists"}
        admin = Admin(
            email=settings.ADMIN_EMAIL,
            password_hash=hash_password(settings.ADMIN_PASSWORD),
        )
        db.add(admin)
        db.commit()
        return {"message": "Admin seeded successfully"}
