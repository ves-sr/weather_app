export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/55 backdrop-blur-lg backdrop-saturate-150 border-b border-card-border">
      <a
        href="/"
        className="flex items-center gap-2 font-extrabold text-text hover:opacity-80 transition-opacity"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(255,90,31,0.6)]" />
        通勤ナビ
      </a>
    </header>
  );
}
