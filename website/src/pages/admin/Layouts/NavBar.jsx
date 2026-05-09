
import { Search, Bell, Moon, Sun, Menu, Wallet, ChevronDown, PanelLeft } from 'lucide-react';

export default function Navbar({ sidebarCollapsed, setSidebarCollapsed, setSidebarOpen, searchQuery, setSearchQuery, notifications, darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-30 bg-[#4a154a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-white">
            <Menu size={24} />
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <PanelLeft size={20} className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 w-80 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/10">
            <Wallet size={18} className="text-green-400" />
            <span className="text-sm font-bold text-white">৳ 2,15,000</span>
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-2xl hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="relative p-2.5 rounded-2xl hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#4a154a]">
                {notifications}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer">
              AD
            </div>
            <ChevronDown size={16} className="text-white/50 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
