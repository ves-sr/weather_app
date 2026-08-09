"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { login } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(username, password);
      saveToken(result.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ログインに失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[420px] mx-auto px-6 py-16">
      <Card strong className="p-8">
        <p className="text-xs tracking-widest uppercase text-text-dim font-bold mb-2">
          Login
        </p>
        <h1 className="text-2xl font-extrabold text-text mb-6">ログイン</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-text-dim mb-1.5">
              ユーザー名
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-white/60 px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-dim mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-white/60 px-4 py-2.5 text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <p className="text-sm text-text-dim mt-6">
          アカウントをお持ちでない方は{" "}
          <a href="/register" className="text-accent font-bold">
            新規登録
          </a>
        </p>
      </Card>
    </div>
  );
}
