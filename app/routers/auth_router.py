from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.schemas import UserCreate, LoginRequest
from app.database import get_db
from app.models import User
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, session: Session = Depends(get_db)):
    """新しいユーザーを登録する"""

    existing_user = session.query(User).filter(User.username == user.username).first()
    if existing_user is not None:
        raise HTTPException(status_code=400, detail="そのユーザー名はすでに使われています")
    
    new_user = User(
        username=user.username,
        hashed_password=hash_password(user.password)        
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"id": new_user.id, "username":new_user.username}


@router.post("/login")
def login(request: LoginRequest, session: Session = Depends(get_db)):
    user = session.query(User).filter(User.username == request.username).first()

    if user is None or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが正しくありません")

    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}
