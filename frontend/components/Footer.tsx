export default function Footer() {
  return (
    <footer className="bg-white/55 backdrop-blur-lg backdrop-saturate-150 border-t border-card-border px-6 py-6">
      <div className="max-w-[1040px] mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-extrabold text-sm text-text">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          通勤ナビ
        </div>
        <div className="flex gap-5 text-xs text-text-dim">
          <a href="#" className="hover:text-text">
            使い方
          </a>
          <a href="#" className="hover:text-text">
            お問い合わせ
          </a>
        </div>
      </div>
      <p className="max-w-[1040px] mx-auto mt-4 text-[11px] text-text-dim/80">
        © 2026 通勤ナビ — weather_app project
      </p>
    </footer>
  );
}
