# 天気×通勤判断アプリ（フロントエンド）

`weather_app`バックエンド（FastAPI）と連携する、Next.js製のWebフロントエンドです。

## 使用技術

- Next.js（App Router）
- TypeScript
- Tailwind CSS

## 開発サーバーの起動方法

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと確認できます。

## 主なページ（実装予定を含む）

- `/login` … ログイン
- `/register` … 新規登録
- `/settings` … 通知設定（緯度経度・通知時刻・閾値）
- `/dashboard` … 今日の通勤判定結果

## バックエンドとの連携

`lib/api.ts` に、バックエンドAPI（FastAPI, `weather_app/app`）を呼び出す処理をまとめています。
