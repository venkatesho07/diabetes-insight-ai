"""
Database initialization script.
Creates all tables and a default admin/doctor user.

Usage:
    cd backend
    python init_db.py
"""

from database import engine, SessionLocal, Base
from models import User, Prediction  # noqa: F401  (import so tables are registered)
from auth import hash_password


def init():
    print("🔧 Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if default user already exists
        existing = db.query(User).filter(User.username == "admin").first()
        if existing:
            print("ℹ️  Default admin user already exists.")
        else:
            admin = User(
                username="admin",
                password_hash=hash_password("admin123"),
                role="doctor",
            )
            db.add(admin)
            db.commit()
            print("✅ Default user created — username: admin | password: admin123")

        print("✅ Database initialized successfully!")
        print(f"   Tables: {', '.join(Base.metadata.tables.keys())}")
    finally:
        db.close()


if __name__ == "__main__":
    init()
