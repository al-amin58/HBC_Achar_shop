import { useState } from 'react';
import { Badge, Button, Empty } from 'antd';
import {
  BellOutlined, ShoppingOutlined, WalletOutlined,
  ThunderboltOutlined, FileImageOutlined, CheckOutlined,
} from '@ant-design/icons';
import { fmtDate } from './constants.js';

const TYPE_ICON = {
  order:  <ShoppingOutlined className="text-blue-500" />,
  wallet: <WalletOutlined className="text-green-500" />,
  flash:  <ThunderboltOutlined className="text-orange-500" />,
  lp:     <FileImageOutlined className="text-purple-500" />,
};
const TYPE_BG = { order: 'bg-blue-100', wallet: 'bg-green-100', flash: 'bg-orange-100', lp: 'bg-purple-100' };
const CATS    = ['all','order','wallet','flash','lp'];
const CAT_LBL = { all:'সব', order:'অর্ডার', wallet:'ওয়ালেট', flash:'ফ্ল্যাশ সেল', lp:'ল্যান্ডিং' };

export default function NotificationsTab({ items = [], onMarkRead, onMarkAll }) {
  const [filter, setFilter] = useState('all');

  const filtered = items.filter((n) => filter === 'all' || n.type === filter);
  const unread   = items.filter((n) => !n.read).length;

  const markRead = (id) => onMarkRead?.(id);
  const markAll  = () => onMarkAll?.();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge count={unread} color="orange">
            <BellOutlined className="text-lg sm:text-xl text-gray-700" />
          </Badge>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">নোটিফিকেশন</h3>
        </div>
        {unread > 0 && (
          <Button size="small" icon={<CheckOutlined />} onClick={markAll} className="rounded-xl text-[10px] sm:text-xs">
            সব পড়া চিহ্নিত
          </Button>
        )}
      </div>

      {/* Category filter — scrollable on mobile */}
      <div className="flex gap-2 flex-nowrap overflow-x-auto pb-1 scrollbar-none">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              filter === c
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
            }`}
          >
            {CAT_LBL[c]}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <Empty description="কোনো নোটিফিকেশন নেই" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`rounded-2xl border p-3 sm:p-4 transition-all cursor-pointer hover:shadow-md ${
                n.read ? 'bg-white border-gray-100' : 'bg-orange-50/60 border-orange-200'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${TYPE_BG[n.type]||'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                  {TYPE_ICON[n.type] || <BellOutlined />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{n.body}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">{fmtDate(n.date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
