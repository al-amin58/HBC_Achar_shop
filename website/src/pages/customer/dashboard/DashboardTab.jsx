import { useState, useEffect } from 'react';
import { Tag, Button, Avatar, Progress, Timeline, Carousel } from 'antd';
import {
  ShoppingOutlined, WalletOutlined, ClockCircleOutlined,
  CheckCircleOutlined, ThunderboltOutlined, RightOutlined,
  StarFilled, FireOutlined,
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fmtBDT, fmtDate, STATUS_COLOR, FLASH_PRODUCTS } from './constants.js';

function useCountdown(hours = 5) {
  const [secs, setSecs] = useState(hours * 3600);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: String(Math.floor(secs / 3600)).padStart(2, '0'),
    m: String(Math.floor((secs % 3600) / 60)).padStart(2, '0'),
    s: String(secs % 60).padStart(2, '0'),
  };
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center justify-between shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: `linear-gradient(135deg,${color[0]},${color[1]})` }}
    >
      <div>
        <p className="text-white/70 text-xs font-medium mb-1">{label}</p>
        <p className="text-white text-xl sm:text-2xl font-bold">{value}</p>
      </div>
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
        {icon}
      </div>
    </div>
  );
}

function FlashCard({ p }) {
  const pct = Math.round(((p.total - p.stock) / p.total) * 100);
  return (
    <div className="rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden" style={{ height: 120 }}>
        <img
          src={p.image} alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{p.discount}%
        </span>
      </div>
      <div className="p-2 sm:p-3">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{p.name}</p>
        <div className="flex items-center gap-1 sm:gap-2 mt-1">
          <span className="text-orange-600 font-bold text-xs sm:text-sm">{fmtBDT(p.price)}</span>
          <span className="text-gray-400 line-through text-[10px] sm:text-xs">{fmtBDT(p.oldPrice)}</span>
        </div>
        <div className="mt-1.5">
          <Progress percent={pct} showInfo={false} strokeColor="#f97316" trailColor="#fee2e2" size={['100%', 3]} />
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{p.stock} বাকি</p>
        </div>
        <button className="mt-2 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-semibold py-1.5 rounded-xl hover:opacity-90 transition">
          কার্টে যোগ করুন
        </button>
      </div>
    </div>
  );
}

export default function DashboardTab({ profile, orders = [], wallet, onGoToOrders }) {
  const { h, m, s } = useCountdown(5);
  const user = profile?.user;
  const all = orders;
  const walletBalance = wallet?.balance ?? user?.walletBalance ?? 0;
  const chartData = wallet?.chart ?? [];
  const pending   = all.filter((o) => o.status === 'pending').length;
  const completed = all.filter((o) => o.status === 'delivered').length;

  const slides = [
    { title: 'Flash Sale চলছে 🔥', sub: 'আজকের সেরা ডিল', from: '#f97316', to: '#ef4444' },
    { title: 'Wallet ক্যাশব্যাক', sub: 'রিচার্জে ৩% ক্যাশব্যাক', from: '#10b981', to: '#0ea5e9' },
    { title: 'VIP ফ্রি ডেলিভারি', sub: 'নির্বাচিত পণ্যে', from: '#8b5cf6', to: '#ec4899' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Welcome hero */}
      <div
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-32 sm:w-40 h-32 sm:h-40 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar
              size={52}
              src={user?.image || undefined}
              style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', fontSize: 22, fontWeight: 700, flexShrink: 0 }}
            >
              {(user?.name || 'C').charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <p className="text-white/60 text-xs">স্বাগতম</p>
              <h2 className="text-base sm:text-xl font-bold">{user?.name || 'Customer'}</h2>
              <p className="text-white/50 text-[11px] mt-0.5">{user?.phonenumber || ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats — 2 cols on mobile, 4 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={<ShoppingOutlined />} label="মোট অর্ডার" value={all.length}  color={['#f97316','#ef4444']} />
        <StatCard icon={<ClockCircleOutlined />} label="পেন্ডিং"  value={pending}    color={['#f59e0b','#f97316']} />
        <StatCard icon={<CheckCircleOutlined />} label="ডেলিভার্ড" value={completed} color={['#10b981','#059669']} />
        <StatCard icon={<WalletOutlined />} label="ওয়ালেট"       value={fmtBDT(walletBalance)} color={['#8b5cf6','#6366f1']} />
      </div>

      {/* Carousel + countdown — stacked on mobile, side by side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <div className="rounded-2xl overflow-hidden shadow-md">
            <Carousel autoplay>
              {slides.map((sl) => (
                <div key={sl.title}>
                  <div
                    className="flex flex-col items-center justify-center text-white text-center"
                    style={{ height: 130, background: `linear-gradient(135deg,${sl.from},${sl.to})` }}
                  >
                    <h3 className="text-base sm:text-lg font-bold">{sl.title}</h3>
                    <p className="text-xs sm:text-sm text-white/80 mt-1">{sl.sub}</p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        <div className="md:col-span-2">
          <div
            className="rounded-2xl h-full p-4 flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', minHeight: 130 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FireOutlined className="text-orange-400" />
              <span className="text-white font-bold text-xs sm:text-sm">Flash Sale শেষ হবে</span>
            </div>
            <div className="flex gap-2">
              {[h, m, s].map((v, i) => (
                <div key={i} className="flex-1 bg-white/10 rounded-xl py-2 text-center">
                  <div className="text-orange-400 text-lg sm:text-2xl font-bold font-mono">{v}</div>
                  <div className="text-white/40 text-[9px] sm:text-[10px] mt-0.5">{['ঘণ্টা','মিনিট','সেকেন্ড'][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wallet mini chart */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-500 text-xs">এই সপ্তাহের ওয়ালেট ব্যালেন্স</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{fmtBDT(walletBalance)}</p>
          </div>
          <Button type="primary" size="small" className="bg-orange-500 border-orange-500 text-xs rounded-xl">
            টপ আপ
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`৳${v}`, 'ব্যালেন্স']} />
            <Area type="monotone" dataKey="balance" stroke="#f97316" strokeWidth={2} fill="url(#wg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders timeline */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">সাম্প্রতিক অর্ডার</h3>
          <Button type="link" size="small" className="text-orange-500 p-0 text-xs sm:text-sm" onClick={onGoToOrders}>
            সব দেখুন <RightOutlined />
          </Button>
        </div>
        <Timeline
          items={all.slice(0, 4).map((o) => ({
            color: STATUS_COLOR[o.status] || 'gray',
            children: (
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">{o.orderNumber || o.id}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">{fmtDate(o.date || o.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Tag color={STATUS_COLOR[o.status] || 'default'} className="text-[9px] sm:text-[10px]">{o.status}</Tag>
                  <p className="text-xs font-bold text-orange-600 mt-0.5">{fmtBDT(o.price || o.pricing?.total)}</p>
                </div>
              </div>
            ),
          }))}
        />
      </div>

      {/* Flash products — 2 cols on mobile, 4 on sm+ */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <ThunderboltOutlined className="text-orange-500" />
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">ফ্ল্যাশ সেল</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {FLASH_PRODUCTS.map((p) => <FlashCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}
