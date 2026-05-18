import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  FileText,
  Send,
  RotateCcw,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  CreditCard,
  Smartphone,
  Wallet,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Calendar,
  Loader2,
  PackageOpen,
  AlertCircle,
  Zap,
  FileText as FileTextIcon,
  Crown,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Trash2,
  Check,
  Ban,
  Play,
  Box,
  SendHorizonal,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Copy,
  ExternalLink,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  ScanLine,
  Flag,
} from "lucide-react";

/* ────────────────────────────────
   THEME & TOKENS - Admin Panel Color Theme
   ──────────────────────────────── */
const T = {
  // Primary Colors
  primary: "#4F46E5",
  primaryDark: "#4338CA",
  primaryLight: "#818CF8",
  primaryFade: "#EEF2FF",

  // Secondary Colors
  secondary: "#0EA5E9",
  secondaryDark: "#0284C7",

  // Status Colors
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",
  info: "#3B82F6",
  infoLight: "#DBEAFE",

  // Neutral Colors
  dark: "#111827",
  darker: "#030712",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  white: "#FFFFFF",

  // Background Colors
  bg: "#F8FAFC",
  cardBg: "#FFFFFF",
  sidebarBg: "#1E1B4B",

  // Border Colors
  border: "#E5E7EB",
  borderDark: "#D1D5DB",

  // Text Colors
  text: "#111827",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  textWhite: "#FFFFFF",

  // Shadows
  shadow: "0 1px 3px rgba(0,0,0,0.08)",
  shadowHover: "0 8px 25px rgba(0,0,0,0.12)",
  shadowPrimary: "0 4px 14px rgba(79,70,229,0.25)",
  shadowSuccess: "0 4px 14px rgba(16,185,129,0.25)",
  shadowDanger: "0 4px 14px rgba(239,68,68,0.25)",

  // Border Radius
  radius: "12px",
  radiusSm: "8px",
  radiusLg: "16px",
  radiusXl: "20px",
};

/* ────────────────────────────────
   DUMMY DATA
   ──────────────────────────────── */
const ordersData = [
  {
    id: "HBC-240514-001",
    customer: {
      name: "Rahim Uddin",
      phone: "01712-345678",
      avatar: "https://i.pravatar.cc/150?u=1",
      email: "rahim@email.com",
      address: "House 12, Road 5, Dhanmondi",
      district: "Dhaka",
      note: "Please deliver in the morning",
    },
    products: [
      {
        name: "Mango Pickle (Achar) - 500g",
        sku: "MNG-500",
        image:
          "https://images.unsplash.com/photo-1606850780554-b55ea2ce99e4?w=80&h=80&fit=crop",
        variation: "Spicy",
        qty: 2,
        price: 320,
      },
      {
        name: "Lime Pickle - 250g",
        sku: "LIM-250",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80&h=80&fit=crop",
        variation: "Sweet",
        qty: 1,
        price: 180,
      },
    ],
    subtotal: 820,
    shipping: 80,
    coupon: 0,
    flashDiscount: 82,
    walletUsed: 0,
    total: 818,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    deliveryStatus: "Pending",
    source: "Flash Sale",
    orderDate: "2026-05-14 10:23 AM",
    isFlashSale: true,
    isLandingPage: false,
    isVIP: true,
    isRepeat: true,
    courier: "Pathao",
    trackingId: "PA-7845123",
    transactionId: null,
    adminNote: "Customer requested morning delivery",
    fraudScore: 15,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-002",
    customer: {
      name: "Fatima Begum",
      phone: "01823-456789",
      avatar: "https://i.pravatar.cc/150?u=2",
      email: "fatima@email.com",
      address: "Flat 4B, Block C, Gulshan",
      district: "Dhaka",
      note: "",
    },
    products: [
      {
        name: "Mixed Vegetable Pickle - 1kg",
        sku: "MIX-1KG",
        image:
          "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=80&h=80&fit=crop",
        variation: "Standard",
        qty: 1,
        price: 450,
      },
    ],
    subtotal: 450,
    shipping: 80,
    coupon: 50,
    flashDiscount: 0,
    walletUsed: 0,
    total: 480,
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    orderStatus: "Confirmed",
    deliveryStatus: "Confirmed",
    source: "Website",
    orderDate: "2026-05-14 09:15 AM",
    isFlashSale: false,
    isLandingPage: false,
    isVIP: false,
    isRepeat: false,
    courier: "RedX",
    trackingId: "RX-9988776",
    transactionId: "BK8A7C9D2E1F",
    adminNote: "",
    fraudScore: 5,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-003",
    customer: {
      name: "Kamal Hossain",
      phone: "01934-567890",
      avatar: "https://i.pravatar.cc/150?u=3",
      email: "kamal@email.com",
      address: "Village: Kashipur, Post: Boalia",
      district: "Rajshahi",
      note: "Call before delivery",
    },
    products: [
      {
        name: "Olive Pickle - 500g",
        sku: "OLV-500",
        image:
          "https://images.unsplash.com/photo-1594973193588-176d5b8a5c17?w=80&h=80&fit=crop",
        variation: "Premium",
        qty: 3,
        price: 380,
      },
      {
        name: "Garlic Pickle - 250g",
        sku: "GAR-250",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80&h=80&fit=crop",
        variation: "Standard",
        qty: 2,
        price: 220,
      },
    ],
    subtotal: 1580,
    shipping: 80,
    coupon: 0,
    flashDiscount: 0,
    walletUsed: 500,
    total: 1160,
    paymentMethod: "Wallet",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    deliveryStatus: "Processing",
    source: "Landing Page",
    orderDate: "2026-05-14 08:45 AM",
    isFlashSale: false,
    isLandingPage: true,
    isVIP: true,
    isRepeat: true,
    courier: "Steadfast",
    trackingId: "SF-1122334",
    transactionId: "WLT-5566778",
    adminNote: "VIP customer - priority processing",
    fraudScore: 10,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-004",
    customer: {
      name: "Nusrat Jahan",
      phone: "01645-678901",
      avatar: "https://i.pravatar.cc/150?u=4",
      email: "nusrat@email.com",
      address: "House 45, Lane 3, Uttara Sector 7",
      district: "Dhaka",
      note: "",
    },
    products: [
      {
        name: "Chili Pickle - 500g",
        sku: "CHL-500",
        image:
          "https://images.unsplash.com/photo-1606850780554-b55ea2ce99e4?w=80&h=80&fit=crop",
        variation: "Extra Hot",
        qty: 1,
        price: 290,
      },
    ],
    subtotal: 290,
    shipping: 80,
    coupon: 0,
    flashDiscount: 0,
    walletUsed: 0,
    total: 370,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Shipped",
    deliveryStatus: "In Transit",
    source: "Website",
    orderDate: "2026-05-13 04:30 PM",
    isFlashSale: false,
    isLandingPage: false,
    isVIP: false,
    isRepeat: true,
    courier: "Pathao",
    trackingId: "PA-9988776",
    transactionId: null,
    adminNote: "",
    fraudScore: 75,
    isFraudulent: true,
  },
  {
    id: "HBC-240514-005",
    customer: {
      name: "Abdul Karim",
      phone: "01556-789012",
      avatar: "https://i.pravatar.cc/150?u=5",
      email: "karim@email.com",
      address: "Shop 12, Main Road, Chawkbazar",
      district: "Chattogram",
      note: "",
    },
    products: [
      {
        name: "Mango Pickle (Achar) - 1kg",
        sku: "MNG-1KG",
        image:
          "https://images.unsplash.com/photo-1606850780554-b55ea2ce99e4?w=80&h=80&fit=crop",
        variation: "Sweet",
        qty: 2,
        price: 580,
      },
      {
        name: "Lime Pickle - 500g",
        sku: "LIM-500",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80&h=80&fit=crop",
        variation: "Spicy",
        qty: 1,
        price: 340,
      },
      {
        name: "Mixed Pickle - 250g",
        sku: "MIX-250",
        image:
          "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=80&h=80&fit=crop",
        variation: "Standard",
        qty: 3,
        price: 160,
      },
    ],
    subtotal: 1980,
    shipping: 0,
    coupon: 100,
    flashDiscount: 198,
    walletUsed: 0,
    total: 1682,
    paymentMethod: "Nagad",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    deliveryStatus: "Delivered",
    source: "Flash Sale",
    orderDate: "2026-05-12 11:20 AM",
    isFlashSale: true,
    isLandingPage: false,
    isVIP: false,
    isRepeat: false,
    courier: "RedX",
    trackingId: "RX-5544332",
    transactionId: "NGD-8877665",
    adminNote: "Delivered successfully",
    fraudScore: 5,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-006",
    customer: {
      name: "Selina Akter",
      phone: "01767-890123",
      avatar: "https://i.pravatar.cc/150?u=6",
      email: "selina@email.com",
      address: "House 8, Road 2, Banani",
      district: "Dhaka",
      note: "Leave at reception",
    },
    products: [
      {
        name: "Carrot Pickle - 500g",
        sku: "CRT-500",
        image:
          "https://images.unsplash.com/photo-1594973193588-176d5b8a5c17?w=80&h=80&fit=crop",
        variation: "Standard",
        qty: 1,
        price: 250,
      },
    ],
    subtotal: 250,
    shipping: 80,
    coupon: 0,
    flashDiscount: 0,
    walletUsed: 0,
    total: 330,
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    orderStatus: "Packed",
    deliveryStatus: "Ready for Pickup",
    source: "Website",
    orderDate: "2026-05-13 02:15 PM",
    isFlashSale: false,
    isLandingPage: false,
    isVIP: true,
    isRepeat: true,
    courier: "Pathao",
    trackingId: "PA-2233445",
    transactionId: "BK9B8D0E3F2A",
    adminNote: "",
    fraudScore: 8,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-007",
    customer: {
      name: "Mohammad Ali",
      phone: "01878-901234",
      avatar: "https://i.pravatar.cc/150?u=7",
      email: "ali@email.com",
      address: "Village: Bhatara, Post: Bashundhara",
      district: "Dhaka",
      note: "",
    },
    products: [
      {
        name: "Mango Pickle (Achar) - 250g",
        sku: "MNG-250",
        image:
          "https://images.unsplash.com/photo-1606850780554-b55ea2ce99e4?w=80&h=80&fit=crop",
        variation: "Spicy",
        qty: 4,
        price: 180,
      },
    ],
    subtotal: 720,
    shipping: 80,
    coupon: 0,
    flashDiscount: 0,
    walletUsed: 0,
    total: 800,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    deliveryStatus: "Pending",
    source: "Landing Page",
    orderDate: "2026-05-14 07:30 AM",
    isFlashSale: false,
    isLandingPage: true,
    isVIP: false,
    isRepeat: false,
    courier: "Steadfast",
    trackingId: null,
    transactionId: null,
    adminNote: "First time customer",
    fraudScore: 12,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-008",
    customer: {
      name: "Tasnim Rahman",
      phone: "01989-012345",
      avatar: "https://i.pravatar.cc/150?u=8",
      email: "tasnim@email.com",
      address: "Flat 10A, House 23, Mirpur 10",
      district: "Dhaka",
      note: "Gift wrap please",
    },
    products: [
      {
        name: "Mixed Vegetable Pickle - 500g",
        sku: "MIX-500",
        image:
          "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=80&h=80&fit=crop",
        variation: "Premium",
        qty: 2,
        price: 280,
      },
      {
        name: "Chili Pickle - 250g",
        sku: "CHL-250",
        image:
          "https://images.unsplash.com/photo-1606850780554-b55ea2ce99e4?w=80&h=80&fit=crop",
        variation: "Standard",
        qty: 1,
        price: 150,
      },
    ],
    subtotal: 710,
    shipping: 80,
    coupon: 0,
    flashDiscount: 71,
    walletUsed: 200,
    total: 519,
    paymentMethod: "Wallet",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    deliveryStatus: "In Transit",
    source: "Flash Sale",
    orderDate: "2026-05-13 06:00 PM",
    isFlashSale: true,
    isLandingPage: false,
    isVIP: true,
    isRepeat: true,
    courier: "RedX",
    trackingId: "RX-6677889",
    transactionId: "WLT-2233445",
    adminNote: "",
    fraudScore: 18,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-009",
    customer: {
      name: "Shahina Begum",
      phone: "01678-234567",
      avatar: "https://i.pravatar.cc/150?u=9",
      email: "shahina@email.com",
      address: "House 3, Road 8, Mohammadpur",
      district: "Dhaka",
      note: "",
    },
    products: [
      {
        name: "Mango Pickle (Achar) - 500g",
        sku: "MNG-500",
        image:
          "https://images.unsplash.com/photo-1606850780554-b55ea2ce99e4?w=80&h=80&fit=crop",
        variation: "Sweet",
        qty: 1,
        price: 320,
      },
    ],
    subtotal: 320,
    shipping: 80,
    coupon: 0,
    flashDiscount: 0,
    walletUsed: 0,
    total: 400,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Cancelled",
    deliveryStatus: "Cancelled",
    source: "Website",
    orderDate: "2026-05-13 11:00 AM",
    isFlashSale: false,
    isLandingPage: false,
    isVIP: false,
    isRepeat: false,
    courier: null,
    trackingId: null,
    transactionId: null,
    adminNote: "Customer cancelled - out of stock",
    fraudScore: 0,
    isFraudulent: false,
  },
  {
    id: "HBC-240514-010",
    customer: {
      name: "Imran Khan",
      phone: "01789-345678",
      avatar: "https://i.pravatar.cc/150?u=10",
      email: "imran@email.com",
      address: "Shop 12, Main Road, Chawkbazar",
      district: "Chattogram",
      note: "",
    },
    products: [
      {
        name: "Mango Pickle (Achar) - 1kg",
        sku: "MNG-1KG",
        image:
          "https://images.unsplash.com/photo-1606850780554-b55ea2ce99e4?w=80&h=80&fit=crop",
        variation: "Sweet",
        qty: 2,
        price: 580,
      },
      {
        name: "Lime Pickle - 500g",
        sku: "LIM-500",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80&h=80&fit=crop",
        variation: "Spicy",
        qty: 1,
        price: 340,
      },
    ],
    subtotal: 1450,
    shipping: 80,
    coupon: 0,
    flashDiscount: 0,
    walletUsed: 0,
    total: 1530,
    paymentMethod: "Card",
    paymentStatus: "Refunded",
    orderStatus: "Returned",
    deliveryStatus: "Returned",
    source: "Website",
    orderDate: "2026-05-11 03:45 PM",
    isFlashSale: false,
    isLandingPage: false,
    isVIP: false,
    isRepeat: true,
    courier: "Pathao",
    trackingId: "PA-4455667",
    transactionId: "CRD-9988776",
    adminNote: "Product damaged - refunded",
    fraudScore: 25,
    isFraudulent: false,
  },
];

const districts = [
  "All Districts",
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];
const orderStatuses = [
  "All Status",
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];
const deliveryStatuses = [
  "All Delivery",
  "Pending",
  "Confirmed",
  "Processing",
  "Ready for Pickup",
  "In Transit",
  "Delivered",
  "Cancelled",
  "Returned",
];
const paymentStatuses = [
  "All Payment",
  "Paid",
  "Pending",
  "Failed",
  "Refunded",
];
const paymentMethods = [
  "All Methods",
  "COD",
  "bKash",
  "Nagad",
  "Wallet",
  "Card",
];
const courierServices = ["Pathao", "RedX", "Steadfast", "eCourier", "Paperfly"];

/* ────────────────────────────────
   UTILITY COMPONENTS
   ──────────────────────────────── */

const StatusBadge = ({ status }) => {
  const statusClasses = {
    Pending: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    Confirmed: "bg-blue-400/20 text-blue-300 border-blue-400/30",
    Processing: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30",
    Packed: "bg-violet-400/20 text-violet-300 border-violet-400/30",
    Shipped: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
    Delivered: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
    Cancelled: "bg-rose-400/20 text-rose-300 border-rose-400/30",
    Returned: "bg-purple-400/20 text-purple-300 border-purple-400/30",
    Paid: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
    Failed: "bg-rose-400/20 text-rose-300 border-rose-400/30",
    Refunded: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    "In Transit": "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
    "Ready for Pickup": "bg-violet-400/20 text-violet-300 border-violet-400/30",
  };

  const dotColors = {
    Pending: "bg-amber-400",
    Confirmed: "bg-blue-400",
    Processing: "bg-indigo-400",
    Packed: "bg-violet-400",
    Shipped: "bg-cyan-400",
    Delivered: "bg-emerald-400",
    Cancelled: "bg-rose-400",
    Returned: "bg-purple-400",
    Paid: "bg-emerald-400",
    Failed: "bg-rose-400",
    Refunded: "bg-amber-400",
    "In Transit": "bg-cyan-400",
    "Ready for Pickup": "bg-violet-400",
  };

  const classes = statusClasses[status] || statusClasses.Pending;
  const dotColor = dotColors[status] || dotColors.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

const PaymentBadge = ({ method }) => {
  const paymentClasses = {
    COD: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    bKash: "bg-pink-400/20 text-pink-300 border-pink-400/30",
    Nagad: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    Wallet: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30",
    Card: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  };

  const paymentLabels = {
    COD: "COD",
    bKash: "bKash",
    Nagad: "Nagad",
    Wallet: "Wallet",
    Card: "Card",
  };

  const classes = paymentClasses[method] || paymentClasses.COD;
  const label = paymentLabels[method] || paymentLabels.COD;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}
    >
      {label}
    </span>
  );
};

const FraudBadge = ({ score, isFraudulent }) => {
  if (isFraudulent) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-400/20 text-rose-300">
        <ShieldAlert size={12} />
        Fraud
      </span>
    );
  }
  if (score > 50) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-400/20 text-amber-300">
        <ShieldAlert size={12} />
        Risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-400/20 text-emerald-300">
      <ShieldCheck size={12} />
      Safe
    </span>
  );
};

const Tag = ({ type }) => {
  const tagClasses = {
    flash: "bg-amber-400/20 text-amber-300",
    landing: "bg-indigo-400/20 text-indigo-300",
    vip: "bg-amber-400/20 text-amber-300",
    repeat: "bg-emerald-400/20 text-emerald-300",
  };

  const tagTexts = {
    flash: "Flash Sale",
    landing: "Landing Page",
    vip: "VIP",
    repeat: "Repeat",
  };

  const classes = tagClasses[type];
  const text = tagTexts[type];

  if (!classes || !text) return null;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${classes}`}
    >
      {text}
    </span>
  );
};

/* ────────────────────────────────
   SKELETON COMPONENTS
   ──────────────────────────────── */

const SkeletonFilters = () => (
  <div className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-gray-100">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i}>
          <div className="w-2/5 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="w-full h-9 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    <div className="px-5 py-4 border-b border-gray-100 flex gap-2.5">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex-1 h-3.5 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="px-5 py-4 border-b border-gray-100 flex gap-2.5 items-center"
      >
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-3.5 bg-gray-200 rounded animate-pulse" />
        <div className="w-36 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-32 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-20 h-3.5 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-3.5 bg-gray-200 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

const SkeletonDrawer = () => (
  <div style={{ padding: 24 }}>
    <div
      style={{
        width: "60%",
        height: 24,
        background: "#E5E7EB",
        borderRadius: 6,
        marginBottom: 20,
        animation: "pulse 1.5s infinite",
      }}
    />
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ marginBottom: 16 }}>
        <div
          style={{
            width: "30%",
            height: 12,
            background: "#E5E7EB",
            borderRadius: 4,
            marginBottom: 8,
            animation: "pulse 1.5s infinite",
          }}
        />
        <div
          style={{
            width: "100%",
            height: 60,
            background: "#E5E7EB",
            borderRadius: 10,
            animation: "pulse 1.5s infinite",
          }}
        />
      </div>
    ))}
  </div>
);

/* ────────────────────────────────
   EMPTY STATES
   ──────────────────────────────── */

const EmptyState = ({ type = "no-orders" }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 20px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: T.primaryFade,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      <PackageOpen size={36} color={T.primary} />
    </div>
    <h3
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: "#374151",
        marginBottom: 8,
      }}
    >
      {type === "search" ? "No Results Found" : "No Orders Found"}
    </h3>
    <p
      style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 320, lineHeight: 1.5 }}
    >
      {type === "search"
        ? "We could not find any orders matching your search criteria. Try adjusting your filters."
        : "There are no orders to display at the moment. New orders will appear here once customers place them."}
    </p>
  </div>
);

/* ────────────────────────────────
   ORDER STATUS TIMELINE
   ──────────────────────────────── */

const OrderTimeline = ({ currentStatus }) => {
  const normalSteps = [
    "Pending",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
  ];
  const isCancelled = currentStatus === "Cancelled";
  const isReturned = currentStatus === "Returned";

  if (isCancelled) {
    return (
      <div style={{ padding: "20px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 16,
            background: T.dangerLight,
            borderRadius: 12,
            border: `1px solid ${T.danger}30`,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: T.danger,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <XCircle size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.danger }}>
              Order Cancelled
            </p>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              This order has been cancelled and will not be processed further.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isReturned) {
    return (
      <div style={{ padding: "20px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 16,
            background: "#F3E8FF",
            borderRadius: 12,
            border: "1px solid #E9D5FF",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#8B5CF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RotateCcw size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#7C3AED" }}>
              Order Returned
            </p>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              This order has been returned by the customer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = normalSteps.indexOf(currentStatus);

  return (
    <div style={{ padding: "20px 0" }}>
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        {normalSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: isCompleted ? T.primary : "#E5E7EB",
                    border: `3px solid ${isCurrent ? T.primary : isCompleted ? T.primary : "#E5E7EB"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isCurrent ? `0 0 0 4px ${T.primary}20` : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isCompleted ? (
                    <Check size={18} color="#fff" strokeWidth={3} />
                  ) : (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#D1D5DB",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    color: isCompleted ? T.dark : "#9CA3AF",
                  }}
                >
                  {step}
                </span>
              </div>
              {index < normalSteps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background: index < currentIndex ? T.primary : "#E5E7EB",
                    marginTop: -18,
                    position: "relative",
                    zIndex: 1,
                    transition: "background 0.3s",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ────────────────────────────────
   ORDER DETAILS DRAWER
   ──────────────────────────────── */

const OrderDetailsDrawer = ({ order, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [adminNote, setAdminNote] = useState(order?.adminNote || "");
  const [statusUpdate, setStatusUpdate] = useState(
    order?.orderStatus || "Pending",
  );
  const [drawerLoading, setDrawerLoading] = useState(true);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showFraudModal, setShowFraudModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDrawerLoading(true);
      const timer = setTimeout(() => setDrawerLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, order?.id]);

  useEffect(() => {
    if (order) {
      setAdminNote(order.adminNote || "");
      setStatusUpdate(order.orderStatus);
    }
  }, [order]);

  if (!isOpen) return null;

  const tabs = [
    { id: "details", label: "Details", icon: ClipboardList },
    { id: "invoice", label: "Invoice", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Clock },
  ];

  const grandTotal = order
    ? order.subtotal +
      order.shipping -
      order.coupon -
      order.flashDiscount -
      order.walletUsed
    : 0;

  const handleCourierAssign = (courierName) => {
    // Logic to assign courier
    setShowCourierModal(false);
  };

  const handleFraudCheck = (action) => {
    // Logic for fraud check
    setShowFraudModal(false);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "flex-end",
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            height: "100%",
            background: "#fff",
            boxShadow: "-10px 0 50px rgba(0,0,0,0.15)",
            overflow: "auto",
            animation: "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {drawerLoading ? (
            <SkeletonDrawer />
          ) : order ? (
            <>
              {/* Header */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 10,
                  borderBottom: "1px solid #F3F4F6",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: T.text,
                      marginBottom: 4,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Order {order.id}
                  </h2>
                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                    {order.orderDate}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <StatusBadge status={order.orderStatus} />
                  <button
                    onClick={onClose}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid #E5E7EB",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F3F4F6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    <X size={18} color="#6B7280" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  padding: "16px 24px",
                  background: T.bg,
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setShowCourierModal(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: T.radiusSm,
                      background: T.primary,
                      color: "#fff",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: T.shadowPrimary,
                      transition: "all 0.2s",
                    }}
                  >
                    <Truck size={14} />
                    Assign Courier
                  </button>
                  <button
                    onClick={() => setShowFraudModal(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: T.radiusSm,
                      background: order.isFraudulent ? T.danger : T.warning,
                      color: "#fff",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: order.isFraudulent
                        ? T.shadowDanger
                        : `0 4px 14px ${T.warning}40`,
                      transition: "all 0.2s",
                    }}
                  >
                    <ScanLine size={14} />
                    Fraud Check
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: T.radiusSm,
                      background: "#fff",
                      color: T.text,
                      border: `1px solid ${T.border}`,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <Printer size={14} />
                    Print
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #F3F4F6",
                  padding: "0 24px",
                  gap: 4,
                }}
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "14px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "none",
                        background: "none",
                        borderBottom: `2px solid ${active ? T.primary : "transparent"}`,
                        color: active ? T.primary : "#6B7280",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: "24px" }}>
                {activeTab === "details" && (
                  <>
                    {/* Customer Info */}
                    <SectionCard title="Customer Information" icon={User}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          marginBottom: 18,
                        }}
                      >
                        <img
                          src={order.customer.avatar}
                          alt=""
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `2px solid ${T.primaryFade}`,
                          }}
                        />
                        <div>
                          <p
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: "#1F2937",
                            }}
                          >
                            {order.customer.name}
                          </p>
                          <div
                            style={{ display: "flex", gap: 6, marginTop: 4 }}
                          >
                            {order.isVIP && <Tag type="vip" />}
                            {order.isRepeat && <Tag type="repeat" />}
                          </div>
                        </div>
                      </div>
                      <InfoGrid
                        items={[
                          {
                            icon: Phone,
                            label: "Phone",
                            value: order.customer.phone,
                          },
                          {
                            icon: Mail,
                            label: "Email",
                            value: order.customer.email,
                          },
                          {
                            icon: MapPin,
                            label: "Address",
                            value: `${order.customer.address}, ${order.customer.district}`,
                          },
                        ]}
                      />
                      {order.customer.note && (
                        <div
                          style={{
                            marginTop: 14,
                            padding: 12,
                            background: "#FEF3C7",
                            borderRadius: 10,
                            border: "1px solid #FCD34D",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <AlertCircle
                            size={16}
                            color="#D97706"
                            style={{ marginTop: 1, flexShrink: 0 }}
                          />
                          <div>
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#92400E",
                                marginBottom: 2,
                              }}
                            >
                              Customer Note
                            </p>
                            <p style={{ fontSize: 12, color: "#A16207" }}>
                              {order.customer.note}
                            </p>
                          </div>
                        </div>
                      )}
                    </SectionCard>

                    {/* Products */}
                    <SectionCard
                      title={`Ordered Products (${order.products.length})`}
                      icon={Package}
                    >
                      {order.products.map((p, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            gap: 14,
                            padding: 14,
                            background: "#FAFAFA",
                            border: "1px solid #F3F4F6",
                            borderRadius: 12,
                            marginBottom: 10,
                          }}
                        >
                          <img
                            src={p.image}
                            alt=""
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: 10,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#1F2937",
                                marginBottom: 4,
                              }}
                            >
                              {p.name}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#9CA3AF",
                                marginBottom: 8,
                              }}
                            >
                              SKU: {p.sku}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#6B7280",
                                  background: "#F3F4F6",
                                  padding: "3px 10px",
                                  borderRadius: 6,
                                  fontWeight: 500,
                                }}
                              >
                                {p.variation}
                              </span>
                              <span style={{ fontSize: 12, color: "#6B7280" }}>
                                Qty:{" "}
                                <strong style={{ color: "#1F2937" }}>
                                  {p.qty}
                                </strong>
                              </span>
                              <span style={{ fontSize: 12, color: "#6B7280" }}>
                                Unit:{" "}
                                <strong style={{ color: "#1F2937" }}>
                                  ৳ {p.price}
                                </strong>
                              </span>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: T.primary,
                                }}
                              >
                                Total: ৳ {p.price * p.qty}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </SectionCard>

                    {/* Pricing Summary */}
                    <SectionCard title="Pricing Summary" icon={Wallet}>
                      <div style={{ display: "grid", gap: 10 }}>
                        <PriceRow label="Subtotal" value={order.subtotal} />
                        <PriceRow
                          label="Shipping Charge"
                          value={order.shipping}
                        />
                        {order.coupon > 0 && (
                          <PriceRow
                            label="Coupon Discount"
                            value={-order.coupon}
                            color={T.success}
                          />
                        )}
                        {order.flashDiscount > 0 && (
                          <PriceRow
                            label="Flash Sale Discount"
                            value={-order.flashDiscount}
                            color={T.success}
                          />
                        )}
                        {order.walletUsed > 0 && (
                          <PriceRow
                            label="Wallet Used"
                            value={-order.walletUsed}
                            color={T.info}
                          />
                        )}
                        <div
                          style={{
                            borderTop: `2px dashed ${T.border}`,
                            paddingTop: 12,
                            marginTop: 4,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#1F2937",
                            }}
                          >
                            Grand Total
                          </span>
                          <span
                            style={{
                              fontSize: 22,
                              fontWeight: 800,
                              color: T.primary,
                            }}
                          >
                            ৳ {grandTotal}
                          </span>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Payment Info */}
                    <SectionCard title="Payment Information" icon={CreditCard}>
                      <InfoGrid
                        items={[
                          {
                            icon: CreditCard,
                            label: "Payment Method",
                            value: (
                              <PaymentBadge method={order.paymentMethod} />
                            ),
                          },
                          {
                            icon: CheckCircle,
                            label: "Payment Status",
                            value: <StatusBadge status={order.paymentStatus} />,
                          },
                        ]}
                      />
                      {order.transactionId && (
                        <div
                          style={{
                            marginTop: 12,
                            padding: 12,
                            background: T.successLight,
                            borderRadius: 10,
                            border: `1px solid ${T.success}40`,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <CheckCircle size={16} color={T.success} />
                          <div>
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#047857",
                              }}
                            >
                              Transaction ID
                            </p>
                            <p
                              style={{
                                fontSize: 13,
                                fontFamily: "monospace",
                                fontWeight: 600,
                                color: "#065F46",
                              }}
                            >
                              {order.transactionId}
                            </p>
                          </div>
                        </div>
                      )}
                    </SectionCard>

                    {/* Delivery Info */}
                    <SectionCard title="Delivery Information" icon={Truck}>
                      <InfoGrid
                        items={[
                          {
                            icon: Truck,
                            label: "Courier Service",
                            value: order.courier || "Not Assigned",
                          },
                          {
                            icon: MapPin,
                            label: "Tracking ID",
                            value: order.trackingId || "Not Available",
                          },
                          {
                            icon: Clock,
                            label: "Delivery Status",
                            value: (
                              <StatusBadge status={order.deliveryStatus} />
                            ),
                          },
                        ]}
                      />
                    </SectionCard>

                    {/* Fraud Check Info */}
                    <SectionCard title="Fraud Check" icon={ShieldCheck}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: 16,
                          background: order.isFraudulent
                            ? T.dangerLight
                            : order.fraudScore > 50
                              ? T.warningLight
                              : T.successLight,
                          borderRadius: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: order.isFraudulent
                              ? T.danger
                              : order.fraudScore > 50
                                ? T.warning
                                : T.success,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {order.isFraudulent ? (
                            <ShieldAlert size={28} color="#fff" />
                          ) : (
                            <ShieldCheck size={28} color="#fff" />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: order.isFraudulent
                                ? T.danger
                                : order.fraudScore > 50
                                  ? "#B45309"
                                  : "#047857",
                            }}
                          >
                            {order.isFraudulent
                              ? "High Risk Order"
                              : order.fraudScore > 50
                                ? "Medium Risk"
                                : "Low Risk"}
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#6B7280",
                              marginTop: 2,
                            }}
                          >
                            Fraud Score: <strong>{order.fraudScore}/100</strong>
                          </p>
                        </div>
                        <FraudBadge
                          score={order.fraudScore}
                          isFraudulent={order.isFraudulent}
                        />
                      </div>
                    </SectionCard>

                    {/* Admin Actions */}
                    <SectionCard title="Admin Actions" icon={Settings}>
                      <div style={{ display: "grid", gap: 14 }}>
                        <div>
                          <label
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#374151",
                              marginBottom: 6,
                              display: "block",
                            }}
                          >
                            Update Order Status
                          </label>
                          <select
                            value={statusUpdate}
                            onChange={(e) => setStatusUpdate(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 14px",
                              borderRadius: T.radiusSm,
                              border: "1px solid #E5E7EB",
                              fontSize: 13,
                              color: "#374151",
                              background: "#fff",
                              cursor: "pointer",
                              outline: "none",
                            }}
                          >
                            {orderStatuses
                              .filter((s) => s !== "All Status")
                              .map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#374151",
                              marginBottom: 6,
                              display: "block",
                            }}
                          >
                            Admin Note
                          </label>
                          <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Add a note about this order..."
                            style={{
                              width: "100%",
                              padding: "10px 14px",
                              borderRadius: T.radiusSm,
                              border: "1px solid #E5E7EB",
                              fontSize: 13,
                              color: "#374151",
                              background: "#fff",
                              minHeight: 80,
                              resize: "vertical",
                              fontFamily: "inherit",
                              outline: "none",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 10,
                          }}
                        >
                          <ActionButton
                            icon={Printer}
                            label="Print Invoice"
                            variant="outline"
                          />
                          <ActionButton
                            icon={Download}
                            label="Download"
                            variant="outline"
                          />
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 10,
                          }}
                        >
                          <ActionButton
                            icon={RotateCcw}
                            label="Refund"
                            variant="danger"
                          />
                          <ActionButton
                            icon={Send}
                            label="Send SMS"
                            variant="info"
                          />
                          <ActionButton
                            icon={CheckCircle}
                            label="Save"
                            variant="primary"
                          />
                        </div>
                      </div>
                    </SectionCard>
                  </>
                )}

                {activeTab === "invoice" && (
                  <InvoicePreview order={order} grandTotal={grandTotal} />
                )}

                {activeTab === "timeline" && (
                  <div>
                    <OrderTimeline currentStatus={order.orderStatus} />
                    <div
                      style={{
                        marginTop: 20,
                        padding: 20,
                        background: "#FAFAFA",
                        borderRadius: 14,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#374151",
                          marginBottom: 14,
                        }}
                      >
                        Status History
                      </h4>
                      {[
                        "Pending",
                        "Confirmed",
                        "Processing",
                        "Packed",
                        "Shipped",
                        "Delivered",
                      ].map((status, i) => {
                        const done =
                          i <= orderStatuses.indexOf(order.orderStatus) - 1;
                        return (
                          <div
                            key={status}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 0",
                              borderBottom:
                                i < 5 ? "1px solid #E5E7EB" : "none",
                              opacity: done ? 1 : 0.35,
                            }}
                          >
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: done ? T.primary : "#D1D5DB",
                              }}
                            />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#374151",
                                flex: 1,
                              }}
                            >
                              {status}
                            </span>
                            <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                              {done ? "2026-05-14 10:30 AM" : "--"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Courier Modal */}
      {showCourierModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: T.radiusLg,
              padding: 24,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: T.text,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <LocalShipping size={20} color={T.primary} />
              Assign Courier
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              {courierServices.map((courier) => (
                <button
                  key={courier}
                  onClick={() => handleCourierAssign(courier)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: T.radiusSm,
                    background:
                      order.courier === courier ? T.primaryFade : "#fff",
                    border: `1px solid ${order.courier === courier ? T.primary : T.border}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background:
                        order.courier === courier ? T.primary : T.primaryFade,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Truck
                      size={16}
                      color={order.courier === courier ? "#fff" : T.primary}
                    />
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
                      {courier}
                    </p>
                    {order.courier === courier && (
                      <p style={{ fontSize: 11, color: T.primary }}>
                        Currently Assigned
                      </p>
                    )}
                  </div>
                  {order.courier === courier && (
                    <CheckCircle size={18} color={T.success} />
                  )}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowCourierModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: T.radiusSm,
                  background: "#fff",
                  color: T.text,
                  border: `1px solid ${T.border}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fraud Check Modal */}
      {showFraudModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: T.radiusLg,
              padding: 24,
              width: "100%",
              maxWidth: 450,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: T.text,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ShieldAlert
                size={20}
                color={order.isFraudulent ? T.danger : T.warning}
              />
              Fraud Check
            </h3>
            <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 20 }}>
              Review the fraud risk assessment for this order.
            </p>

            <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  padding: 16,
                  background: order.isFraudulent
                    ? T.dangerLight
                    : order.fraudScore > 50
                      ? T.warningLight
                      : T.successLight,
                  borderRadius: T.radius,
                  border: `1px solid ${order.isFraudulent ? T.danger : order.fraudScore > 50 ? T.warning : T.success}40`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: order.isFraudulent
                        ? T.danger
                        : order.fraudScore > 50
                          ? T.warning
                          : T.success,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {order.isFraudulent ? (
                      <ShieldAlert size={24} color="#fff" />
                    ) : order.fraudScore > 50 ? (
                      <Flag size={24} color="#fff" />
                    ) : (
                      <ShieldCheck size={24} color="#fff" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: order.isFraudulent
                          ? T.danger
                          : order.fraudScore > 50
                            ? "#B45309"
                            : "#047857",
                      }}
                    >
                      {order.fraudScore}%
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280" }}>
                      Fraud Risk Score
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    background: T.bg,
                    borderRadius: T.radiusSm,
                  }}
                >
                  <p style={{ fontSize: 11, color: T.textMuted }}>IP Address</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    192.168.1.1
                  </p>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: T.bg,
                    borderRadius: T.radiusSm,
                  }}
                >
                  <p style={{ fontSize: 11, color: T.textMuted }}>Device</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    Mobile - Android
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {!order.isFraudulent ? (
                <button
                  onClick={() => handleFraudCheck("flag")}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: T.radiusSm,
                    background: T.danger,
                    color: "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Flag size={14} />
                  Flag as Fraud
                </button>
              ) : (
                <button
                  onClick={() => handleFraudCheck("clear")}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: T.radiusSm,
                    background: T.success,
                    color: "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <ShieldCheck size={14} />
                  Clear Fraud
                </button>
              )}
              <button
                onClick={() => setShowFraudModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: T.radiusSm,
                  background: "#fff",
                  color: T.text,
                  border: `1px solid ${T.border}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ── Helper components for drawer ── */

const SectionCard = ({ title, icon: Icon, children }) => (
  <div
    style={{
      background: "#FAFAFA",
      borderRadius: 14,
      padding: 20,
      marginBottom: 20,
      border: "1px solid #F3F4F6",
    }}
  >
    <h3
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: "#374151",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: T.primaryFade,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={15} color={T.primary} />
      </div>
      {title}
    </h3>
    {children}
  </div>
);

const InfoGrid = ({ items }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {items.map((item, i) => {
      const Icon = item.icon;
      return (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: item.label === "Address" ? "flex-start" : "center",
            gap: 10,
          }}
        >
          <Icon
            size={14}
            color="#9CA3AF"
            style={{
              marginTop: item.label === "Address" ? 2 : 0,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                display: "block",
                marginBottom: 1,
              }}
            >
              {item.label}
            </span>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
              {item.value}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

const PriceRow = ({ label, value, color }) => (
  <div
    style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
  >
    <span style={{ color: "#6B7280" }}>{label}</span>
    <span style={{ fontWeight: 600, color: color || "#1F2937" }}>
      {color && value < 0 ? "" : "৳ "}
      {Math.abs(value)}
    </span>
  </div>
);

const ActionButton = ({ icon: Icon, label, variant }) => {
  const styles = {
    primary: { bg: T.primary, color: "#fff", border: "none" },
    outline: { bg: "#fff", color: "#374151", border: "1px solid #E5E7EB" },
    danger: { bg: T.danger, color: "#fff", border: "none" },
    info: { bg: T.info, color: "#fff", border: "none" },
  };
  const s = styles[variant];
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "10px 14px",
        borderRadius: T.radiusSm,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: s.border,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (variant === "outline") e.currentTarget.style.background = "#F3F4F6";
        else e.currentTarget.style.opacity = 0.9;
      }}
      onMouseLeave={(e) => {
        if (variant === "outline") e.currentTarget.style.background = "#fff";
        else e.currentTarget.style.opacity = 1;
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  );
};

/* ────────────────────────────────
   INVOICE PREVIEW
   ──────────────────────────────── */

const InvoicePreview = ({ order, grandTotal }) => {
  const subtotal = order.products.reduce((sum, p) => sum + p.price * p.qty, 0);
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        padding: 32,
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: T.primary,
            marginBottom: 4,
            letterSpacing: "-0.5px",
          }}
        >
          HBC ACHAR
        </h1>
        <p style={{ fontSize: 12, color: "#9CA3AF" }}>
          Premium Homemade Pickles & Spices
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: "2px solid #F3F4F6",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Bill To
          </p>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            {order.customer.name}
          </p>
          <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
            {order.customer.address}
          </p>
          <p style={{ fontSize: 12, color: "#6B7280" }}>
            {order.customer.district}
          </p>
          <p style={{ fontSize: 12, color: "#6B7280" }}>
            {order.customer.phone}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Invoice
          </p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            #{order.id}
          </p>
          <p style={{ fontSize: 12, color: "#6B7280" }}>
            Date: {order.orderDate}
          </p>
          <p style={{ fontSize: 12, color: "#6B7280" }}>
            Status: {order.orderStatus}
          </p>
          <p style={{ fontSize: 12, color: "#6B7280" }}>
            Payment: {order.paymentMethod}
          </p>
        </div>
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 28 }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
            <th
              style={{
                textAlign: "left",
                padding: "10px 0",
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
              }}
            >
              Item
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "10px 0",
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
              }}
            >
              Qty
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "10px 0",
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
              }}
            >
              Price
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "10px 0",
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
              }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
              <td style={{ padding: "12px 0" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>
                  {p.name}
                </p>
                <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                  SKU: {p.sku} | {p.variation}
                </p>
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "12px 0",
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                {p.qty}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "12px 0",
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                ৳ {p.price}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "12px 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1F2937",
                }}
              >
                ৳ {p.price * p.qty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: "2px solid #E5E7EB", paddingTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 260 }}>
            <PriceRow label="Subtotal" value={subtotal} />
            <PriceRow label="Shipping" value={order.shipping} />
            {order.coupon > 0 && (
              <PriceRow
                label="Coupon Discount"
                value={-order.coupon}
                color={T.success}
              />
            )}
            {order.flashDiscount > 0 && (
              <PriceRow
                label="Flash Sale Discount"
                value={-order.flashDiscount}
                color={T.success}
              />
            )}
            {order.walletUsed > 0 && (
              <PriceRow
                label="Wallet Used"
                value={-order.walletUsed}
                color={T.info}
              />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 12,
                borderTop: "2px dashed #E5E7EB",
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700 }}>Grand Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>
                ৳ {grandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 36,
          textAlign: "center",
          paddingTop: 20,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <p style={{ fontSize: 12, color: "#9CA3AF" }}>
          Thank you for your order!
        </p>
        <p style={{ fontSize: 11, color: "#D1D5DB", marginTop: 4 }}>
          HBC Achar | support@hbcachar.com | +880 1234-567890
        </p>
      </div>
    </div>
  );
};

/* ────────────────────────────────
   ROW ACTION DROPDOWN
   ──────────────────────────────── */

const RowActionMenu = ({ order, onView }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const actions = [
    {
      icon: Eye,
      label: "View Order",
      onClick: () => {
        onView();
        setOpen(false);
      },
    },
    {
      icon: Truck,
      label: "Assign Courier",
      onClick: () => setOpen(false),
    },
    { icon: ScanLine, label: "Fraud Check", onClick: () => setOpen(false) },
    { icon: Printer, label: "Print Invoice", onClick: () => setOpen(false) },
    {
      icon: Download,
      label: "Download Invoice",
      onClick: () => setOpen(false),
    },
    { icon: Send, label: "Send SMS", onClick: () => setOpen(false) },
    {
      icon: CheckCircle,
      label: "Mark Delivered",
      onClick: () => setOpen(false),
    },
    {
      icon: Ban,
      label: "Cancel Order",
      onClick: () => setOpen(false),
      danger: true,
    },
    {
      icon: Trash2,
      label: "Delete Order",
      onClick: () => setOpen(false),
      danger: true,
    },
  ];

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: "1px solid #E5E7EB",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6B7280",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#F3F4F6";
          e.currentTarget.style.color = T.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.color = "#6B7280";
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 0,
            width: 190,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            border: "1px solid #F3F4F6",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <button
                key={i}
                onClick={a.onClick}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: a.danger ? T.danger : "#374151",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = a.danger
                    ? "#FEF2F2"
                    : "#F9FAFB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <Icon size={14} />
                {a.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Settings icon component
const Settings = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* ────────────────────────────────
   MAIN ORDERS COMPONENT
   ──────────────────────────────── */

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    orderId: "",
    phone: "",
    dateFrom: "",
    dateTo: "",
    status: "All Status",
    deliveryStatus: "All Delivery",
    paymentStatus: "All Payment",
    paymentMethod: "All Methods",
    district: "All Districts",
    flashSale: "all",
    landingPage: "all",
  });
  const [filteredOrders, setFilteredOrders] = useState(ordersData);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setViewingOrder(null), 350);
  };

  const handleApplyFilters = () => {
    let result = [...ordersData];
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          o.customer.name.toLowerCase().includes(term) ||
          o.customer.phone.includes(term),
      );
    }
    if (filters.orderId)
      result = result.filter((o) =>
        o.id.toLowerCase().includes(filters.orderId.toLowerCase()),
      );
    if (filters.phone)
      result = result.filter((o) => o.customer.phone.includes(filters.phone));
    if (filters.status !== "All Status")
      result = result.filter((o) => o.orderStatus === filters.status);
    if (filters.deliveryStatus !== "All Delivery")
      result = result.filter(
        (o) => o.deliveryStatus === filters.deliveryStatus,
      );
    if (filters.paymentStatus !== "All Payment")
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
    if (filters.paymentMethod !== "All Methods")
      result = result.filter((o) => o.paymentMethod === filters.paymentMethod);
    if (filters.district !== "All Districts")
      result = result.filter((o) => o.customer.district === filters.district);
    if (filters.flashSale !== "all")
      result = result.filter(
        (o) => o.isFlashSale === (filters.flashSale === "yes"),
      );
    if (filters.landingPage !== "all")
      result = result.filter(
        (o) => o.isLandingPage === (filters.landingPage === "yes"),
      );
    setFilteredOrders(result);
    setSelectedOrders([]);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      orderId: "",
      phone: "",
      dateFrom: "",
      dateTo: "",
      status: "All Status",
      deliveryStatus: "All Delivery",
      paymentStatus: "All Payment",
      paymentMethod: "All Methods",
      district: "All Districts",
      flashSale: "all",
      landingPage: "all",
    });
    setFilteredOrders(ordersData);
    setSelectedOrders([]);
  };

  const allSelected =
    filteredOrders.length > 0 &&
    selectedOrders.length === filteredOrders.length;
  const toggleAll = () => {
    if (allSelected) setSelectedOrders([]);
    else setSelectedOrders(filteredOrders.map((o) => o.id));
  };
  const toggleOne = (id) => {
    if (selectedOrders.includes(id))
      setSelectedOrders(selectedOrders.filter((i) => i !== id));
    else setSelectedOrders([...selectedOrders, id]);
  };

  const inputBase = {
    padding: "10px 14px",
    borderRadius: T.radiusSm,
    fontSize: 13,
    border: `1px solid ${T.border}`,
    background: "#fff",
    color: T.text,
    outline: "none",
    width: "100%",
    transition: "all 0.2s",
  };

  const selectBase = {
    ...inputBase,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 32,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        input:focus, select:focus, textarea:focus { border-color: ${T.primary} !important; box-shadow: 0 0 0 3px ${T.primary}20 !important; }
        * { scrollbar-width: thin; scrollbar-color: #E5E7EB #F8FAFC; }
        *::-webkit-scrollbar { width: 6px; }
        *::-webkit-scrollbar-track { background: #F8FAFC; }
        *::-webkit-scrollbar-thumb { background: #E5E7EB; borderRadius: 3px; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-table-card { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-table-card { display: none !important; }
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          padding: "20px 28px",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.5px",
              }}
            >
              Orders Management
            </h1>
            <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>
              Manage, track, and process all customer orders
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                borderRadius: T.radiusSm,
                background: "#fff",
                color: T.text,
                border: `1px solid ${T.border}`,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F3F4F6")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <Download size={16} />
              Export
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                borderRadius: T.radiusSm,
                background: "#fff",
                color: T.text,
                border: `1px solid ${T.border}`,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F3F4F6")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>
      </div>

      <main style={{ padding: "24px 28px", maxWidth: 1400, margin: "0 auto" }}>
        {/* ── FILTERS ── */}
        {loading ? (
          <SkeletonFilters />
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: T.radius,
              padding: "20px 24px",
              boxShadow: T.shadow,
              marginBottom: 20,
              border: "1px solid #F3F4F6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Filter size={18} color={T.primary} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text }}>
                  Filters
                </h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                style={{
                  display: "none",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textMuted,
                }}
                className="mobile-filter-toggle"
              >
                {mobileFiltersOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
                Filters
              </button>
            </div>

            <div
              className="filter-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              <div>
                <label style={labelStyle}>Search</label>
                <div style={{ position: "relative" }}>
                  <Search
                    size={16}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9CA3AF",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    style={{ ...inputBase, paddingLeft: 38 }}
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Order ID</label>
                <input
                  type="text"
                  placeholder="HBC-240514-xxx"
                  style={inputBase}
                  value={filters.orderId}
                  onChange={(e) =>
                    setFilters({ ...filters, orderId: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Customer Phone</label>
                <input
                  type="text"
                  placeholder="01xxxxxxxxx"
                  style={inputBase}
                  value={filters.phone}
                  onChange={(e) =>
                    setFilters({ ...filters, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Date Range</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="date"
                    style={{ ...inputBase, flex: 1 }}
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    style={{ ...inputBase, flex: 1 }}
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Order Status</label>
                <select
                  style={selectBase}
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Delivery Status</label>
                <select
                  style={selectBase}
                  value={filters.deliveryStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, deliveryStatus: e.target.value })
                  }
                >
                  {deliveryStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Payment Status</label>
                <select
                  style={selectBase}
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentStatus: e.target.value })
                  }
                >
                  {paymentStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Payment Method</label>
                <select
                  style={selectBase}
                  value={filters.paymentMethod}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentMethod: e.target.value })
                  }
                >
                  {paymentMethods.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>District</label>
                <select
                  style={selectBase}
                  value={filters.district}
                  onChange={(e) =>
                    setFilters({ ...filters, district: e.target.value })
                  }
                >
                  {districts.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Flash Sale</label>
                <select
                  style={selectBase}
                  value={filters.flashSale}
                  onChange={(e) =>
                    setFilters({ ...filters, flashSale: e.target.value })
                  }
                >
                  <option value="all">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Landing Page</label>
                <select
                  style={selectBase}
                  value={filters.landingPage}
                  onChange={(e) =>
                    setFilters({ ...filters, landingPage: e.target.value })
                  }
                >
                  <option value="all">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleResetFilters}
                style={{
                  padding: "8px 18px",
                  borderRadius: T.radiusSm,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "#F3F4F6",
                  color: T.textMuted,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#E5E7EB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#F3F4F6")
                }
              >
                <RefreshCw size={14} />
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                style={{
                  padding: "8px 18px",
                  borderRadius: T.radiusSm,
                  fontSize: 13,
                  fontWeight: 600,
                  background: T.primary,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: T.shadowPrimary,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.primaryDark;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.primary;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Filter size={14} />
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* ── BULK ACTION TOOLBAR ── */}
        {selectedOrders.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              background: T.primaryFade,
              borderRadius: T.radius,
              border: `1px solid ${T.primary}30`,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
              {selectedOrders.length} selected
            </span>
            <div
              style={{ width: 1, height: 20, background: `${T.primary}40` }}
            />
            {[
              { icon: CheckCircle, label: "Confirm", color: T.success },
              { icon: Play, label: "Processing", color: T.primary },
              { icon: Truck, label: "Shipped", color: T.secondary },
              { icon: CheckCircle, label: "Delivered", color: T.success },
              { icon: Ban, label: "Cancel", color: T.danger },
              { icon: Trash2, label: "Delete", color: T.danger },
              { icon: Printer, label: "Print", color: T.text },
              { icon: Download, label: "Export", color: T.text },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <button
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: `${a.color}15`,
                    color: a.color,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${a.color}25`;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${a.color}15`;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Icon size={13} />
                  {a.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── ORDERS TABLE (DESKTOP) ── */}
        {loading ? (
          <SkeletonTable />
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: T.radius,
              boxShadow: T.shadow,
              overflow: "hidden",
              border: "1px solid #F3F4F6",
            }}
            className="desktop-only"
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 1200,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#F9FAFB",
                      borderBottom: "2px solid #E5E7EB",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    <th style={{ padding: "14px 16px", textAlign: "left" }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        style={{
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                          accentColor: T.primary,
                        }}
                      />
                    </th>
                    {[
                      "Order ID",
                      "Customer",
                      "Products",
                      "Total",
                      "Payment",
                      "Pay Status",
                      "Order Status",
                      "Fraud",
                      "Source",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid #F3F4F6",
                        background: idx % 2 === 0 ? "#fff" : "#FAFAFA",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = T.primaryFade)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          idx % 2 === 0 ? "#fff" : "#FAFAFA")
                      }
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOne(order.id)}
                          style={{
                            width: 16,
                            height: 16,
                            cursor: "pointer",
                            accentColor: T.primary,
                          }}
                        />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: T.text,
                              fontFamily: "monospace",
                            }}
                          >
                            {order.id}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            {order.isFlashSale && <Tag type="flash" />}
                            {order.isLandingPage && <Tag type="landing" />}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <img
                            src={order.customer.avatar}
                            alt=""
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: T.text,
                              }}
                            >
                              {order.customer.name}
                            </p>
                            <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                              {order.customer.phone}
                            </p>
                            <div
                              style={{ display: "flex", gap: 4, marginTop: 2 }}
                            >
                              {order.isVIP && <Tag type="vip" />}
                              {order.isRepeat && <Tag type="repeat" />}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div style={{ display: "flex", marginLeft: -6 }}>
                            {order.products.slice(0, 3).map((p, i) => (
                              <img
                                key={i}
                                src={p.image}
                                alt=""
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 6,
                                  objectFit: "cover",
                                  border: "2px solid #fff",
                                  marginLeft: -6,
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>
                            {order.products.length > 1
                              ? `+${order.products.length - 1} more`
                              : "1 item"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: T.primary,
                          }}
                        >
                          ৳ {order.total}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <PaymentBadge method={order.paymentMethod} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={order.orderStatus} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <FraudBadge
                          score={order.fraudScore}
                          isFraudulent={order.isFraudulent}
                        />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#6B7280",
                            fontWeight: 500,
                          }}
                        >
                          {order.source}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                          {order.orderDate}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <RowActionMenu
                          order={order}
                          onView={() => handleViewOrder(order)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #F3F4F6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "#6B7280" }}>
                Showing 1 to {filteredOrders.length} of {filteredOrders.length}{" "}
                entries
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    color: "#6B7280",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={14} />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: page === 1 ? "none" : "1px solid #E5E7EB",
                      background: page === 1 ? T.primary : "#fff",
                      color: page === 1 ? "#fff" : "#6B7280",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    color: "#6B7280",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MOBILE TABLE CARDS ── */}
        {!loading && (
          <div className="mobile-table-card" style={{ display: "none" }}>
            {filteredOrders.length === 0 ? (
              <EmptyState type="search" />
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "#fff",
                    borderRadius: T.radius,
                    padding: 16,
                    marginBottom: 12,
                    boxShadow: T.shadow,
                    border: "1px solid #F3F4F6",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: T.text,
                          fontFamily: "monospace",
                        }}
                      >
                        {order.id}
                      </span>
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        {order.isFlashSale && <Tag type="flash" />}
                        {order.isLandingPage && <Tag type="landing" />}
                      </div>
                    </div>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <img
                      src={order.customer.avatar}
                      alt=""
                      style={{ width: 36, height: 36, borderRadius: "50%" }}
                    />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>
                        {order.customer.name}
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {order.customer.phone}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#6B7280" }}>
                      {order.products.length} items · {order.source}
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: T.primary,
                      }}
                    >
                      ৳ {order.total}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <PaymentBadge method={order.paymentMethod} />
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleViewOrder(order)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "none",
                        background: T.primary,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View Order
                    </button>
                    <button
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        background: "#fff",
                        color: "#6B7280",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Empty state for desktop */}
        {!loading && filteredOrders.length === 0 && (
          <div className="desktop-only">
            <EmptyState type="search" />
          </div>
        )}
      </main>

      {/* ── ORDER DETAILS DRAWER ── */}
      <OrderDetailsDrawer
        order={viewingOrder}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#6B7280",
  marginBottom: 6,
};
