import { Tag, Empty, Badge } from 'antd';
import { HeartFilled, ShoppingCartOutlined, ThunderboltOutlined, StarFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../api/axios.js';
import { fmtBDT } from './constants.js';

function WishCard({ item, onRemove }) {
  const inStock = item.stock > 0;
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative overflow-hidden" style={{ height: 130 }}>
        <img
          src={item.image} alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Tag color="red" className="text-xs font-bold">স্টক শেষ</Tag>
          </div>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
        >
          <HeartFilled className="text-red-500 text-xs" />
        </button>
        {inStock && item.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {item.stock}টি বাকি!
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3">
        <p className="font-semibold text-xs sm:text-sm text-gray-800 truncate">{item.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <StarFilled className="text-yellow-400 text-[10px]" />
          <span className="text-[10px] text-gray-400">{item.rating}</span>
          <span className="text-[10px] text-gray-300 mx-0.5">·</span>
          <span className="text-[10px] text-gray-400 truncate">{item.variation}</span>
        </div>
        <p className="text-sm sm:text-base font-bold text-orange-600 mt-1">{fmtBDT(item.price)}</p>
        <div className="flex gap-1.5 mt-2">
          <button
            disabled={!inStock}
            className="flex-1 flex items-center justify-center gap-0.5 text-[10px] sm:text-xs font-semibold py-1.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-40"
          >
            <ShoppingCartOutlined /> কার্ট
          </button>
          <button
            disabled={!inStock}
            className="flex-1 flex items-center justify-center gap-0.5 text-[10px] sm:text-xs font-semibold py-1.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-40"
          >
            <ThunderboltOutlined /> কিনুন
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistTab({ items = [], onRefresh }) {
  const remove = async (id) => {
    try {
      await api.delete(`/profile/wishlist/${id}`);
      toast.success('উইশলিস্ট থেকে সরানো হয়েছে');
      await onRefresh?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'সরাতে ব্যর্থ');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HeartFilled className="text-red-500 text-base sm:text-lg" />
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">আমার উইশলিস্ট</h3>
        <Badge count={items.length} color="orange" />
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="উইশলিস্ট খালি" />
        </div>
      ) : (
        /* 2 cols on mobile, 3 on sm, 4 on lg */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {items.map((item) => <WishCard key={item.id} item={item} onRemove={remove} />)}
        </div>
      )}
    </div>
  );
}
