from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class SettingInput(BaseModel):
    latitude: float
    longitude: float
    notify_hour: int
    notify_minute: int
    rain_threshold: float