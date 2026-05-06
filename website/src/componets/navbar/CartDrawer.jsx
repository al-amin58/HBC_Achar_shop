
const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, cartCount, cartTotal }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-emerald-900/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-[85%] sm:w-96 lg:w-105 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-5 border-b border-emerald-100 flex justify-between items-center bg-linear-to-r from-emerald-50 to-orange-50">
          <div>
            <h2 className="text-lg font-bold text-emerald-800">Shopping Cart</h2>
            <p className="text-xs text-emerald-500 font-medium">{cartCount} items in cart</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition text-emerald-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-emerald-50/50 p-3 pl-10 rounded-full border border-emerald-100 hover:border-orange-200 transition">
                <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-emerald-100  rounded-xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                  {item.image}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-emerald-800 text-sm truncate">{item.name}</h4>
                  <p className="text-orange-500 font-bold mt-1">৳{item.price * item.qty}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="w-8 h-8 bg-white border border-emerald-200 rounded-lg flex items-center justify-center hover:border-orange-300 hover:text-orange-500 transition font-bold text-emerald-700"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm w-4 text-center text-emerald-800">{item.qty}</span>
                    <button 
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="w-8 h-8 bg-white border border-emerald-200 rounded-lg flex items-center justify-center hover:border-orange-300 hover:text-orange-500 transition font-bold text-emerald-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl flex items-center justify-center transition"
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
        <div class="flex items-center gap-2.5 py-3  m-2 px-2 rounded-2xl border border-amber-300">
          <input
            type="checkbox"
            id="monthly"
            class="h-5 w-5 rounded border-amber-300 text-emerald-300 focus:ring-emerald-400 cursor-pointer"
          />
          <label for="monthly" class=" text-gray-700 cursor-pointer select-none">
            আমি প্রতি মাসেই কিনতে চাই
          </label>
        </div>
       
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-emerald-100 bg-linear-to-b from-white to-emerald-50/30 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold text-emerald-800">
              <span>Total:</span>
              <span className="text-orange-500">৳{cartTotal}</span>
            </div>
            <button className="w-full bg-linear-to-r from-orange-300 to-orange-400 text-white py-3.5 rounded-xl font-bold hover:from-orange-400 hover:to-orange-500 transition shadow-lg shadow-orange-200">
              <a href="/checkout">
                  Proceed to Checkout
              </a>
            </button>
            <button 
              onClick={onClose}
              className="w-full bg-white border border-emerald-200 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
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