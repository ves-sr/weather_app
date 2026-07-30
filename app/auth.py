from datetime import datetime, timedelta, timezone

from fastapi import Header, HTTPException
from jose import jwt, JWTError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "weather-app-super-secret-key"
ALGORITHM = "HS256"
EXPIRE_MINUTES = 30


def hash_password(plain_password: str) -> str:
    """パスワードをハッシュ化する"""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """入力されたパスワードが、保存されているパスワードと一致するか確認する"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(username: str) -> str:
    """ログイン成功時に、通行証(JWT)を発行する"""
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES)
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_username(authorization: str = Header(...)) -> str:
    """リクエストのヘッダーからJWTを取り出し、検証して、ユーザー名を返す"""
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="トークンが不正です")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="トークンが無効か期限切れです")




