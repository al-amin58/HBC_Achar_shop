// CheckoutPage.jsx
import  { useState, useMemo } from 'react';
import { useNavigate, useLocation  } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { useCart } from '../../componets/useCart.jsx';
import { 
  ChevronRight, 
  ChevronLeft, 
  Wallet, 
  Banknote, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Truck,
  Gift,
  X,
  Coins,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  

} from 'lucide-react';

// Demo data removed — using real cart from useCart hook

const coupons = {
  'ACHAR10': { type: 'percentage', value: 10, maxDiscount: 100 },
  'WELCOME50': { type: 'fixed', value: 50 },
  'FLASH25': { type: 'percentage', value: 25, maxDiscount: 200 }
};



// ─── Division → District → Thana Data ───────────────────────
const locationData = {
  'Dhaka': {
    'Dhaka North': ['Banani', 'Gulshan', 'Mirpur', 'Uttara', 'Badda'],
    'Dhaka South': ['Dhanmondi', 'Mohammadpur', 'Lalbagh', 'Sutrapur', 'Motijheel'],
    'Narayanganj': ['Siddhirganj', 'Bandar', 'Fatullah'],
    'Gazipur': ['Tongi', 'Kaliakair', 'Sreepur']
  },
  'Chittagong': {
    'Chittagong': ['Pahartali', 'Double Mooring', 'Halishahar', 'Kotwali', 'Panchlaish'],
    'Cox\'s Bazar': ['Teknaf', 'Ukhia', 'Ramu'],
    'Comilla': ['Debidwar', 'Daudkandi', 'Muradnagar']
  },
  'Khulna': {
    'Khulna': ['Sonadanga', 'Khalishpur', 'Daulatpur'],
    'Jessore': ['Bagherpara', 'Chaugachha', 'Jhikargachha'],
    'Satkhira': ['Tala', 'Kaliganj', 'Assasuni']
  },
  'Rajshahi': {
    'Rajshahi': ['Boalia', 'Motihar', 'Shahmakhdum'],
    'Bogura': ['Sherpur', 'Shibganj', 'Gabtali'],
    'Pabna': ['Ishwardi', 'Bera', 'Sujanagar']
  },
  'Sylhet': {
    'Sylhet': ['Zindabazar', 'Beanibazar', 'Golapganj'],
    'Moulvibazar': ['Kulaura', 'Sreemangal', 'Juri'],
    'Habiganj': ['Chunarughat', 'Madhabpur', 'Bahubal']
  },
  'Barishal': {
    'Barishal': ['Kotwali', 'Hizla', 'Mehendiganj'],
    'Patuakhali': ['Galachipa', 'Dashmina', 'Rangabali'],
    'Bhola': ['Burhanuddin', 'Tazumuddin', 'Lalmohan']
  },
  'Rangpur': {
    'Rangpur': ['Kotwali', 'Badarganj', 'Pirganj'],
    'Dinajpur': ['Birampur', 'Phulbari', 'Parbatipur'],
    'Kurigram': ['Rajarhat', 'Ulipur', 'Chilmari']
  },
  'Mymensingh': {
    'Mymensingh': ['Kotwali', 'Trishal', 'Muktagachha'],
    'Jamalpur': ['Melandaha', 'Sarishabari', 'Islampur'],
    'Netrokona': ['Kendua', 'Atpara', 'Barhatta']
  }
};

// WalletModal Component (Replace in CheckoutPage.jsx)
const WalletModal = ({ isOpen, onClose, balance }) => {
  if (!isOpen) return null;

  // Mock wallet transaction history
  const walletHistory = [
    { id: 1, type: 'credit', amount: 500, description: 'Welcome Bonus', date: '2026-05-01', status: 'completed' },
    { id: 2, type: 'debit', amount: 210, description: 'Order #ACHAR-250505-1122', date: '2026-05-03', status: 'completed' },
    { id: 3, type: 'credit', amount: 85, description: 'Refund - Order #ACHAR-250504-9988', date: '2026-05-04', status: 'completed' },
    { id: 4, type: 'debit', amount: 150, description: 'Order #ACHAR-250506-4455', date: '2026-05-06', status: 'pending' }
  ];

  // Calculate summary from history
  const totalDelivered = walletHistory
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = walletHistory
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + (t.type === 'debit' ? t.amount : 0), 0);

  const codCharges = walletHistory
    .filter(t => t.type === 'debit' && t.description.includes('Order'))
    .reduce((sum, t) => sum + (t.amount * 0.02), 0); // 2% COD charge

  const subTotal = totalDelivered - totalPending - codCharges;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">

        {/* Header */}
        <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">My Wallet</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-linear-to-br from-emerald-700 via-teal-700 to-emerald-800 p-8 text-center mx-4 mt-4 rounded-2xl">
          <p className="text-emerald-200 text-sm mb-2 font-medium">Available Balance</p>
          <p className="text-5xl font-bold text-white mb-2">৳{balance}</p>
          <p className="text-emerald-200 text-xs">You can request payment for this Amount</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-emerald-200 text-xs">Total Earned</p>
              <p className="text-white font-bold text-lg">৳{totalDelivered}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-emerald-200 text-xs">Pending</p>
              <p className="text-amber-300 font-bold text-lg">৳{totalPending}</p>
            </div>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="p-6 space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Balance Summary</h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400 text-sm">Amount Delivered</span>
              <span className="text-emerald-400 font-medium">৳{totalDelivered}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400 text-sm">Payable Delivery Charge</span>
              <span className="text-amber-400 font-medium">৳{totalPending > 0 ? 85 : 0}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400 text-sm">Sub-Total</span>
              <span className="text-white font-medium">৳{subTotal}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400 text-sm">COD Charge (2%)</span>
              <span className="text-red-400 font-medium">-৳{Math.round(codCharges)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-t-2 border-dashed border-gray-700">
              <span className="text-white font-bold">Total Clearable</span>
              <span className="text-emerald-400 font-bold text-xl">৳{balance}</span>
            </div>
          </div>

          {/* Clearable Consignments */}
          <div className="bg-emerald-900/30 border border-dashed border-emerald-600/50 rounded-xl p-4 text-center">
            <p className="text-emerald-400 font-medium text-sm">Clearable Consignments: {walletHistory.filter(t => t.status === 'completed').length}</p>
            <p className="text-emerald-600 text-xs mt-1">Pending Consignments: {walletHistory.filter(t => t.status === 'pending').length}</p>
          </div>
        </div>



        {/* Payment Request Button */}
        <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-800">
          <button 
            disabled={balance <= 0}
            className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all ${
              balance > 0
                ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {balance > 0 ? 'Payment Request' : 'No Balance Available'}
          </button>
          <p className="text-center text-gray-600 text-xs mt-2">
            Minimum withdraw amount: ৳200
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Coin Modal Component ───────────────────────────────────
const CoinModal = ({ isOpen, onClose, userCoins, onApplyCoins, maxUsableCoins }) => {
  const [coinAmount, setCoinAmount] = useState(0);
  const [coinError, setCoinError] = useState('');

  if (!isOpen) return null;

  const takaValue = (coinAmount / 100).toFixed(2);
  const maxTaka = (maxUsableCoins / 100).toFixed(2);

  const handleIncrement = () => {
    if (coinAmount + 100 <= Math.min(userCoins, maxUsableCoins)) {
      setCoinAmount(prev => prev + 100);
      setCoinError('');
    }
  };

  const handleDecrement = () => {
    if (coinAmount >= 100) {
      setCoinAmount(prev => prev - 100);
      setCoinError('');
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    // Round to nearest 100
    const rounded = Math.floor(value / 100) * 100;

    if (rounded > userCoins) {
      setCoinError(`আপনার কাছে সর্বোচ্চ ${userCoins} কয়েন আছে`);
      setCoinAmount(userCoins);
    } else if (rounded > maxUsableCoins) {
      setCoinError(`এই অর্ডারে সর্বোচ্চ ${maxUsableCoins} কয়েন ব্যবহার করা যাবে`);
      setCoinAmount(maxUsableCoins);
    } else {
      setCoinError('');
      setCoinAmount(rounded);
    }
  };

  const handleApply = () => {
    if (coinAmount < 100) {
      setCoinError('কমপক্ষে 100 কয়েন ব্যবহার করতে হবে');
      return;
    }
    if (coinAmount > userCoins) {
      setCoinError('যথেষ্ট কয়েন নেই');
      return;
    }
    onApplyCoins(coinAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-md w-full animate-scale-in shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-orange-100 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-800 font-bold text-lg">কয়েন ব্যবহার করুন</h3>
              <p className="text-xs text-gray-500">100 কয়েন = ৳1</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* User Coin Balance */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-gray-700 font-medium">আপনার কয়েন</span>
              </div>
              <span className="text-2xl font-bold text-amber-600">{userCoins.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">সমান ৳{(userCoins / 100).toFixed(2)}</p>
          </div>

          {/* Coin Input Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              কত কয়েন ব্যবহার করতে চান?
            </label>

            {/* Quick Select Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[100, 200, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    if (amount <= userCoins && amount <= maxUsableCoins) {
                      setCoinAmount(amount);
                      setCoinError('');
                    }
                  }}
                  disabled={amount > userCoins || amount > maxUsableCoins}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    coinAmount === amount
                      ? 'bg-amber-500 text-white shadow-md'
                      : amount > userCoins || amount > maxUsableCoins
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {amount}
                </button>
              ))}
              <button
                onClick={() => {
                  const max = Math.min(userCoins, maxUsableCoins);
                  setCoinAmount(max);
                  setCoinError('');
                }}
                disabled={userCoins < 100}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  coinAmount === Math.min(userCoins, maxUsableCoins)
                    ? 'bg-amber-500 text-white shadow-md'
                    : userCoins < 100
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                }`}
              >
                সর্বোচ্চ
              </button>
            </div>

            {/* Manual Input with +/- */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrement}
                disabled={coinAmount < 100}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  value={coinAmount || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-3 text-center text-lg font-bold border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">কয়েন</span>
              </div>

              <button
                onClick={handleIncrement}
                disabled={coinAmount + 100 > Math.min(userCoins, maxUsableCoins)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {coinError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {coinError}
              </p>
            )}
          </div>

          {/* Conversion Display */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">কয়েন</span>
              <span className="font-medium text-gray-800">{coinAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">রূপান্তর হার</span>
              <span className="font-medium text-gray-800">100 = ৳1</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <span className="text-gray-700 font-medium">ছাড়ের পরিমাণ</span>
              <span className="text-2xl font-bold text-amber-600">৳{takaValue}</span>
            </div>
          </div>

          {/* Max Usage Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p>এই অর্ডারে সর্বোচ্চ {maxUsableCoins.toLocaleString()} কয়েন ব্যবহার করা যাবে (৳{maxTaka})</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 rounded-b-3xl space-y-2">
          <button 
            onClick={handleApply}
            disabled={coinAmount < 100 || coinAmount > userCoins}
            className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all ${
              coinAmount >= 100 && coinAmount <= userCoins
                ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            কয়েন অ্যাপ্লাই করুন (৳{takaValue})
          </button>
          <button 
            onClick={onClose}
            className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            বাতিল করুন
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Reusable Components ────────────────────────────────────
const InputField = ({ label, required, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all bg-white/80 ${
        error 
          ? 'border-red-300 focus:ring-red-100 focus:border-red-400' 
          : 'border-orange-200 focus:ring-orange-100 focus:border-orange-400'
      }`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, required, options, value, onChange, placeholder, disabled, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all bg-white/80 ${
        disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
      } ${
        error 
          ? 'border-red-300 focus:ring-red-100 focus:border-red-400' 
          : 'border-orange-200 focus:ring-orange-100 focus:border-orange-400'
      }`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);



// ─── Main Component ─────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1 = Customer Info, 2 = Payment
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, monthlySubscription, clearCart, fetchCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);

  // Buy Now flow: if navigated with buyNow state, show only that product
  // Otherwise show full cart
  const checkoutItems = useMemo(() => {
    const buyNow = location.state?.buyNow ? location.state.product : null;
    if (buyNow) {
      return [{
        id: buyNow.id,
        name: buyNow.name,
        image: buyNow.image || '',
        variation: buyNow.variation || '',
        price: buyNow.price,
        qty: buyNow.qty || 1,
      }];
    }
    // Map cart items from useCart format to checkout display format
    return cart.map(item => ({
      id: item.cartId,
      cartId: item.cartId,
      productId: item.id,
      name: item.name,
      image: item.image || '',
      variation: item.variation?.label || '',
      variationLabel: item.variation?.label || '',
      price: item.price,
      oldPrice: item.oldPrice,
      isFlashSale: item.isFlashSale,
      qty: item.qty,
    }));
  }, [location.state, cart]);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    division: '',
    district: '',
    thana: '',
    address: '',
    saveInfo: false
  });

  const [formErrors, setFormErrors] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // ─── Coin States ─────────────────────────────────────────
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [appliedCoins, setAppliedCoins] = useState(0);
  const [userCoinBalance] = useState(2500);

  // Demo wallet balance
  const walletBalance = 500;

  // Calculations — using real checkoutItems
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryCharge = 85;

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      const discount = (subtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    }
    return appliedCoupon.value;
  };

  const discount = calculateDiscount();
  const coinDiscount = appliedCoins / 100; // 100 coins = 1 taka
  const totalBeforeWallet = subtotal + deliveryCharge - discount - coinDiscount;

  // Wallet logic: min order 100, delivery charge always paid by customer
  const canUseWallet = totalBeforeWallet >= 100;
  const walletDeduction = useWallet && canUseWallet 
    ? Math.min(walletBalance, totalBeforeWallet - deliveryCharge) 
    : 0;
  const finalTotal = totalBeforeWallet - walletDeduction;

  // Max coins usable (cannot exceed 50% of subtotal, and must have enough coins)
  const maxUsableCoins = Math.min(
    userCoinBalance,
    Math.floor((subtotal - discount) * 50 / 100) * 100 // 50% of (subtotal - coupon discount), rounded to 100
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Phone validation: only 11 digits
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    // Reset dependent fields
    if (name === 'division') {
      setFormData(prev => ({ ...prev, [name]: value, district: '', thana: '' }));
      return;
    }
    if (name === 'district') {
      setFormData(prev => ({ ...prev, [name]: value, thana: '' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'নাম প্রয়োজন';
    if (!formData.phone) errors.phone = 'ফোন নম্বর প্রয়োজন';
    else if (formData.phone.length !== 11) errors.phone = '১১ ডিজিটের ফোন নম্বর দিন';
    if (!formData.division) errors.division = 'বিভাগ নির্বাচন করুন';
    if (!formData.district) errors.district = 'জেলা নির্বাচন করুন';
    if (!formData.thana) errors.thana = 'থানা নির্বাচন করুন';
    if (!formData.address.trim()) errors.address = 'ঠিকানা প্রয়োজন';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('কুপন কোড লিখুন');
      return;
    }
    if (coupons[code]) {
      setAppliedCoupon({ code, ...coupons[code] });
      setCouponError('');
      setCouponCode('');
    } else {
      setAppliedCoupon(null);
      setCouponError('অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleApplyCoins = (coins) => {
    setAppliedCoins(coins);
  };

  const removeCoins = () => {
    setAppliedCoins(0);
  };

  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) {
      toast.error('কার্ট খালি');
      return;
    }
    setPlacingOrder(true);
    try {
      const isBuyNow = Boolean(location.state?.buyNow);
      const payload = {
        buyNow: isBuyNow,
        items: isBuyNow
          ? checkoutItems.map((it) => ({
              productId: location.state.product.id,
              name: it.name,
              image: it.image,
              variationLabel: it.variation,
              price: it.price,
              qty: it.qty,
              isFlashSale: location.state.product.isFlashSale,
            }))
          : undefined,
        customer: formData,
        paymentMethod,
        orderNote,
        couponCode: appliedCoupon?.code || '',
        discount,
        deliveryCharge,
        walletUsed: walletDeduction,
        coinDiscount,
        monthlySubscription,
      };
      const res = await api.post('/orders', payload);
      if (!isBuyNow) await clearCart();
      else await fetchCart();
      toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
      navigate(`/invoice?id=${res.data.id}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'অর্ডার সম্পন্ন করা যায়নি');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Get districts based on division
  const availableDistricts = formData.division ? Object.keys(locationData[formData.division] || {}) : [];

  // Get thanas based on district
  const availableThanas = formData.district && formData.division 
    ? locationData[formData.division][formData.district] || [] 
    : [];

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-green-400 flex items-center justify-center text-white font-bold text-lg">
                
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">চেকআউট</h1>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                step === 1 ? 'bg-orange-500 text-white' : 'bg-green-100 text-green-700'
              }`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
                <span className="hidden sm:inline">তথ্য</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                step === 2 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
                <span className="hidden sm:inline">পেমেন্ট</span>
              </div>
            </div>

            

            {/* My Wallet Button */}
            <button
              onClick={() => setShowWalletModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">My Wallet</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">৳{walletBalance}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
            onClick={() => navigate("/cart")}
          className="px-6 py-2.5 mb-5 flex  bg-linear-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-md"
        >
          <ArrowLeft/>
           Back to Cart
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* ═══════════════════════════════════════════════════ */}
            {/* STEP 1: Customer Information                      */}
            {/* ═══════════════════════════════════════════════════ */}
            {step === 1 && (
              <>
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-orange-100 p-6">
                 
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                    <h2 className="text-lg font-bold text-gray-800">গ্রাহকের তথ্য</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="পূর্ণ নাম"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                      error={formErrors.fullName}
                    />
                    <InputField
                      label="মোবাইল নম্বর"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      type="tel"
                      error={formErrors.phone}
                    />
                    <InputField
                      label="ইমেইল (ঐচ্ছিক)"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      type="email"
                    />

                    {/* Division Select */}
                    <SelectField
                      label="বিভাগ"
                      required
                      name="division"
                      value={formData.division}
                      onChange={handleInputChange}
                      options={Object.keys(locationData)}
                      placeholder="বিভাগ নির্বাচন করুন"
                      error={formErrors.division}
                    />

                    {/* District Select */}
                    <SelectField
                      label="জেলা"
                      required
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      options={availableDistricts}
                      placeholder="জেলা নির্বাচন করুন"
                      disabled={!formData.division}
                      error={formErrors.district}
                    />

                    {/* Thana Select */}
                    <SelectField
                      label="থানা / উপজেলা"
                      required
                      name="thana"
                      value={formData.thana}
                      onChange={handleInputChange}
                      options={availableThanas}
                      placeholder="থানা নির্বাচন করুন"
                      disabled={!formData.district}
                      error={formErrors.thana}
                    />

                    {/* Address Input */}
                    <div className="md:col-span-2">
                      <InputField
                        label="সম্পূর্ণ ঠিকানা"
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="বাড়ি / রোড / এলাকা নম্বর"
                        error={formErrors.address}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 rounded border-orange-300 focus:ring-orange-400"
                    />
                    <label htmlFor="saveInfo" className="text-sm text-gray-600">এই তথ্য সংরক্ষণ করুন (পরবর্তী অর্ডারের জন্য)</label>
                  </div>
                </div>


                {/* Shipping Method */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-orange-100 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                    <h2 className="text-lg font-bold text-gray-800">শিপিং চার্জ</h2>
                  </div>

                  <div className="relative p-4 rounded-xl border-2 border-green-400 bg-green-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">সারাদেশ ডেলিভারি চার্জ</span>
                      <span className="text-lg font-bold text-green-600">৳85</span>
                    </div>
                    <p className="text-sm text-gray-500">ডেলিভারি সময়: ৩৩ থেকে ৭২ ঘন্টা</p>


                  </div>
                </div>

                {/* Coupon / Voucher */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-orange-100 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                    <h2 className="text-lg font-bold text-gray-800">কুপন</h2>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="কুপন কোড লিখুন (যেমন: ACHAR10)"
                      className="flex-1 px-4 py-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none uppercase"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-6 py-2.5 bg-linear-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-md"
                    >
                      অ্যাপ্লাই
                    </button>
                  </div>

                  {couponError && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {couponError}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">{appliedCoupon.code} কুপন অ্যাপ্লাই হয়েছে</p>
                          <p className="text-xs text-green-600">
                            {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `৳${appliedCoupon.value}`} ছাড়
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        সরান
                      </button>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">ট্রাই করুন:</span>
                    {Object.keys(coupons).map(code => (
                      <button
                        key={code}
                        onClick={() => { setCouponCode(code); }}
                        className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ═══ Coin Section ═══ */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-orange-100 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      <Coins className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">কয়েন ছাড়</h2>
                    <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                      100 কয়েন = ৳1
                    </span>
                  </div>

                  {!appliedCoins ? (
                    <div className="flex items-center justify-between p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                          <Coins className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">কয়েন ব্যবহার করুন</p>
                          <p className="text-sm text-gray-500">
                            আপনার কাছে <span className="font-bold text-amber-600">{userCoinBalance.toLocaleString()}</span> কয়েন আছে
                          </p>
                          <p className="text-xs text-gray-400">সর্বোচ্চ {maxUsableCoins.toLocaleString()} কয়েন ব্যবহার করা যাবে</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCoinModal(true)}
                        disabled={userCoinBalance < 100 || maxUsableCoins < 100}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                          userCoinBalance >= 100 && maxUsableCoins >= 100
                            ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        কয়েন যোগ করুন
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 animate-fadeIn">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                            <Coins className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">কয়েন অ্যাপ্লাই হয়েছে</p>
                            <p className="text-sm text-amber-600 font-medium">
                              {appliedCoins.toLocaleString()} কয়েন = ৳{(appliedCoins / 100).toFixed(2)} ছাড়
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowCoinModal(true)}
                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                            title="পরিবর্তন করুন"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={removeCoins}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="সরান"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar showing remaining coins */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>ব্যবহৃত: {appliedCoins.toLocaleString()}</span>
                          <span>অবশিষ্ট: {(userCoinBalance - appliedCoins).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                            style={{ width: `${(appliedCoins / userCoinBalance) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-orange-100 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                    <h2 className="text-lg font-bold text-gray-800">অর্ডার নোট</h2>
                  </div>

                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="বিশেষ নির্দেশনা লিখুন... (যেমন: গেটে রাখবেন, ডেলিভারির আগে কল করবেন)"
                    rows={3}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none resize-none bg-white/80"
                  />
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {['গেটে রাখবেন', 'ডেলিভারির আগে কল করবেন', 'দ্রুত ডেলিভারি চাই', 'গিফট র‍্যাপ করবেন'].map((note) => (
                      <button
                        key={note}
                        onClick={() => setOrderNote(prev => prev ? prev + ', ' + note : note)}
                        className="text-xs px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors"
                      >
                        + {note}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextStep}
                  className="w-full py-4 bg-linear-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Next to Process
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* ═══════════════════════════════════════════════════ */}
            {/* STEP 2: Payment Method                            */}
            {/* ═══════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-orange-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <button 
                    onClick={handlePrevStep}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-400 to-green-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <h2 className="text-lg font-bold text-gray-800">পেমেন্ট পদ্ধতি</h2>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <button
                    onClick={() => { setPaymentMethod('cod'); setUseWallet(false); }}
                    className={`w-full relative p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      paymentMethod === 'cod'
                        ? 'border-orange-400 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-200 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">ক্যাশ অন ডেলিভারি</p>
                      <p className="text-sm text-gray-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                    </div>
                    {paymentMethod === 'cod' && (
                      <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    )}
                  </button>

                  {/* Wallet Payment */}
                  <button
                    onClick={() => { setPaymentMethod('wallet'); setUseWallet(true); }}
                    disabled={!canUseWallet}
                    className={`w-full relative p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      paymentMethod === 'wallet'
                        ? 'border-emerald-400 bg-emerald-50 shadow-md'
                        : !canUseWallet
                        ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 hover:border-emerald-200 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'wallet' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">ওয়ালেট পেমেন্ট</p>
                      <p className="text-sm text-gray-500">
                        ব্যালেন্স: ৳{walletBalance}
                        {!canUseWallet && <span className="text-red-500 block text-xs mt-1">মিনিমাম অর্ডার ৳100 প্রয়োজন</span>}
                      </p>
                    </div>
                    {paymentMethod === 'wallet' && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    )}
                  </button>

                  {/* bKash Payment */}
                  <button
                    onClick={() => { setPaymentMethod('bkash'); setUseWallet(false); }}
                    className={`w-full relative p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-400 bg-pink-50 shadow-md'
                        : 'border-gray-200 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'bkash' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">বিকাশ</p>
                      <p className="text-sm text-gray-500">বিকাশ অ্যাপ দিয়ে পেমেন্ট করুন</p>
                    </div>
                    {paymentMethod === 'bkash' && (
                      <CheckCircle2 className="w-6 h-6 text-pink-500" />
                    )}
                  </button>
                </div>

                {/* Wallet Payment Details */}
                {paymentMethod === 'wallet' && (
                  <div className="mt-6 p-5 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      ওয়ালেট পেমেন্ট বিবরণ
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>মোট অর্ডার</span>
                        <span>৳{totalBeforeWallet}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>ওয়ালেট থেকে কাটা হবে</span>
                        <span>-৳{walletDeduction}</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-800">
                        <span>ডেলিভারি চার্জ (ক্যাশ)</span>
                        <span>৳{deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-emerald-900 pt-1">
                        <span>আপনাকে দিতে হবে</span>
                        <span>৳{finalTotal}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-emerald-600 bg-white/60 p-2 rounded-lg">
                      💡 ডেলিভারি চার্জ সবসময় ক্যাশে পরিশোধ করতে হবে। পণ্যের মূল্য ওয়ালেট থেকে কাটা হবে।
                    </p>
                  </div>
                )}

                {/* bKash Payment Form */}
                {paymentMethod === 'bkash' && (
                  <div className="mt-6 p-5 bg-pink-50 rounded-xl border border-pink-200 space-y-4">
                    <p className="text-sm font-medium text-pink-800">
                      বিকাশ পেমেন্ট করুন: <span className="font-bold">01XXXXXXXXX</span> (Merchant)
                    </p>
                    <InputField
                      label="ট্রানজ্যাকশন আইডি (TrxID)"
                      placeholder="যেমন: 8A7B6C5D4E"
                    />
                    <InputField
                      label="পেমেন্ট করেছেন নম্বর"
                      placeholder="01XXXXXXXXX"
                      type="tel"
                    />
                  </div>
                )}

                {/* COD Info */}
                {paymentMethod === 'cod' && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    💡 ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করতে কোনো অগ্রিম পেমেন্ট লাগবে না। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || checkoutItems.length === 0}
                  className="w-full mt-6 py-4 bg-linear-to-r from-orange-500 via-amber-500 to-green-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Lock className="w-5 h-5" />
                  {placingOrder ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Order Summary */}
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-orange-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                  অর্ডার সারাংশ
                </h2>

                {monthlySubscription && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    প্রতি মাসে কিনতে চাই — অর্ডার ও ইনভয়েসে দেখাবে
                  </div>
                )}

                {/* Product List */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1 mb-4">
                  {checkoutItems.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      আপনার ব্যাগ খালি — পণ্য যোগ করুন
                    </div>
                  ) : checkoutItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-orange-50/50 transition-colors">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-orange-100"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-orange-50 flex items-center justify-center text-2xl border border-orange-100">🫙</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h3>
                        {item.variation && <p className="text-xs text-orange-600 mt-0.5">{item.variation}</p>}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">x{item.qty}</span>
                          <span className="text-sm font-bold text-gray-800">৳{item.price * item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-orange-100 pt-4 space-y-3">
                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>সাবটোটাল</span>
                      <span>৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>ডেলিভারি চার্জ</span>
                      <span className="text-green-600">৳{deliveryCharge}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>ছাড় ({appliedCoupon?.code})</span>
                        <span>-৳{discount}</span>
                      </div>
                    )}
                    {appliedCoins > 0 && (
                      <div className="flex justify-between text-amber-600 font-medium">
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          কয়েন ছাড় ({appliedCoins})
                        </span>
                        <span>-৳{coinDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {useWallet && walletDeduction > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>ওয়ালেট ব্যবহার</span>
                        <span>-৳{walletDeduction}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t-2 border-dashed border-orange-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-800">মোট</span>
                      <span className="text-2xl font-bold text-orange-600">
                        ৳{finalTotal}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">সব ট্যাক্স ও চার্জ অন্তর্ভুক্ত</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div className="bg-white/60 rounded-lg p-2 border border-orange-100">
                  <div className="text-lg mb-1">🔒</div>
                  <p>নিরাপদ পেমেন্ট</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 border border-orange-100">
                  <div className="text-lg mb-1">🚚</div>
                  <p>দ্রুত ডেলিভারি</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 border border-orange-100">
                  <div className="text-lg mb-1">✅</div>
                  <p>অরিজিনাল পণ্য</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
        balance={walletBalance}
      />

      {/* Coin Modal */}
      <CoinModal
        isOpen={showCoinModal}
        onClose={() => setShowCoinModal(false)}
        userCoins={userCoinBalance}
        onApplyCoins={handleApplyCoins}
        maxUsableCoins={maxUsableCoins}
      />

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
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
}
