import os
from dotenv import load_dotenv

load_dotenv()

# 自宅の緯度・経度(天気取得地点)
LATITUDE = 35.70
LONGITUDE = 139.54

#出発予定時刻(24時間表記、時と分)
DEPARTURE_HOUR = 8
DEPARTURE_MINUTE = 0

# 「電車に切り替える」と判定する降水確率の閾値(%)
RAIN_THRESHOLD = 30

# LINE Messageing APIの設定
LINE_CHANNEL_ACCESS_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")