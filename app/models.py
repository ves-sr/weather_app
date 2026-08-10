import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    line_user_id = Column(String, unique=True, nullable=True)
    link_code = Column(String, unique=True, nullable=True)
    

    setting = relationship("UserSetting", back_populates="user", uselist=False)


class UserSetting(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer,  ForeignKey("users.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    notify_hour = Column(Integer, nullable=False)
    notify_minute = Column(Integer, nullable=False)
    rain_threshold = Column(Float, nullable=False)

    user = relationship("User", back_populates="setting")


Base.metadata.create_all(bind=engine)
