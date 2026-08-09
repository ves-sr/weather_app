"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { getJudgment, getSettings, Judgment, Setting } from "@/lib/api";
import { getToken, clearToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [judgment, setJudgment] = useState<Judgment | null>(null);
  const [setting, setSetting] = useState<Setting | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    Promise.all([getJudgment(token), getSettings(token)])
      .then(([judgmentData, settingData]) => {
        setJudgment(judgmentData);
        setSetting(settingData);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "判定結果の取得に失敗しました。設定がまだ未登録の可能性があります"
        );
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (loading) {
    return <p className="text-center text-text-dim py-16">読み込み中...</p>;
  }

  const isBike = judgment?.transport === "自転車";

  return (
    <div className="max-w-[1040px] mx-auto px-6 py-10 flex flex-col gap-5">
      <div>
        <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-2">
          Dashboard
        </p>
        <h1 className="text-2xl font-extrabold text-text">今日の通勤判定</h1>
      </div>

      {error && (
        <Card className="p-6">
          <p className="text-sm text-red-600">{error}</p>
          <a href="/settings" className="text-accent text-sm font-bold mt-2 inline-block">
            設定を登録する →
          </a>
        </Card>
      )}

      {judgment && setting && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Card strong className="md:col-span-12 p-8">
            <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-3">
              {judgment.time.slice(11)}時点の予報
            </p>
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div
                  className={`w-17 h-17 rounded-2xl flex items-center justify-center text-4xl border ${
                    isBike
                      ? "bg-go/20 border-go/45"
                      : "bg-alt/20 border-alt/45"
                  }`}
                >
                  {isBike ? "🚲" : "🚃"}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-text">
                    {judgment.transport}がおすすめです
                  </h2>
                  <p className="text-text-dim text-sm mt-1">
                    降水確率が閾値({setting.rain_threshold}%)を
                    {isBike ? "下回っています" : "上回っています"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-5xl font-extrabold tabular-nums ${
                    isBike ? "text-go" : "text-alt"
                  }`}
                >
                  {judgment.probability}
                  <span className="text-xl">%</span>
                </div>
                <p className="text-text-dim text-sm">降水確率</p>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-4 p-6">
            <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-3">
              通知時刻
            </p>
            <div className="text-2xl font-extrabold text-text tabular-nums">
              {String(setting.notify_hour).padStart(2, "0")}:
              {String(setting.notify_minute).padStart(2, "0")}
            </div>
            <p className="text-text-dim text-xs mt-1.5">毎日この時刻に自動通知</p>
          </Card>

          <Card className="md:col-span-4 p-6">
            <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-3">
              切替の閾値
            </p>
            <div className="text-2xl font-extrabold text-alt tabular-nums">
              {setting.rain_threshold}%
            </div>
            <p className="text-text-dim text-xs mt-1.5">これ以上で電車をおすすめ</p>
          </Card>

          <Card className="md:col-span-4 p-6">
            <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-3">
              対象地点
            </p>
            <div className="text-lg font-extrabold text-text">
              {setting.latitude}, {setting.longitude}
            </div>
            <p className="text-text-dim text-xs mt-1.5">緯度・経度</p>
          </Card>

          <Card className="md:col-span-12 p-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-text-dim">
              設定を変更したい場合はこちらから
            </p>
            <div className="flex gap-3">
              <a href="/settings">
                <Button variant="primary">設定を編集</Button>
              </a>
              <Button variant="ghost" onClick={handleLogout} type="button">
                ログアウト
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
