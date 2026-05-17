import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  ShieldCheck, Package, RotateCcw,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { useCart, getAuthToken } from '../../componets/useCart.jsx';

const CartItemImage = ({ image, name }) => {
  const isUrl =
    image &&
    (String(image).startsWith('http') ||
      String(image).startsWith('/') ||
      String(image).startsWith('data:'));

  if (isUrl) {
    return (
      <img
        src={image}
        alt={name}
        className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl bg-orange-50"
      />
    );
  }
  return (
    <span className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center text-5xl bg-orange-50 rounded-2xl">
      {image || '🫙'}
    </span>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    changeQty,
    removeFromCart,
    clearCart,
    monthlySubscription,
    toggleMonthlySubscription,
    subtotal,
  } = useCart();

  const originalTotal = cart.reduce(
    (sum, item) => sum + (item.oldPrice ? item.oldPrice * item.qty : item.price * item.qty),
    0
  );
  const productDiscount = Math.max(0, originalTotal - subtotal);

  if (!getAuthToken()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-orange-50 to-green-50">
        <div className="text-center max-w-md">
          <p className="text-lg font-bold text-gray-800 mb-4">কার্ট দেখতে লগইন করুন</p>
          <Link
            to="/login"
            state={{ from: '/cart', reason: 'cart' }}
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-bold"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-600">
        লোড হচ্ছে...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50/30 to-green-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-28 h-28 bg-linear-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-14 h-14 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">আপনার ব্যাগ খালি</h2>
          <p className="text-gray-500 mb-8">মজাদার আচার এখনো যোগ করেননি?</p>
          <Link
            to="/"
            className="inline-block bg-linear-to-r from-orange-400 to-green-400 text-white px-10 py-3.5 rounded-2xl font-bold"
          >
            আচার কিনতে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold text-gray-800">আচারের ব্যাগ</h1>
            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              {cart.length} আইটেম
            </span>
          </div>
          <button
            type="button"
            onClick={() => clearCart()}
            className="text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            ব্যাগ খালি করুন
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartId}
              className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm flex gap-4"
            >
              <CartItemImage image={item.image} name={item.name} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    {item.variation?.label && (
                      <p className="text-sm text-orange-600 mt-0.5">{item.variation.label}</p>
                    )}
                    {item.isFlashSale && (
                      <span className="inline-block mt-1 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                        Flash Sale
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-gray-300 hover:text-red-500 shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold text-gray-900">৳{item.price}</span>
                  {item.oldPrice && item.oldPrice > item.price && (
                    <span className="text-sm text-gray-400 line-through">৳{item.oldPrice}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-50">
                  <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1">
                    <button type="button" onClick={() => changeQty(item.cartId, -1)} className="w-9 h-9 bg-white rounded-lg">
                      <Minus className="w-4 h-4 mx-auto text-orange-600" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.qty}</span>
                    <button type="button" onClick={() => changeQty(item.cartId, 1)} className="w-9 h-9 bg-white rounded-lg">
                      <Plus className="w-4 h-4 mx-auto text-green-600" />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-orange-600">৳{(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2.5 p-4 rounded-2xl border border-amber-300 bg-amber-50/60">
            <input
              type="checkbox"
              id="monthly-cart-page"
              checked={monthlySubscription}
              onChange={(e) => toggleMonthlySubscription(e.target.checked)}
              className="h-5 w-5 rounded border-amber-300 text-orange-500 cursor-pointer"
            />
            <label htmlFor="monthly-cart-page" className="text-gray-700 cursor-pointer select-none">
              আমি প্রতি মাসেই কিনতে চাই
            </label>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-orange-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>মোট মূল্য</span>
                <span>৳{originalTotal.toLocaleString()}</span>
              </div>
              {productDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ছাড়</span>
                  <span>-৳{productDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed">
                <span>সর্বমোট</span>
                <span className="text-orange-600">৳{subtotal.toLocaleString()}</span>
              </div>
            </div>
            {monthlySubscription && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
                ✓ মাসিক সাবস্ক্রিপশন — অর্ডারে দেখাবে
              </p>
            )}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full bg-linear-to-r from-orange-400 to-green-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              অর্ডার করুন
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
