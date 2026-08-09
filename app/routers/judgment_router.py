from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserSetting
from app.auth import get_current_username
from app.weather_fetcher import fetch_precipitation_probability
from app.judge import judge_transport

router = APIRouter()


@router.get("/judgment")
def get_judgment(
    username: str = Depends(get_current_username),
    session: Session = Depends(get_db),
):
    """ログイン中のユーザーの、現在時点での通勤判定結果を返す"""
    user = session.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")

    setting = session.query(UserSetting).filter(UserSetting.user_id == user.id).first()
    if setting is None:
        raise HTTPException(status_code=404, detail="設定がまだ登録されていません")

    precipitation_data = fetch_precipitation_probability(setting.latitude, setting.longitude)
    result = judge_transport(precipitation_data, setting.notify_hour, setting.rain_threshold)

    return result
