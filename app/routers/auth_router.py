from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models import SessionLocal, User
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()


class UserCreate(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register(user: UserCreate):
    """新しいユーザーを登録する"""
    session = SessionLocal()

    existing_user = session.query(User).filter(User.username == user.username).first()
    if existing_user is not None:
        session.close()
        raise HTTPException(status_code=400, detail="そのユーザー名はすでに使われています")
    
    new_user = User(
        username=user.username,
        hashed_password=hash_password(user.password)        
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    session.close()

    return {"id": new_user.id, "username":new_user.username}


@router.post("/login")
def login(request: LoginRequest):
    session = SessionLocal()
    user = session.query(User).filter(User.username == request.username).first()
    session.close()

    if user is None or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが正しくありません")

    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}
