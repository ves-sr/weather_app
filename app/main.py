from fastapi import FastAPI

from app.routers import auth_router, settings_router, webhook_router

app = FastAPI(title="天気×通勤判断アプリ")

app.include_router(auth_router.router)
app.include_router(settings_router.router)
app.include_router(webhook_router.router)