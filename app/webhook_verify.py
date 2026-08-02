import base64
import hashlib
import hmac
import os

from dotenv import load_dotenv

load_dotenv()

LINE_CHANNEL_SECRET = os.getenv("LINE_CHANNEL_SECRET")


def verify_signature(body: bytes, signature: str) -> bool:
    """LINEから送られてきたWebhookが本物か、署名を検証する"""
    hash_value = hmac.new(
        LINE_CHANNEL_SECRET.encode("utf-8"),
        body,
        hashlib.sha256,
    ).digest()
    expected_signature = base64.b64encode(hash_value).decode("utf-8")
    return hmac.compare_digest(expected_signature, signature)