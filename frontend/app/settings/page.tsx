"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { getSettings, updateSettings, issueLinkCode, Setting } from "@/lib/api";
import { getToken } from "@/lib/auth";

const emptySetting: Setting = {
  latitude: 35.7,
  longitude: 139.54,
  notify_hour: 7,
  notify_minute: 50,
  rain_threshold: 30,
};

export default function SettingsPage() {
  const router = useRouter();
  const [setting, setSetting] = useState<Setting>(emptySetting);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [linkCode, setLinkCode] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    getSettings(token)
      .then((data) => setSetting(data))
      .catch(() => {
        // 設定がまだ無いユーザーは、初期値のまま表示する
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await updateSettings(token, setting);
      setMessage("設定を保存しました");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  async function handleIssueLinkCode() {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    const result = await issueLinkCode(token);
    setLinkCode(result.link_code);
  }

  function updateField(field: keyof Setting, value: number) {
    setSetting((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return <p className="text-center text-text-dim py-16">読み込み中...</p>;
  }

  return (
    <div className="max-w-[640px] mx-auto px-6 py-16 flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-2">
          Settings
        </p>
        <h1 className="text-2xl font-extrabold text-text">通知設定</h1>
      </div>

      <Card strong className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-dim mb-1.5">緯度</label>
              <input
                type="number"
                step="0.01"
                value={setting.latitude}
                onChange={(e) => updateField("latitude", Number(e.target.value))}
                className="w-full rounded-xl border border-card-border bg-white/60 px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-dim mb-1.5">経度</label>
              <input
                type="number"
                step="0.01"
                value={setting.longitude}
                onChange={(e) => updateField("longitude", Number(e.target.value))}
                className="w-full rounded-xl border border-card-border bg-white/60 px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-dim mb-1.5">通知時(0-23)</label>
              <input
                type="number"
                min={0}
                max={23}
                value={setting.notify_hour}
                onChange={(e) => updateField("notify_hour", Number(e.target.value))}
                className="w-full rounded-xl border border-card-border bg-white/60 px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-dim mb-1.5">通知分(0-59)</label>
              <input
                type="number"
                min={0}
                max={59}
                value={setting.notify_minute}
                onChange={(e) => updateField("notify_minute", Number(e.target.value))}
                className="w-full rounded-xl border border-card-border bg-white/60 px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-dim mb-1.5">
              切替の閾値(降水確率 %)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={setting.rain_threshold}
              onChange={(e) => updateField("rain_threshold", Number(e.target.value))}
              className="w-full rounded-xl border border-card-border bg-white/60 px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          {message && <p className="text-sm text-go font-bold">{message}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "保存中..." : "設定を保存"}
          </Button>
        </form>
      </Card>

      <Card className="p-8">
        <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-4">
          LINE連携
        </p>
        <Button variant="ghost" onClick={handleIssueLinkCode} type="button">
          連携コードを発行
        </Button>
        {linkCode && (
          <p className="mt-4 text-sm text-text-dim">
            このコードを、LINEの公式アカウントにメッセージとして送信してください:{" "}
            <span className="font-extrabold text-accent text-lg tracking-widest">
              {linkCode}
            </span>
          </p>
        )}
      </Card>
    </div>
  );
}
