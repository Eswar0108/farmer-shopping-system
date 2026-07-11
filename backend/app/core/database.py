from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Neon uses connection pooling with SSL. Use create_engine_pool for production.
# For Neon DB, append ?sslmode=require to your connection string.
connect_args = {}
if "neon.tech" in settings.DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()