import { useState } from 'react';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, 
  ShieldCheck, Truck, RotateCcw, Flame, Weight, 
  Package, Percent
} from 'lucide-react';
import { useNavigate } from 'react-router';


const Cart = () => {

    const navigate = useNavigate();
  // Sample cart data for Achaar products
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "আমের আচার (Mango Pickle)",
      subtitle: "কাঁচা আমের মিষ্টি ও ঝাল আচার",
      variant: "৫০০ গ্রাম",
      price: 280,
      originalPrice: 350,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop",
      stock: 10,
      spiceLevel: "মিষ্টি ঝাল",
      weight: "500g",
      isOrganic: true
    },
    {
      id: 2,
      name: "লেবুর আচার (Lime Pickle)",
      subtitle: "পাতি লেবুর তেল ঝাল আচার",
      variant: "২৫০ গ্রাম",
      price: 180,
      originalPrice: 220,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
      stock: 15,
      spiceLevel: "অতি ঝাল",
      weight: "250g",
      isOrganic: false
    },
    {
      id: 3,
      name: "মরিচের আচার (Chili Pickle)",
      subtitle: "সরিষা তেলে ভর্তা মরিচ",
      variant: "২০০ গ্রাম",
      price: 150,
      originalPrice: 180,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1563599175-1975ae0f8405?w=300&h=300&fit=crop",
      stock: 8,
      spiceLevel: "অতি ঝাল",
      weight: "200g",
      isOrganic: true
    },
    {
      id: 4,
      name: "আমলকীর আচার (Amla Pickle)",
      subtitle: "হোমমেইড আমলকী আচার",
      variant: "৪০০ গ্রাম",
      price: 320,
      originalPrice: 400,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&h=300&fit=crop",
      stock: 5,
      spiceLevel: "মিষ্টি",
      weight: "400g",
      isOrganic: true
    }
  ]);

  

  // Spice level badge colors
  const spiceColors = {
    "মিষ্টি": "bg-yellow-100 text-yellow-700",
    "মিষ্টি ঝাল": "bg-orange-100 text-orange-700",
    "ঝাল": "bg-red-100 text-red-600",
    "অতি ঝাল": "bg-red-200 text-red-800"
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const productDiscount = originalTotal - subtotal;
  
  const total = subtotal;

  // Handlers
  const updateQuantity = (id, delta) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50/30 to-green-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-28 h-28 bg-linear-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="w-14 h-14 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">আপনার ব্যাগ খালি</h2>
          <p className="text-gray-500 mb-2">মজাদার আচার এখনো যোগ করেননি?</p>
          <p className="text-sm text-gray-400 mb-8">ঘরে বসে পাবেন দেশি স্বাদের আচার</p>
          <button className="bg-linear-to-r from-orange-400 to-green-400 text-white px-10 py-3.5 rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            আচার কিনতে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-green-400 rounded-xl flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">আচারের ব্যাগ</h1>
                <p className="text-xs text-gray-500">Shopping Cart</p>
              </div>
              <span className="ml-3 text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                {cartItems.length} আইটেম
              </span>
            </div>
            <button 
              onClick={() => setCartItems([])}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4" />
              ব্যাগ খালি করুন
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="relative shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl bg-orange-50"
                    />
                    {item.originalPrice > item.price && (
                      <span className="absolute -top-2 -left-2 bg-linear-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md">
                        {Math.round((1 - item.price/item.originalPrice) * 100)}% ছাড়
                      </span>
                    )}
                    {item.isOrganic && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                        100% দেশি
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                          title="আইটেম সরান"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${spiceColors[item.spiceLevel] || "bg-gray-100 text-gray-600"}`}>
                          <Flame className="w-3 h-3" />
                          {item.spiceLevel}
                        </span>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          {item.variant}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-2xl font-bold text-gray-900">৳{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">৳{item.originalPrice}</span>
                        )}
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          স্টকে আছে ({item.stock} পিস)
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">পরিমাণ:</span>
                        <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-orange-600 hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-gray-700 text-lg">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-green-600 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">মোট</p>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-green-500">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust Badges */}
            <div className="sm:grid grid-cols-2 hidden sm:grid-cols-4 gap-3 mt-6">
              {[
                { icon: Package, title: "হোমমেইড", desc: "ঘরে তৈরি" },
                { icon: Truck, title: "ফ্রি ডেলিভারি", desc: "৳১০০০+ অর্ডারে" },
                { icon: ShieldCheck, title: "ফ্রেশ গ্যারান্টি", desc: "কোনো প্রিজারভেটিভ নয়" },
                { icon: RotateCcw, title: "৭ দিন রিটার্ন", desc: "সহজ রিটার্ন পলিসি" }
              ].map((badge, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-100 hover:shadow-md transition-all">
                  <badge.icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">{badge.title}</p>
                  <p className="text-xs text-gray-500">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 mt-10 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>মোট মূল্য</span>
                  <span>৳{originalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>পণ্য ছাড়</span>
                  <span>-৳{productDiscount.toLocaleString()}</span>
                </div>
                
                
                <div className="border-t-2 border-dashed border-orange-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">সর্বমোট</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-green-500">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 text-right">ভ্যাট সহ মূল্য</p>
                </div>
              </div>

              {/* Savings Badge */}
              {(productDiscount ) > 0 && (
                <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 mb-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Percent className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800">আপনি সাশ্রয় করছেন!</p>
                    <p className="text-xs text-green-600">
                      মোট ৳{(productDiscount ).toLocaleString()} ছাড় পাচ্ছেন
                    </p>
                  </div>
                </div>
              )}

              

              {/* Checkout Button */}
              <button onClick={() => navigate('/checkout')} className="w-full bg-linear-to-r from-orange-400 via-amber-400 to-green-400 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-500 hover:via-amber-500 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                অর্ডার করুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                নিরাপদ পেমেন্ট | ক্যাশ অন ডেলিভারি উপলব্ধ
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;