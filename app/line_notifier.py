import os
import requests

from dotenv import load_dotenv

load_dotenv()

LINE_CHANNEL_ACCESS_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")


def send_message_to_user(line_user_id: str, message: str) -> None:
    """指定したLINEユーザーに、個別にメッセージを送信する"""
    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Authorization": f"Bearer {LINE_CHANNEL_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    body = {
        "to": line_user_id,
        "messages": [
            {"type": "text", "text": message}
        ]
    }

    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()