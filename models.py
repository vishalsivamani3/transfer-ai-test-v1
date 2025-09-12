"""
Database models for the scraper system
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class College(Base):
    """College model based on the database schema"""
    __tablename__ = 'colleges'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, unique=True)
    type = Column(String(50))
    city = Column(String(100))
    state = Column(String(50))
    website = Column(String(255))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class Course(Base):
    """Course model based on the database schema"""
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    college_id = Column(Integer, ForeignKey('colleges.id'), nullable=False)
    course_code = Column(String(50), nullable=False)
    course_title = Column(String(255), nullable=False)
    units = Column(Float)
    description = Column(Text)
    department = Column(String(100))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)