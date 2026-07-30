#　天気*通勤判断アプリ

自転車通勤・電車通勤を切り替えている社会人向けに、
天気予報から「今日は自転車 or 電車どちらで通勤するべきか」を
判定し、LINEに自動通知するツールです。

##　背景・課題

普段は自転車通勤をしているが、雨・雪の日は電車通気に切り替えている。
出発直前(10分前)に急な降雨があると、電車に切り替えるための
準備時間が足りず慌ててしまう、という課題を解決するために開発した。

開発にあたっては既存の天気・服装提案アプリ（そらコーデ、
Yahoo！天気コーデ等）を調査した上で、「服装」でも「傘」でもなく
「交通手段の判断支援」という、既存アプリにない切り口に絞った。

##　主な機能

- Open-Meteo APIから、出発時刻前後の降水確率を取得
- 降水確率が閾値を超えていたら「電車」、それ以外は「自転車」と判定
- 判定結果を、決まった時刻にLINEへ自動通知
- cronによる完全自動実行

## 使用技術

- Python 3.9
- requests（外部API連携）
-　Open-Meteo API(天気情報取得)
- LINE Messaging API(通知)
- python-dotenv（環境変数管理）
-cron(定期実行)

## ディレクトリ構成

```
weather_app/
├── app/
│   ├── config.py            # 緯度経度・閾値・LINE設定
│   ├── weather_fetcher.py   # Open-Meteoから天気取得
│   ├── judge.py             # 自転車/電車の判定ロジック
│   ├── line_notifier.py     # LINE通知の送信
│   └── main.py              # 全体の実行フロー
└── scripts/
    └── run_daily.sh         # cron用の自動実行スクリプト
```

## セットアップ方法

'''bash
pip install -r requirements.txt
'''

'.env'に以下を設定してください。

'''
LINE_CAHNNEL_ACCCESS_TOKEN=your_token_here
'''

'app/config.py'で、自宅の緯度、経度、出発時刻、降水確率の閾値を設定してください。

 ## 実行方法

 '''bash
 python3 -m app.main
 '''
 
## 自動実行(cron)
'scripts/run_daily.sh'をcrontabに登録することで、
平日の決まった時刻に自動実行されます。

 ## 今後の展望

 - ユーザー登録機能を追加し、複数人が使えるようにする(Webhook + userId方式への移行)
 - 電車・バスの遅延情報との連携（OOPD等のオープンデータAPI活用を検討）
 - 退勤時刻の天気を考慮した帰宅判断通知