from fastapi import FastAPI

from app.routers import auth_router

app = FastAPI(title="天気×通勤判断アプリ")

app.include_router(auth_router.router)