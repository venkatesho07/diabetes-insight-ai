"""
SQLAlchemy ORM models for the Diabetes Prediction System.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="doctor")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(100), nullable=False)
    pregnancies = Column(Float)
    glucose = Column(Float)
    blood_pressure = Column(Float)
    skin_thickness = Column(Float)
    insulin = Column(Float)
    bmi = Column(Float)
    diabetes_pedigree = Column(Float)
    age = Column(Float)
    result = Column(String(20), nullable=False)
    confidence = Column(Float, nullable=False)
    risk_factors = Column(Text)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
