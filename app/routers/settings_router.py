from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import SettingInput
from app.database import get_db
from app.models import User, UserSetting
from app.auth import get_current_username

router = APIRouter()


@router.post("/settings")
def register_setting(
    setting: SettingInput,
    username: str = Depends(get_current_username),
    session: Session = Depends(get_db),
):
    """ログイン中のユーザーの通知設定を登録・更新する"""
    user = session.query(User).filter(User.username==username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")

    existing_setting = session.query(UserSetting).filter(UserSetting.user_id==user.id).first()

    if existing_setting is not None:
        existing_setting.latitude = setting.latitude
        existing_setting.longitude = setting.longitude
        existing_setting.notify_hour = setting.notify_hour
        existing_setting.notify_minute = setting.notify_minute
        existing_setting.rain_threshold = setting.rain_threshold
    else:
        new_setting = UserSetting(
            user_id=user.id,
            latitude=setting.latitude,
            longitude=setting.longitude,
            notify_hour=setting.notify_hour,
            notify_minute=setting.notify_minute,
            rain_threshold=setting.rain_threshold,
        )
        session.add(new_setting)
    
    session.commit()
    return {"message": "設定を保存しました"}


@router.get("/settings")
def get_setting(
    username: str = Depends(get_current_username),
    session: Session = Depends(get_db)
):
    """ログイン中のユーザーの通知設定を取得する"""
    user = session.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    setting = session.query(UserSetting).filter(UserSetting.user_id == user.id).first()

    if setting is None:
        raise HTTPException(status_code=404, detail="設定がまだ登録されていません")

    return {
        "latitude": setting.latitude,
        "longitude": setting.longitude,
        "notify_hour": setting.notify_hour,
        "notify_minute": setting.notify_minute,
        "rain_threshold": setting.rain_threshold,
    }



