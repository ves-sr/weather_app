import requests


def fetch_precipitation_probability(latitude: float, longitude: float) -> dict:
    """Open-Meteoから、今日の1時間ごとの降水確率を取得する"""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": "precipitation_probability",
        "timezone": "Asia/Tokyo",
        "forecast_days": 1,
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()

    times = data["hourly"]["time"]
    probabilities = data["hourly"]["precipitation_probability"]

    return dict(zip(times, probabilities))


