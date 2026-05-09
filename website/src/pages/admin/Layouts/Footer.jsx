

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#4a154a]/50 backdrop-blur-sm mt-6">
      <div className="px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🫙</span>
          <span className="text-sm font-semibold text-white">HBC Achar</span>
          <span className="text-xs text-white/50">© 2026 All rights reserved</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Support</a>
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Privacy</a>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/50">v2.4.0</span>
        </div>
      </div>
    </footer>
  );
}
