import  { useState, useEffect } from 'react';
import {
  ShoppingBag, DollarSign, Clock, Zap, CreditCard, Users,
  TrendingUp, TrendingDown, Eye, Edit, Filter, Download,
  ChevronRight, BarChart3, Image, Plus, Wallet, ArrowUpRight, MapPin,
  Truck,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════════

const statsData = [
  { title: 'Total Orders', value: '12,847', growth: '+23.5%', up: true, icon: ShoppingBag, color: '#ff6b00', bg: 'bg-orange-50', chartData: [
    { name: 'Mon', val: 120 }, { name: 'Tue', val: 180 }, { name: 'Wed', val: 150 }, { name: 'Thu', val: 220 }, { name: 'Fri', val: 280 }, { name: 'Sat', val: 350 }, { name: 'Sun', val: 310 }
  ]},
  { title: 'Total Revenue', value: '৳ 8,42,500', growth: '+18.2%', up: true, icon: DollarSign, color: '#16a34a', bg: 'bg-green-50', chartData: [
    { name: 'Mon', val: 45 }, { name: 'Tue', val: 62 }, { name: 'Wed', val: 55 }, { name: 'Thu', val: 78 }, { name: 'Fri', val: 95 }, { name: 'Sat', val: 110 }, { name: 'Sun', val: 98 }
  ]},
  { title: 'Pending Orders', value: '156', growth: '-5.3%', up: false, icon: Clock, color: '#f59e0b', bg: 'bg-amber-50', chartData: [
    { name: 'Mon', val: 30 }, { name: 'Tue', val: 25 }, { name: 'Wed', val: 35 }, { name: 'Thu', val: 28 }, { name: 'Fri', val: 22 }, { name: 'Sat', val: 18 }, { name: 'Sun', val: 15 }
  ]},
  { title: 'Flash Sale Active', value: '8 Products', growth: '+42.1%', up: true, icon: Zap, color: '#ef4444', bg: 'bg-red-50', chartData: [
    { name: 'Mon', val: 80 }, { name: 'Tue', val: 120 }, { name: 'Wed', val: 200 }, { name: 'Thu', val: 180 }, { name: 'Fri', val: 250 }, { name: 'Sat', val: 300 }, { name: 'Sun', val: 280 }
  ]},
  { title: 'Wallet Balance', value: '৳ 2,15,000', growth: '+31.7%', up: true, icon: CreditCard, color: '#7a2e7a', bg: 'bg-purple-50', chartData: [
    { name: 'Mon', val: 20 }, { name: 'Tue', val: 35 }, { name: 'Wed', val: 28 }, { name: 'Thu', val: 45 }, { name: 'Fri', val: 55 }, { name: 'Sat', val: 70 }, { name: 'Sun', val: 62 }
  ]},
  { title: 'Returning Customers', value: '3,420', growth: '+12.8%', up: true, icon: Users, color: '#06b6d4', bg: 'bg-cyan-50', chartData: [
    { name: 'Mon', val: 40 }, { name: 'Tue', val: 55 }, { name: 'Wed', val: 48 }, { name: 'Thu', val: 62 }, { name: 'Fri', val: 75 }, { name: 'Sat', val: 88 }, { name: 'Sun', val: 82 }
  ]},
];

const recentOrders = [
  { id: '#ORD-7829', customer: 'Rahim Uddin', avatar: 'RU', product: 'Mango Achar (500g)', payment: 'Paid', delivery: 'Delivered', amount: '৳ 450', date: '2 mins ago', status: 'success' },
  { id: '#ORD-7828', customer: 'Fatima Begum', avatar: 'FB', product: 'Mixed Achar Combo', payment: 'Paid', delivery: 'Processing', amount: '৳ 1,200', date: '15 mins ago', status: 'warning' },
  { id: '#ORD-7827', customer: 'Karim Hossain', avatar: 'KH', product: 'Olive Achar (250g)', payment: 'Pending', delivery: 'Pending', amount: '৳ 320', date: '32 mins ago', status: 'danger' },
  { id: '#ORD-7826', customer: 'Nasrin Akter', avatar: 'NA', product: 'Lemon Achar (1kg)', payment: 'Paid', delivery: 'Shipped', amount: '৳ 850', date: '1 hour ago', status: 'info' },
  { id: '#ORD-7825', customer: 'Jamal Uddin', avatar: 'JU', product: 'Garlic Achar (500g)', payment: 'Paid', delivery: 'Delivered', amount: '৳ 380', date: '2 hours ago', status: 'success' },
  { id: '#ORD-7824', customer: 'Sultana Parvin', avatar: 'SP', product: 'Chili Achar (250g)', payment: 'Failed', delivery: 'Cancelled', amount: '৳ 290', date: '3 hours ago', status: 'danger' },
];

const flashSaleProducts = [
  { name: 'Premium Mango Achar', original: 650, sale: 450, sold: 78, total: 100, image: '🥭' },
  { name: 'Mixed Pickle Combo', original: 1200, sale: 899, sold: 45, total: 80, image: '🫙' },
  { name: 'Spicy Olive Achar', original: 550, sale: 399, sold: 92, total: 100, image: '🫒' },
];

const walletTransactions = [
  { id: 1, type: 'credit', desc: 'Order Payment #7829', amount: '+৳ 450', date: 'Today, 2:30 PM' },
  { id: 2, type: 'debit', desc: 'Withdraw to Bank', amount: '-৳ 15,000', date: 'Today, 11:00 AM' },
  { id: 3, type: 'credit', desc: 'Order Payment #7825', amount: '+৳ 380', date: 'Yesterday, 4:15 PM' },
  { id: 4, type: 'credit', desc: 'Order Payment #7821', amount: '+৳ 1,200', date: 'Yesterday, 10:30 AM' },
];

const walletChartData = [
  { day: 'Mon', balance: 150000 }, { day: 'Tue', balance: 165000 }, { day: 'Wed', balance: 158000 },
  { day: 'Thu', balance: 182000 }, { day: 'Fri', balance: 195000 }, { day: 'Sat', balance: 210000 }, { day: 'Sun', balance: 215000 },
];

const pieData = [
  { name: 'New Customers', value: 45, color: '#ff6b00' },
  { name: 'Returning', value: 30, color: '#16a34a' },
  { name: 'VIP Members', value: 15, color: '#7a2e7a' },
  { name: 'Wholesale', value: 10, color: '#06b6d4' },
];

const userGrowthData = [
  { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1850 }, { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 3200 }, { month: 'May', users: 4100 }, { month: 'Jun', users: 5200 },
  { month: 'Jul', users: 6100 }, { month: 'Aug', users: 7200 }, { month: 'Sep', users: 8500 },
  { month: 'Oct', users: 9800 }, { month: 'Nov', users: 11200 }, { month: 'Dec', users: 12800 },
];

const topBuyers = [
  { name: 'Rahim Traders', orders: 245, spent: '৳ 1,25,000', avatar: 'RT' },
  { name: 'Fatima Store', orders: 198, spent: '৳ 98,500', avatar: 'FS' },
  { name: 'Karim Enterprise', orders: 176, spent: '৳ 87,200', avatar: 'KE' },
  { name: 'Nasrin Mart', orders: 154, spent: '৳ 76,800', avatar: 'NM' },
  { name: 'Jamal & Sons', orders: 132, spent: '৳ 65,400', avatar: 'JS' },
];

const deliveryData = [
  { courier: 'Pathao', status: 'Active', orders: 45, color: '#ff6b00' },
  { courier: 'RedX', status: 'Active', orders: 38, color: '#ef4444' },
  { courier: 'Paperfly', status: 'Delayed', orders: 12, color: '#f59e0b' },
  { courier: 'eCourier', status: 'Active', orders: 28, color: '#16a34a' },
];

// ═══════════════════════════════════════════════════════════════
//  REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════

const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 4, m: 32, s: 15 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 4; m = 32; s = 15; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const fmt = (n) => n.toString().padStart(2, '0');
  return (
    <div className="flex gap-2">
      {['h','m','s'].map((k, i) => (
        <div key={k} className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-orange-500 to-orange-400 text-white rounded-xl px-3 py-2 min-w-[48px] text-center shadow-lg shadow-orange-900/30">
            <span className="text-xl font-bold font-mono">{fmt(time[k])}</span>
          </div>
          {i < 2 && <span className="text-orange-300 text-xl font-bold">:</span>}
        </div>
      ))}
    </div>
  );
};

const MiniChart = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={60}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="100%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="val" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} />
    </AreaChart>
  </ResponsiveContainer>
);

const StatusBadge = ({ status, text }) => {
  const styles = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.info}`}>{text}</span>;
};

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[28px] border border-gray-100 shadow-sm ${className}`}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-8 text-white shadow-2xl shadow-orange-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" /> Live Dashboard
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Welcome back, Admin! <br/><span className="text-orange-100">Your achar empire is thriving 🚀</span>
            </h2>
            <p className="text-orange-50 text-lg">
              Today you have <span className="font-bold text-white">156 new orders</span> and <span className="font-bold text-white">৳ 45,200</span> in revenue. Flash sale is performing 42% above average!
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="px-6 py-3 rounded-2xl bg-white text-orange-600 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                <Zap size={18} /> Boost Sales Today
              </button>
              <button className="px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                <BarChart3 size={18} /> View Reports
              </button>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30">
              <div className="text-5xl mb-3">🫙</div><div className="text-2xl font-bold">12,847</div><div className="text-orange-100 text-sm">Total Orders</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30">
              <div className="text-5xl mb-3">🥭</div><div className="text-2xl font-bold">8,42K</div><div className="text-orange-100 text-sm">Revenue (৳)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS CARDS ═══ */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="group bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-900/10 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}><Icon size={24} style={{ color: stat.color }} /></div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{stat.growth}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mb-4">{stat.value}</p>
              <MiniChart data={stat.chartData} color={stat.color} />
            </div>
          );
        })}
      </section>

      {/* ═══ RECENT ORDERS + FLASH SALE ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <GlassCard className="xl:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
              <p className="text-sm text-gray-500">You have 156 pending orders to process</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"><Filter size={18} /></button>
              <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"><Download size={18} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs border border-orange-200">{order.avatar}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">{order.product}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={order.status} text={order.payment} />
                        <span className="text-xs text-gray-500 ml-1">{order.delivery}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-800">{order.amount}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-xl hover:bg-orange-100 text-orange-600 transition-colors"><Eye size={16} /></button>
                        <button className="p-2 rounded-xl hover:bg-blue-100 text-blue-600 transition-colors"><Edit size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1 mx-auto">
              View All Orders <ChevronRight size={16} />
            </button>
          </div>
        </GlassCard>

        {/* Flash Sale */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Zap size={20} className="text-orange-500" /> Flash Sale</h3>
              <p className="text-sm text-gray-500">Live until midnight</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold animate-pulse">LIVE</span>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Sale ends in:</p>
            <CountdownTimer />
          </div>
          <div className="space-y-4">
            {flashSaleProducts.map((product, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{product.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-orange-600">৳ {product.sale}</span>
                      <span className="text-xs text-gray-400 line-through">৳ {product.original}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">-{Math.round((1 - product.sale/product.original) * 100)}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Sold {product.sold} of {product.total}</span>
                    <span className="font-bold text-orange-600">{product.sold}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500" style={{ width: `${product.sold}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            <Edit size={18} /> Manage Flash Sale
          </button>
        </GlassCard>
      </div>

      {/* ═══ WALLET + CUSTOMER ANALYTICS + DELIVERY ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Wallet */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Wallet size={20} className="text-green-600" /> Wallet</h3>
            <button className="p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors"><ArrowUpRight size={18} /></button>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-200 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <p className="text-purple-100 text-sm mb-1">Total Balance</p>
              <h4 className="text-3xl font-bold mb-4">৳ 2,15,000.00</h4>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                  <Zap size={16} /> Recharge
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                  <ArrowUpRight size={16} /> Withdraw
                </button>
              </div>
            </div>
          </div>
          <div className="h-32 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={walletChartData}>
                <defs>
                  <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7a2e7a" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#7a2e7a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="balance" stroke="#7a2e7a" strokeWidth={2} fill="url(#walletGrad)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} formatter={(value) => [`৳ ${value.toLocaleString()}`, 'Balance']} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Recent Transactions</p>
            {walletTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type === 'credit' ? <ArrowUpRight size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tx.desc}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Customer Analytics */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Users size={20} className="text-blue-600" /> Customers</h3>
            <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">View All</button>
          </div>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mb-6">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Buyers</p>
            <div className="space-y-3">
              {topBuyers.map((buyer, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs">{buyer.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{buyer.name}</p>
                    <p className="text-xs text-gray-500">{buyer.orders} orders</p>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{buyer.spent}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Delivery Tracking */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Truck size={20} className="text-cyan-600" /> Delivery</h3>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">123 Active</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {deliveryData.map((courier, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">{courier.courier}</span>
                  <div className={`w-2 h-2 rounded-full ${courier.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{courier.orders}</p>
                <p className="text-xs text-gray-500">orders</p>
              </div>
            ))}
          </div>
          <div className="relative rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-4 mb-6 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#06b6d4" strokeWidth="0.5"/>
                </pattern>
                <rect width="400" height="200" fill="url(#grid)" />
                <circle cx="80" cy="60" r="4" fill="#ff6b00" />
                <circle cx="200" cy="100" r="4" fill="#16a34a" />
                <circle cx="320" cy="80" r="4" fill="#8b5cf6" />
                <circle cx="150" cy="150" r="4" fill="#ef4444" />
                <path d="M 80 60 Q 140 80 200 100" fill="none" stroke="#ff6b00" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 200 100 Q 260 90 320 80" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-cyan-600" />
                <span className="text-sm font-semibold text-gray-800">Dhaka Zone</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center"><p className="text-xl font-bold text-gray-800">45</p><p className="text-xs text-gray-500">Delivering</p></div>
                <div className="h-8 w-px bg-cyan-200" />
                <div className="text-center"><p className="text-xl font-bold text-gray-800">12</p><p className="text-xs text-gray-500">Pending</p></div>
              </div>
            </div>
          </div>
          <div className="space-y-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order #ORD-7829 Timeline</p>
            {[
              { status: 'Order Placed', time: '10:30 AM', done: true },
              { status: 'Processing', time: '11:15 AM', done: true },
              { status: 'Shipped', time: '2:00 PM', done: true },
              { status: 'In Transit', time: '4:30 PM', done: true },
              { status: 'Out for Delivery', time: 'Expected 6:00 PM', done: false },
              { status: 'Delivered', time: 'Pending', done: false },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${step.done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`} />
                  {idx < arr.length - 1 && <div className={`w-0.5 h-8 ${step.done ? 'bg-green-200' : 'bg-gray-200'}`} />}
                </div>
                <div className="pb-6">
                  <p className={`text-sm font-medium ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.status}</p>
                  <p className="text-xs text-gray-500">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ═══ USER GROWTH + CAMPAIGN BANNERS ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* User Growth */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">User Growth</h3>
            <div className="flex gap-2">
              {['Week', 'Month', 'Year'].map((period) => (
                <button key={period} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${period === 'Month' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b00" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#ff6b00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} formatter={(value) => [value.toLocaleString(), 'Users']} />
              <Area type="monotone" dataKey="users" stroke="#ff6b00" strokeWidth={3} fill="url(#growthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-2xl bg-orange-50">
              <p className="text-2xl font-bold text-orange-600">12.8K</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-green-50">
              <p className="text-2xl font-bold text-green-600">8.4K</p>
              <p className="text-xs text-gray-500">Active Now</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-purple-50">
              <p className="text-2xl font-bold text-purple-600">+24%</p>
              <p className="text-xs text-gray-500">Growth</p>
            </div>
          </div>
        </GlassCard>

        {/* Campaign Banners */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Image size={20} className="text-pink-600" /> Campaign Banners</h3>
              <p className="text-sm text-gray-500">Active promotional banners</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <Plus size={16} /> New Banner
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Eid Special Offer', subtitle: 'Up to 50% off on all achar', color: 'from-green-500 to-emerald-400', emoji: '🌙', active: true },
              { title: 'Summer Mango Fest', subtitle: 'Fresh mango achar collection', color: 'from-orange-500 to-amber-400', emoji: '🥭', active: true },
              { title: 'New User Welcome', subtitle: 'Get 20% off first order', color: 'from-purple-500 to-violet-400', emoji: '🎁', active: false },
            ].map((banner, idx) => (
              <div key={idx} className={`relative rounded-2xl bg-gradient-to-br ${banner.color} p-6 text-white overflow-hidden group hover:shadow-xl transition-all ${!banner.active && 'opacity-60'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{banner.emoji}</span>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"><Edit size={14} /></button>
                      <button className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"><Eye size={14} className={!banner.active ? 'opacity-50' : ''} /></button>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-1">{banner.title}</h4>
                  <p className="text-sm text-white/80 mb-4">{banner.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${banner.active ? 'bg-white/20' : 'bg-black/20'}`}>{banner.active ? 'Active' : 'Paused'}</span>
                    <span className="text-xs text-white/70">CTR: 4.2%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

    </div>
  );
}
