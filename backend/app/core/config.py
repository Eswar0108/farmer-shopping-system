from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Farmer Shopping System"
    DEBUG: bool = True
    CORS_ORIGINS: str = "*"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/farmer_shopping"

    # JWT
    SECRET_KEY: str = "change-this-to-a-secure-random-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Admin seed
    ADMIN_EMAIL: str = "admin@farmershop.com"
    ADMIN_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()