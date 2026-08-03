from fastapi import APIRouter, Header, HTTPException, Request, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.webhook_verify import verify_signature

router = APIRouter()


@router.post("/webhook")
async def receive_webhook(
    request: Request,
    x_line_signature: str = Header(...),
    session: Session = Depends(get_db)
):
    """LINEからのWebhookを受け取り、連携コードを照合してuserIdを紐付ける"""
    body = await request.body()

    if not verify_signature(body, x_line_signature):
        raise HTTPException(status_code=403, detail="署名が正しくありません")

    payload = await request.json()

    for event in payload.get("events", []):
        if event.get("type") != "message":
            continue
        if event.get("message").get("type") != "text":
            continue

        code = event["message"]["text"]
        line_user_id = event["source"]["userId"]

        user = session.query(User).filter(User.link_code == code).first()
        if user is not None:
            user.line_user_id = line_user_id
            user.link_code = None
            session.commit()

    return {"message": "ok"}

