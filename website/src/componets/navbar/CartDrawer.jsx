import { Link } from 'react-router';
import { useCart } from '../useCart.jsx';

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
        className="w-full h-full object-cover rounded-xl"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return <span className="text-3xl">{image || '🫙'}</span>;
};

const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  cartCount,
  cartTotal,
}) => {
  const { monthlySubscription, toggleMonthlySubscription } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-emerald-900/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-[85%] sm:w-96 lg:w-105 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <div className="p-5 border-b border-emerald-100 flex justify-between items-center bg-linear-to-r from-emerald-50 to-orange-50">
          <div>
            <h2 className="text-lg font-bold text-emerald-800">Shopping Cart</h2>
            <p className="text-xs text-emerald-500 font-medium">{cartCount} items in cart</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition text-emerald-700"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.cartId}
                className="flex gap-4 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 hover:border-orange-200 transition"
              >
                <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-emerald-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                  <CartItemImage image={item.image} name={item.name} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-emerald-800 text-sm truncate">{item.name}</h4>
                    {item.isFlashSale && (
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full">
                        Flash Sale
                      </span>
                    )}
                  </div>
                  {item.variation?.label && (
                    <p className="text-[11px] text-orange-600 font-semibold mt-0.5 truncate">
                      {item.variation.label}
                    </p>
                  )}
                  <p className="text-orange-500 font-bold mt-1 flex items-center gap-2 flex-wrap">
                    <span>৳{item.price}</span>
                    {item.isFlashSale && item.oldPrice && item.oldPrice > item.price && (
                      <span className="text-xs text-emerald-400 line-through font-medium">
                        ৳{item.oldPrice}
                      </span>
                    )}
                    {item.qty > 1 && (
                      <span className="text-emerald-600 text-xs font-medium">
                        × {item.qty} = ৳{item.price * item.qty}
                      </span>
                    )}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => onUpdateQty(item.cartId, -1)}
                      className="w-8 h-8 bg-white border border-emerald-200 rounded-lg flex items-center justify-center hover:border-orange-300 hover:text-orange-500 transition font-bold text-emerald-700"
                      type="button"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm w-4 text-center text-emerald-800">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.cartId, 1)}
                      className="w-8 h-8 bg-white border border-emerald-200 rounded-lg flex items-center justify-center hover:border-orange-300 hover:text-orange-500 transition font-bold text-emerald-700"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.cartId)}
                  className="text-red-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl flex items-center justify-center transition shrink-0"
                  type="button"
                  aria-label="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-emerald-300">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-lg font-bold text-emerald-600">Your cart is empty</p>
              <p className="text-sm">Add some delicious achar!</p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="flex items-center gap-2.5 py-3 m-2 px-2 rounded-2xl border border-amber-300 bg-amber-50/50">
            <input
              type="checkbox"
              id="monthly-cart"
              checked={monthlySubscription}
              onChange={(e) => toggleMonthlySubscription(e.target.checked)}
              className="h-5 w-5 rounded border-amber-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
            />
            <label htmlFor="monthly-cart" className="text-gray-700 cursor-pointer select-none text-sm">
              আমি প্রতি মাসেই কিনতে চাই
            </label>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-emerald-100 bg-linear-to-b from-white to-emerald-50/30 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold text-emerald-800">
              <span>Total:</span>
              <span className="text-orange-500">৳{cartTotal}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-linear-to-r from-orange-300 to-orange-400 text-white py-3.5 rounded-xl font-bold hover:from-orange-400 hover:to-orange-500 transition shadow-lg shadow-orange-200"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={onClose}
              className="w-full bg-white border border-emerald-200 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
              type="button"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
