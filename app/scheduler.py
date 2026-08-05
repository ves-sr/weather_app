from datetime import datetime

from app.models import SessionLocal, User, UserSetting
from app.weather_fetcher import fetch_precipitation_probability
from app.judge import judge_transport
from app.line_notifier import send_message_to_user


def run_scheduler() -> None:
    """今の時刻に該当するユーザーを探し、該当者にだけ通知する"""
    now = datetime.now()
    session = SessionLocal()

    settings = session.query(UserSetting).filter(
        UserSetting.notify_hour == now.hour,
        UserSetting.notify_minute == now.minute,
    ).all()

    for setting in settings:
        user = session.query(User).filter(User.id == setting.user_id).first()
        if user is None or user.line_user_id is None:
            continue
        try:
            precipitation_data = fetch_precipitation_probability(setting.latitude, setting.longitude)
            result = judge_transport(precipitation_data, setting.notify_hour, setting.rain_threshold)

            message = (
            f"【今日の通勤判定】\n"
            f"{result['time'][11:]} 時点の降水確率： {result['probability']}%\n"
            f"→ 今日は「{result['transport']}」通勤がおすすめ！！"
        )
            send_message_to_user(user.line_user_id, message)
        except Exception as e:
            print(f"{user.username}への通知に失敗しました: {e}")
            continue
    session.close()


if __name__ == "__main__":
    run_scheduler()

