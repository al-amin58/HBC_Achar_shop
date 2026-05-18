// pages/TrackOrder.jsx
import  { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  Box, 
  Home,
  CreditCard,
  Printer,
  RotateCcw,
  Star,
  MessageCircle
} from 'lucide-react';

// ─── Mock Order Data ────────────────────────────────────────
const mockOrder = {
  orderId: 'ACHAR-250507-8842',
  orderDate: '2026-05-05',
  estimatedDelivery: '2026-05-09',
  status: 'shipped',
  paymentStatus: 'Paid',
  paymentMethod: 'Cash on Delivery',
  subtotal: 840,
  shipping: 85,
  discount: 50,
  total: 875,
  customer: {
    name: 'Rahim Ahmed',
    phone: '+880 1712-345678',
    address: 'House 42, Road 12, Banani, Dhaka North, Dhaka-1213'
  },
  timeline: [
    { 
      status: 'Order Placed', 
      description: 'Your order has been placed successfully', 
      time: '05 May, 10:30 AM', 
      completed: true,
      icon: Box
    },
    { 
      status: 'Confirmed', 
      description: 'Seller has confirmed your order', 
      time: '05 May, 02:15 PM', 
      completed: true,
      icon: CheckCircle2
    },
    { 
      status: 'Shipped', 
      description: 'Your order has been shipped via Pathao Courier', 
      time: '06 May, 09:00 AM', 
      completed: true,
      icon: Truck,
      active: true
    },
    { 
      status: 'Out for Delivery', 
      description: 'Courier is on the way to your address', 
      time: 'Expected: 09 May', 
      completed: false,
      icon: MapPin
    },
    { 
      status: 'Delivered', 
      description: 'Order delivered successfully', 
      time: 'Expected: 09 May', 
      completed: false,
      icon: Home
    }
  ],
  items: [
    {
      id: 'i1',
      name: 'Chaltar Achar (Homemade)',
      variant: '500g • Medium Spicy',
      price: 210,
      qty: 2,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80'
    },
    {
      id: 'i2',
      name: 'Mango Achar (Kacha)',
      variant: '1kg • High Spicy',
      price: 420,
      qty: 1,
      image: 'https://images.unsplash.com/photo-1589187154184-995b8a4e740a?w=200&q=80'
    }
  ]
};

// ─── Status Config ──────────────────────────────────────────
const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  shipped: { label: 'Shipped', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
};

// ─── Helper: Timeline Step ──────────────────────────────────
const TimelineStep = ({ step, isLast }) => {
  const Icon = step.icon;
  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className={`absolute left-[19px] top-10 w-0.5 h-full ${
          step.completed ? 'bg-gradient-to-b from-orange-400 to-green-400' : 'bg-gray-200'
        }`} />
      )}
      
      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
        step.completed 
          ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200'
          : step.active
          ? 'bg-white border-orange-400 text-orange-500 animate-pulse'
          : 'bg-gray-50 border-gray-200 text-gray-400'
      }`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="pb-8">
        <h4 className={`font-semibold text-sm ${
          step.completed || step.active ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {step.status}
        </h4>
        <p className={`text-xs mt-0.5 ${
          step.completed || step.active ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {step.description}
        </p>
        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {step.time}
        </p>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────
const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim() || phone.trim()) {
      setOrder(mockOrder);
      setIsSearched(true);
    }
  };

  const currentStatus = statusConfig[order?.status] || statusConfig.pending;

  return (
    <div className="min-h-screen  pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ── Header ───────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-200 mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your Order ID or Phone number to track your achar delivery</p>
        </div>

        {/* ── Search Form ──────────────────────────────────── */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order ID (e.g. ACHAR-250507-8842)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                />
              </div>
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Track
              </button>
            </div>
          </form>
        </div>

        {/* ── Order Result ─────────────────────────────────── */}
        {isSearched && order && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Order Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-gray-900">{order.orderId}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}>
                      {currentStatus.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Ordered on {order.orderDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Printer className="w-4 h-4" />
                    Invoice
                  </button>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative mb-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-green-400 rounded-full transition-all duration-1000"
                    style={{ 
                      width: order.status === 'pending' ? '10%' : 
                             order.status === 'confirmed' ? '30%' : 
                             order.status === 'shipped' ? '55%' : 
                             order.status === 'out_for_delivery' ? '80%' : '100%' 
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((label) => (
                    <span key={label} className="text-[10px] text-gray-400 hidden sm:block">{label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT: Timeline */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-24">
                  <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-orange-500" />
                    Shipment Activity
                  </h3>
                  <div className="space-y-0">
                    {order.timeline.map((step, idx) => (
                      <TimelineStep 
                        key={idx} 
                        step={step} 
                        isLast={idx === order.timeline.length - 1} 
                      />
                    ))}
                  </div>

                  {/* Delivery Estimate */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl border border-orange-100">
                    <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      {order.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Order Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Order Items ({order.items.length})
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="heading-product-name font-semibold text-gray-800 text-sm sm:text-base">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm font-bold text-orange-600">৳{item.price} × {item.qty}</p>
                            <p className="text-sm font-bold text-gray-900">৳{item.price * item.qty}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Payment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Address */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      Delivery Address
                    </h3>
                    <p className="text-sm font-semibold text-gray-800">{order.customer.name}</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{order.customer.address}</p>
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {order.customer.phone}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      Payment Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>৳{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>৳{order.shipping}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-৳{order.discount}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-orange-600">৳{order.total}</span>
                      </div>
                      <div className="pt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        {order.paymentMethod} • {order.paymentStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rate Order (if delivered) */}
                {order.status === 'delivered' && (
                  <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl border border-orange-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-800">How was your achar?</h3>
                      <p className="text-sm text-gray-600 mt-0.5">Rate your order and help others choose better!</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-orange-200 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors shadow-sm">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      Rate Now
                    </button>
                  </div>
                )}

                {/* Need Help */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">Need Help?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-sm text-gray-700">
                      <RotateCcw className="w-4 h-4 text-orange-500" />
                      Return Item
                    </button>
                    <button className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-orange-500" />
                      Call Support
                    </button>
                    <button className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-sm text-gray-700">
                      <MessageCircle className="w-4 h-4 text-orange-500" />
                      Chat with Seller
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── Empty / Not Found State ──────────────────────── */}
        {isSearched && !order && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Order Not Found</h3>
            <p className="text-sm text-gray-500">Please check your Order ID or Phone number and try again.</p>
          </div>
        )}
      </div>

      {/* ── Cancel Order Modal ───────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Order?</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No, Keep It
              </button>
              <button 
                onClick={() => { setShowCancelModal(false); }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TrackOrder;