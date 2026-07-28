from datetime import date
from app.config import DEPARTURE_HOUR, DEPARTURE_MINUTE, RAIN_THRESHOLD


def judge_transport(precipitation_data: dict) -> dict:
    """出発時刻の降水確率から、自転車か電車かを判定する"""
    today = date.today().isoformat()
    target_time_key = f"{today}T{DEPARTURE_HOUR:02d}:00"

    probability = precipitation_data.get(target_time_key)
    if probability is None:
        raise ValueError(f"{target_time_key}の降水確率データが見つかりません")
    
    if probability >= RAIN_THRESHOLD:
        transport = "電車"
    else:
        transport = "自転車"

    return {
        "transport": transport,
        "probability": probability,
        "time": target_time_key,
    }

    