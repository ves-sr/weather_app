from app.weather_fetcher import fetch_precipitation_probability
from app.judge import judge_transport
from app.line_notifier import send_message

def run() -> None:
    """天気を取得し、判定し、LINEに通知する一連の流れを実行する"""
    precipitation_data = fetch_precipitation_probability()
    result = judge_transport(precipitation_data)

    message = (
    f"【今日の通勤判定】\n"
    f"{result['time'][11:]}時点の降水確率:{result['probability']}%\n"
    f"->今日は「{result['transport']}」通勤がおすすめです"
    )
    send_message(message)


if __name__ == "__main__":
    run()
