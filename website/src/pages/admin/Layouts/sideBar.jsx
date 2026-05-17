import  { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, ShoppingBag, Package, Layers, Zap, Users,
  Wallet, FileText, Ticket, Image, Star, Truck, BarChart3,
  Settings, ChevronDown, Grid3X3, FolderTree
} from 'lucide-react';

const sidebarConfig = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', badge: '156' },
  {
    icon: Package,
    label: 'Products',
    children: [
      { icon: Package, label: 'Products', path: '/admin/products' },
      { icon: Layers, label: 'Product Variations', path: '/admin/product-variations' },
      { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
      { icon: Grid3X3, label: 'Sub-Categories', path: '/admin/sub-categories' },
    ]
  },
  { icon: Zap, label: 'Flash Sale', path: '/admin/settings?tab=flash', badge: 'LIVE' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: Wallet, label: 'Wallet', path: '/admin/wallet' },
  { icon: FileText, label: 'Landing Pages', path: '/admin/landing-pages' },
  { icon: Ticket, label: 'Coupons', path: '/admin/coupons', badge: '12' },
  { icon: Image, label: 'Campaign Banner', path: '/admin/campaign-banner' },
  { icon: Star, label: 'Reviews', path: '/admin/reviews', badge: '24' },
  { icon: Truck, label: 'Delivery System', path: '/admin/delivery' },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

// ─── Tooltip Component ───
const Tooltip = ({ text, show }) => (
  <div
    className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-white text-gray-800 text-sm font-semibold rounded-xl shadow-xl whitespace-nowrap z-60 transition-all duration-200 pointer-events-none ${
      show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
    }`}
  >
    {text}
    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
  </div>
);

// ─── Sidebar Item ───
const SidebarItem = ({ item, activePath, onNavigate, sidebarCollapsed }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activePath === item.path || (hasChildren && item.children.some(c => activePath === c.path));
  const [expanded, setExpanded] = useState(() =>
    hasChildren && item.children.some(c => activePath === c.path)
  );
  const [tooltip, setTooltip] = useState(false);

  // Collapsed mode
  if (sidebarCollapsed) {
    if (hasChildren) {
      return (
        <div className="relative">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`w-full flex items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'bg-linear-to-br from-orange-500 to-orange-400 text-white shadow-lg'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => { setTooltip(false); setExpanded(false); }}
          >
            <item.icon size={22} />
            {item.badge && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>

          {/* Tooltip for parent */}
          <Tooltip text={item.label} show={tooltip && !expanded} />

          {/* Children popup on click */}
          {expanded && (
            <div
              className="absolute left-full top-0 ml-3 w-56 bg-[#2e052e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 z-60"
              onMouseLeave={() => setExpanded(false)}
            >
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 px-2">{item.label}</p>
              {item.children.map((child, idx) => (
                <button
                  key={idx}
                  onClick={() => { onNavigate(child.path); setExpanded(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                    activePath === child.path
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <child.icon size={16} />
                  <span className="font-medium">{child.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Collapsed - single item
    return (
      <div className="relative">
        <button
          onClick={() => onNavigate(item.path)}
          className={`w-full flex items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
            activePath === item.path
              ? 'bg-linear-to-br from-orange-500 to-orange-400 text-white shadow-lg'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
        >
          <item.icon size={22} />
          {item.badge && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </button>
        <Tooltip text={item.label} show={tooltip} />
      </div>
    );
  }

  // Expanded mode - no children
  if (!hasChildren) {
    return (
      <button
        onClick={() => onNavigate(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
          activePath === item.path
            ? 'bg-linear-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-900/30'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <item.icon size={20} className={activePath === item.path ? 'text-white' : 'text-white/50 group-hover:text-white'} />
        <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activePath === item.path ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  // Expanded mode - with children
  return (
    <div className="space-y-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
          isActive
            ? 'bg-linear-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-900/30'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <item.icon size={20} className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white'} />
        <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
          }`}>
            {item.badge}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''} ${isActive ? 'text-white' : 'text-white/50'}`}
        />
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pl-4 space-y-1 border-l-2 border-white/10 ml-4">
          {item.children.map((child, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(child.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                activePath === child.path
                  ? 'bg-orange-500/20 text-orange-300'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <child.icon size={18} className={activePath === child.path ? 'text-orange-300' : 'text-white/40 group-hover:text-white'} />
              <span className="font-medium text-sm flex-1 text-left">{child.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Sidebar({ sidebarOpen, setSidebarOpen, sidebarCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } bg-[#2e052e]/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className={`p-6 border-b border-white/10 flex items-center ${
          sidebarCollapsed ? 'justify-center' : 'gap-3'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-900/30 shrink-0">
            <span className="text-2xl">🫙</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">HBC Achar</h1>
              <p className="text-xs text-white/50 font-medium">Admin Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav Items - Hidden Scrollbar */}
        <nav
          className={`p-4 space-y-2 overflow-y-auto ${
            sidebarCollapsed ? 'h-[calc(100%-140px)]' : 'h-[calc(100%-180px)]'
          }`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            nav::-webkit-scrollbar {
              display: none;
            }
              .sidebar-scroll::-webkit-scrollbar {
                display: none !importent;
              }

              .sidebar-scroll {
                -ms-overflow-style: none;
                scrollbar-width: none importent;
              }
          `}</style>
          {sidebarConfig.map((item, idx) => (
            <SidebarItem
              key={idx}
              item={item}
              activePath={activePath}
              onNavigate={(path) => {
                navigate(path);
                setSidebarOpen(false);
              }}
              sidebarCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#2e052e]/95 backdrop-blur-xl">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 ${
            sidebarCollapsed ? 'justify-center px-2' : ''
          }`}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-green-400 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              AD
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-white/50 truncate">admin@hbcachar.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
