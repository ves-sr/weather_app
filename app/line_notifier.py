import requests
from app.config import LINE_CHANNEL_ACCESS_TOKEN


def send_message(message: str) -> None:
    """LINE公式アカウントの友達全員にメッセージを送信する"""
    url = "https://api.line.me/v2/bot/message/broadcast"
    headers = {
        "Authorization": f"Bearer {LINE_CHANNEL_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    body = {
        "messages": [
            {"type": "text", "text": message}
        ]
    }
    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()