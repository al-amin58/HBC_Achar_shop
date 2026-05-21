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
  Wallet,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  PackageOpen,
  AlertCircle,
  X,
  Trash2,
  Check,
  Ban,
  Play,
  
  ClipboardList,
  
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  ScanLine,
  Flag,
  Settings,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { openAdminInvoice, exportOrdersToCsv } from "../../utils/invoiceHelpers";

/* ────────────────────────────────
   GLASSMORPHISM THEME (Matching Categories Page)
   ──────────────────────────────── */

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-purple-200 text-sm mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${classes}`}>
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

  const classes = paymentClasses[method] || paymentClasses.COD;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      {method}
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
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      {text}
    </span>
  );
};

// District list (not currently used)

const orderStatuses = ["All Status", "Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"];
const deliveryStatuses = ["All Delivery", "Pending", "Confirmed", "Processing", "Ready for Pickup", "In Transit", "Delivered", "Cancelled", "Returned"];
const paymentStatuses = ["All Payment", "Paid", "Pending", "Failed", "Refunded"];

const DEFAULT_COURIER_SERVICES = ["Pathao", "RedX", "Steadfast", "eCourier", "Paperfly"];

/* ────────────────────────────────
   SKELETON COMPONENTS
   ──────────────────────────────── */
const SkeletonFilters = () => (
  <GlassCard className="p-5 mb-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i}>
          <div className="w-2/5 h-3 bg-white/10 rounded mb-2 animate-pulse" />
          <div className="w-full h-9 bg-white/10 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  </GlassCard>
);

const SkeletonTable = () => (
  <GlassCard className="overflow-hidden">
    <div className="px-5 py-4 border-b border-white/10 flex gap-2.5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex-1 h-3.5 bg-white/10 rounded animate-pulse" />
      ))}
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="px-5 py-4 border-b border-white/5 flex gap-2.5 items-center">
        <div className="w-4 h-4 bg-white/10 rounded animate-pulse" />
        <div className="w-24 h-3.5 bg-white/10 rounded animate-pulse" />
        <div className="w-36 h-9 bg-white/10 rounded-lg animate-pulse" />
        <div className="w-32 h-9 bg-white/10 rounded-lg animate-pulse" />
        <div className="w-20 h-3.5 bg-white/10 rounded animate-pulse" />
        <div className="w-16 h-6 bg-white/10 rounded-full animate-pulse" />
        <div className="w-16 h-6 bg-white/10 rounded-full animate-pulse" />
        <div className="w-20 h-3.5 bg-white/10 rounded animate-pulse" />
      </div>
    ))}
  </GlassCard>
);

const SkeletonDrawer = () => (
  <div className="p-6">
    <div className="w-3/5 h-6 bg-white/10 rounded mb-5 animate-pulse" />
    {[...Array(6)].map((_, i) => (
      <div key={i} className="mb-4">
        <div className="w-1/3 h-3 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="w-full h-14 bg-white/10 rounded-xl animate-pulse" />
      </div>
    ))}
  </div>
);

/* ────────────────────────────────
   EMPTY STATES
   ──────────────────────────────── */
const EmptyState = ({ type = "no-orders" }) => (
  <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5 border border-white/10">
      <PackageOpen size={36} className="text-orange-300" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">
      {type === "search" ? "No Results Found" : "No Orders Found"}
    </h3>
    <p className="text-sm text-purple-300 max-w-xs leading-relaxed">
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
  const normalSteps = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"];
  const isCancelled = currentStatus === "Cancelled";
  const isReturned = currentStatus === "Returned";

  if (isCancelled) {
    return (
      <div className="py-5">
        <div className="flex items-center gap-3 p-4 bg-rose-400/10 rounded-xl border border-rose-400/20">
          <div className="w-10 h-10 rounded-full bg-rose-400 flex items-center justify-center">
            <XCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-300">Order Cancelled</p>
            <p className="text-xs text-purple-300 mt-0.5">This order has been cancelled and will not be processed further.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isReturned) {
    return (
      <div className="py-5">
        <div className="flex items-center gap-3 p-4 bg-purple-400/10 rounded-xl border border-purple-400/20">
          <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center">
            <RotateCcw size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-purple-300">Order Returned</p>
            <p className="text-xs text-purple-300 mt-0.5">This order has been returned by the customer.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = normalSteps.indexOf(currentStatus);

  return (
    <div className="py-5">
      <div className="flex items-center relative">
        {normalSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1 relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-3 transition-all duration-300 ${
                    isCompleted ? "bg-orange-300 border-orange-300" : "bg-white/10 border-white/20"
                  } ${isCurrent ? "ring-4 ring-orange-300/20" : ""}`}
                >
                  {isCompleted ? (
                    <Check size={18} className="text-[#4A1942]" strokeWidth={3} />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  )}
                </div>
                <span className={`mt-2 text-[11px] font-semibold ${isCompleted ? "text-white" : "text-purple-300"}`}>
                  {step}
                </span>
              </div>
              {index < normalSteps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 -mt-5 relative z-0 transition-colors duration-300 ${
                    index < currentIndex ? "bg-orange-300" : "bg-white/10"
                  }`}
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
const OrderDetailsDrawer = ({
  order,
  isOpen,
  onClose,
  courierServices = DEFAULT_COURIER_SERVICES,
  onOrderUpdated,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [adminNote, setAdminNote] = useState(order?.adminNote || "");
  const [statusUpdate, setStatusUpdate] = useState(order?.orderStatus || "Pending");
  const [drawerLoading, setDrawerLoading] = useState(true);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Defer setting state to avoid synchronous setState inside effect
      const startTimer = setTimeout(() => setDrawerLoading(true), 0);
      const timer = setTimeout(() => setDrawerLoading(false), 600);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen, order?.id]);

  useEffect(() => {
    if (order) {
      // Defer setting state to avoid synchronous setState inside effect
      const t = setTimeout(() => {
        setAdminNote(order.adminNote || "");
        setStatusUpdate(order.orderStatus);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [order]);

  if (!isOpen) return null;

  const tabs = [
    { id: "details", label: "Details", icon: ClipboardList },
    { id: "invoice", label: "Invoice", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Clock },
  ];

  const grandTotal = order
    ? order.subtotal + order.shipping - order.coupon - order.flashDiscount - order.walletUsed
    : 0;

  const handleCourierAssign = async (courierItem) => {
    if (!order?._id) return;
    const name = typeof courierItem === "string" ? courierItem : courierItem.name;
    const slug = typeof courierItem === "string" ? undefined : courierItem.slug;
    setSaving(true);
    try {
      const { data } = await api.post(`/admin/orders/${order._id}/courier`, {
        courier: name,
        courierSlug: slug,
      });
      toast.success(data.message || "Courier assigned & API booking complete");
      onOrderUpdated?.(data.order);
      setShowCourierModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign courier");
    } finally {
      setSaving(false);
    }
  };

  const handleFraudCheck = async (action) => {
    if (!order?._id) return;
    setSaving(true);
    try {
      const { data } = await api.post(`/admin/orders/${order._id}/fraud`, { action });
      toast.success(data.message || "Fraud status updated");
      onOrderUpdated?.(data.order);
      setShowFraudModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update fraud status");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOrder = async () => {
    if (!order?._id) return;
    setSaving(true);
    try {
      const { data } = await api.patch(`/admin/orders/${order._id}`, {
        orderStatus: statusUpdate,
        adminNote,
      });
      toast.success(data.message || "Order saved");
      onOrderUpdated?.(data.order);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  const handleSendSms = async () => {
    if (!order?._id) return;
    try {
      const { data } = await api.post(`/admin/orders/${order._id}/sms`);
      toast.success(data.message || "SMS sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send SMS");
    }
  };

  const handlePrint = () => openAdminInvoice(order, { print: true });

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
        onClick={onClose}
      >
        <div
          className="w-full max-w-150 h-full bg-[#4A1942] shadow-2xl overflow-auto animate-slideInRight"
          onClick={(e) => e.stopPropagation()}
        >
          {drawerLoading ? (
            <SkeletonDrawer />
          ) : order ? (
            <>
              {/* Header */}
              <div className="sticky top-0 bg-[#4A1942] z-10 border-b border-white/10 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Order {order.id}</h2>
                  <p className="text-xs text-purple-300 mt-1">{order.orderDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.orderStatus} />
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-purple-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowCourierModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] text-xs font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
                  >
                    <Truck size={14} />
                    Assign Courier
                  </button>
                  <button
                    onClick={() => setShowFraudModal(true)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-lg transition-all ${
                      order.isFraudulent
                        ? "bg-linear-to-r from-rose-300 to-rose-400 shadow-rose-500/20"
                        : "bg-linear-to-r from-amber-300 to-amber-400 shadow-amber-500/20"
                    }`}
                  >
                    <ScanLine size={14} />
                    Fraud Check
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-purple-200 text-xs font-bold border border-white/10 hover:bg-white/20 transition-all"
                  >
                    <Printer size={14} />
                    Print
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 px-6 gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-semibold border-b-2 transition-all cursor-pointer ${
                        active
                          ? "border-orange-300 text-orange-300"
                          : "border-transparent text-purple-300 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {activeTab === "details" && (
                  <>
                    {/* Customer Info */}
                    <SectionCard title="Customer Information" icon={User}>
                      <div className="flex items-center gap-3.5 mb-4">
                        <img
                          src={order.customer.avatar}
                          alt=""
                          className="w-13 h-13 rounded-full object-cover border-2 border-orange-300/30"
                        />
                        <div>
                          <p className="text-base font-bold text-white">{order.customer.name}</p>
                          <div className="flex gap-1.5 mt-1">
                            {order.isVIP && <Tag type="vip" />}
                            {order.isRepeat && <Tag type="repeat" />}
                          </div>
                        </div>
                      </div>
                      <InfoGrid
                        items={[
                          { icon: Phone, label: "Phone", value: order.customer.phone },
                          { icon: Mail, label: "Email", value: order.customer.email },
                          { icon: MapPin, label: "Address", value: `${order.customer.address}, ${order.customer.district}` },
                        ]}
                      />
                      {order.customer.note && (
                        <div className="mt-3.5 p-3 bg-amber-400/10 rounded-xl border border-amber-400/20 flex items-start gap-2">
                          <AlertCircle size={16} className="text-amber-300 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-300 mb-0.5">Customer Note</p>
                            <p className="text-xs text-amber-200/80">{order.customer.note}</p>
                          </div>
                        </div>
                      )}
                    </SectionCard>

                    {/* Products */}
                    <SectionCard title={`Ordered Products (${order.products.length})`} icon={Package}>
                      {order.products.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3.5 p-3.5 bg-white/5 border border-white/10 rounded-xl mb-2.5"
                        >
                          <img
                            src={p.image}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white mb-1">{p.name}</p>
                            <p className="text-[11px] text-purple-300 mb-2">SKU: {p.sku}</p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-purple-200 bg-white/10 px-2.5 py-0.5 rounded-md font-medium">
                                {p.variation}
                              </span>
                              <span className="text-xs text-purple-200">
                                Qty: <strong className="text-white">{p.qty}</strong>
                              </span>
                              <span className="text-xs text-purple-200">
                                Unit: <strong className="text-white">৳ {p.price}</strong>
                              </span>
                              <span className="text-[13px] font-bold text-orange-300">
                                Total: ৳ {p.price * p.qty}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </SectionCard>

                    {/* Pricing Summary */}
                    <SectionCard title="Pricing Summary" icon={Wallet}>
                      <div className="space-y-2.5">
                        <PriceRow label="Subtotal" value={order.subtotal} />
                        <PriceRow label="Shipping Charge" value={order.shipping} />
                        {order.coupon > 0 && <PriceRow label="Coupon Discount" value={-order.coupon} color="text-emerald-300" />}
                        {order.flashDiscount > 0 && <PriceRow label="Flash Sale Discount" value={-order.flashDiscount} color="text-emerald-300" />}
                        {order.walletUsed > 0 && <PriceRow label="Wallet Used" value={-order.walletUsed} color="text-blue-300" />}
                        <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-white/10 mt-1">
                          <span className="text-[15px] font-bold text-white">Grand Total</span>
                          <span className="text-[22px] font-extrabold text-orange-300">৳ {grandTotal}</span>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Payment Info */}
                    <SectionCard title="Payment Information" icon={CreditCard}>
                      <InfoGrid
                        items={[
                          { icon: CreditCard, label: "Payment Method", value: <PaymentBadge method={order.paymentMethod} /> },
                          { icon: CheckCircle, label: "Payment Status", value: <StatusBadge status={order.paymentStatus} /> },
                        ]}
                      />
                      {order.transactionId && (
                        <div className="mt-3 p-3 bg-emerald-400/10 rounded-xl border border-emerald-400/20 flex items-center gap-2.5">
                          <CheckCircle size={16} className="text-emerald-300 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-emerald-300">Transaction ID</p>
                            <p className="text-[13px] font-mono font-semibold text-emerald-200">{order.transactionId}</p>
                          </div>
                        </div>
                      )}
                    </SectionCard>

                    {/* Delivery Info */}
                    <SectionCard title="Delivery Information" icon={Truck}>
                      <InfoGrid
                        items={[
                          { icon: Truck, label: "Courier Service", value: order.courier || "Not Assigned" },
                          { icon: MapPin, label: "Tracking ID", value: order.trackingId || "Not Available" },
                          { icon: Clock, label: "Delivery Status", value: <StatusBadge status={order.deliveryStatus} /> },
                        ]}
                      />
                    </SectionCard>

                    {/* Fraud Check Info */}
                    <SectionCard title="Fraud Check" icon={ShieldCheck}>
                      <div
                        className={`flex items-center gap-4 p-4 rounded-xl ${
                          order.isFraudulent
                            ? "bg-rose-400/10 border border-rose-400/20"
                            : order.fraudScore > 50
                            ? "bg-amber-400/10 border border-amber-400/20"
                            : "bg-emerald-400/10 border border-emerald-400/20"
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center ${
                            order.isFraudulent
                              ? "bg-rose-400"
                              : order.fraudScore > 50
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                        >
                          {order.isFraudulent ? (
                            <ShieldAlert size={28} className="text-white" />
                          ) : (
                            <ShieldCheck size={28} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-base font-bold ${
                              order.isFraudulent
                                ? "text-rose-300"
                                : order.fraudScore > 50
                                ? "text-amber-300"
                                : "text-emerald-300"
                            }`}
                          >
                            {order.isFraudulent ? "High Risk Order" : order.fraudScore > 50 ? "Medium Risk" : "Low Risk"}
                          </p>
                          <p className="text-[13px] text-purple-300 mt-0.5">
                            Fraud Score: <strong className="text-white">{order.fraudScore}/100</strong>
                          </p>
                        </div>
                        <FraudBadge score={order.fraudScore} isFraudulent={order.isFraudulent} />
                      </div>
                    </SectionCard>

                    {/* Admin Actions */}
                    <SectionCard title="Admin Actions" icon={Settings}>
                      <div className="space-y-3.5">
                        <div>
                          <label className="text-xs font-semibold text-purple-200 mb-1.5 block">Update Order Status</label>
                          <select
                            value={statusUpdate}
                            onChange={(e) => setStatusUpdate(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all"
                          >
                            {orderStatuses
                              .filter((s) => s !== "All Status")
                              .map((s) => (
                                <option key={s} value={s} className="text-black">
                                  {s}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-purple-200 mb-1.5 block">Admin Note</label>
                          <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Add a note about this order..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-purple-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all min-h-20 resize-y"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <ActionButton icon={Printer} label="Print Invoice" variant="outline" onClick={handlePrint} />
                          <ActionButton icon={Download} label="Download" variant="outline" onClick={handlePrint} />
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          <ActionButton
                            icon={RotateCcw}
                            label="Refund"
                            variant="danger"
                            onClick={handleSaveOrder}
                            disabled={saving}
                          />
                          <ActionButton icon={Send} label="Send SMS" variant="info" onClick={handleSendSms} disabled={saving} />
                          <ActionButton
                            icon={CheckCircle}
                            label={saving ? "Saving…" : "Save"}
                            variant="primary"
                            onClick={handleSaveOrder}
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </SectionCard>
                  </>
                )}

                {activeTab === "invoice" && <InvoicePreview order={order} grandTotal={grandTotal} />}

                {activeTab === "timeline" && (
                  <div>
                    <OrderTimeline currentStatus={order.orderStatus} />
                    <div className="mt-5 p-5 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-[13px] font-bold text-white mb-3.5">Status History</h4>
                      {["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].map((status, i) => {
                        const done = i <= orderStatuses.indexOf(order.orderStatus) - 1;
                        return (
                          <div
                            key={status}
                            className={`flex items-center gap-3 py-2.5 ${i < 5 ? "border-b border-white/10" : ""} ${done ? "opacity-100" : "opacity-30"}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${done ? "bg-orange-300" : "bg-white/20"}`} />
                            <span className="text-[13px] font-semibold text-white flex-1">{status}</span>
                            <span className="text-[11px] text-purple-300">{done ? "2026-05-14 10:30 AM" : "--"}</span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-2000 flex items-center justify-center p-4">
          <div className="bg-[#5A2350] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Truck size={20} className="text-orange-300" />
              Assign Courier
            </h3>
            <div className="space-y-2">
              {courierServices.map((courier) => {
                const label = typeof courier === "string" ? courier : courier.name;
                const slug = typeof courier === "string" ? courier : courier.slug;
                const isCurrent = order.courier === label || order.courier === courier?.fullName;
                return (
                <button
                  key={slug || label}
                  type="button"
                  disabled={saving}
                  onClick={() => handleCourierAssign(courier)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all disabled:opacity-60 ${
                    isCurrent
                      ? "bg-orange-300/10 border-orange-300/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isCurrent ? "bg-orange-300" : "bg-white/10"
                    }`}
                  >
                    <Truck size={16} className={isCurrent ? "text-[#4A1942]" : "text-purple-300"} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    {courier?.hasCredentials === false && (
                      <p className="text-[10px] text-amber-300">Add API keys in Courier Settings</p>
                    )}
                    {isCurrent && <p className="text-[11px] text-orange-300">Currently Assigned</p>}
                  </div>
                  {isCurrent && <CheckCircle size={18} className="text-emerald-300" />}
                </button>
              );
              })}
            </div>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowCourierModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fraud Check Modal */}
      {showFraudModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-2000 flex items-center justify-center p-4">
          <div className="bg-[#5A2350] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert size={20} className={order.isFraudulent ? "text-rose-300" : "text-amber-300"} />
              Fraud Check
            </h3>
            <p className="text-xs text-purple-300 mb-5">Review the fraud risk assessment for this order.</p>

            <div className="space-y-3 mb-5">
              <div
                className={`p-4 rounded-xl border ${
                  order.isFraudulent
                    ? "bg-rose-400/10 border-rose-400/20"
                    : order.fraudScore > 50
                    ? "bg-amber-400/10 border-amber-400/20"
                    : "bg-emerald-400/10 border-emerald-400/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      order.isFraudulent
                        ? "bg-rose-400"
                        : order.fraudScore > 50
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  >
                    {order.isFraudulent ? (
                      <ShieldAlert size={24} className="text-white" />
                    ) : order.fraudScore > 50 ? (
                      <Flag size={24} className="text-white" />
                    ) : (
                      <ShieldCheck size={24} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-lg font-extrabold ${
                        order.isFraudulent ? "text-rose-300" : order.fraudScore > 50 ? "text-amber-300" : "text-emerald-300"
                      }`}
                    >
                      {order.fraudScore}%
                    </p>
                    <p className="text-xs text-purple-300">Fraud Risk Score</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-[11px] text-purple-300">IP Address</p>
                  <p className="text-[13px] font-semibold text-white">{order.fraudMeta?.ipAddress || "—"}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-[11px] text-purple-300">Device</p>
                  <p className="text-[13px] font-semibold text-white">{order.fraudMeta?.device || "—"}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              {!order.isFraudulent ? (
                <button
                  onClick={() => handleFraudCheck("flag")}
                  className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-rose-300 to-rose-400 text-[#4A1942] font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5"
                >
                  <Flag size={14} />
                  Flag as Fraud
                </button>
              ) : (
                <button
                  onClick={() => handleFraudCheck("clear")}
                  className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-emerald-300 to-emerald-400 text-[#4A1942] font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={14} />
                  Clear Fraud
                </button>
              )}
              <button
                onClick={() => setShowFraudModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-purple-200 font-semibold hover:bg-white/20 transition-colors border border-white/10"
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
  <div className="bg-white/5 rounded-2xl p-5 mb-5 border border-white/10">
    <h3 className="text-sm font-bold text-purple-200 mb-4 flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-orange-300/20 flex items-center justify-center">
        <Icon size={15} className="text-orange-300" />
      </div>
      {title}
    </h3>
    {children}
  </div>
);

const InfoGrid = ({ items }) => (
  <div className="grid gap-2.5">
    {items.map((item, i) => {
      const Icon = item.icon;
      return (
        <div key={i} className="flex items-start gap-2.5">
          <Icon size={14} className="text-purple-300 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="text-[11px] text-purple-300 block mb-0.5">{item.label}</span>
            <span className="text-[13px] text-purple-100 font-medium">{item.value}</span>
          </div>
        </div>
      );
    })}
  </div>
);

const PriceRow = ({ label, value, color }) => (
  <div className="flex justify-between text-[13px]">
    <span className="text-purple-300">{label}</span>
    <span className={`font-semibold ${color || "text-white"}`}>
      {color && value < 0 ? "" : "৳ "}
      {Math.abs(value)}
    </span>
  </div>
);

const ActionButton = ({ icon: Icon, label, variant, onClick, disabled }) => {
  const variants = {
    primary: "bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] shadow-lg shadow-orange-500/20",
    outline: "bg-white/10 text-purple-200 border border-white/10 hover:bg-white/20",
    danger: "bg-linear-to-r from-rose-300 to-rose-400 text-[#4A1942] shadow-lg shadow-rose-500/20",
    info: "bg-linear-to-r from-blue-300 to-blue-400 text-[#4A1942] shadow-lg shadow-blue-500/20",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 ${variants[variant]}`}
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-extrabold text-orange-300 mb-1 tracking-tight">HBC ACHAR</h1>
        <p className="text-xs text-purple-300">Premium Homemade Pickles & Spices</p>
      </div>

      <div className="flex justify-between mb-7 pb-5 border-b-2 border-white/10">
        <div>
          <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1.5">Bill To</p>
          <p className="text-[15px] font-bold text-white mb-1">{order.customer.name}</p>
          <p className="text-xs text-purple-300 leading-relaxed">{order.customer.address}</p>
          <p className="text-xs text-purple-300">{order.customer.district}</p>
          <p className="text-xs text-purple-300">{order.customer.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1.5">Invoice</p>
          <p className="text-xl font-extrabold text-white mb-1">#{order.id}</p>
          <p className="text-xs text-purple-300">Date: {order.orderDate}</p>
          <p className="text-xs text-purple-300">Status: {order.orderStatus}</p>
          <p className="text-xs text-purple-300">Payment: {order.paymentMethod}</p>
        </div>
      </div>

      <table className="w-full border-collapse mb-7">
        <thead>
          <tr className="border-b-2 border-white/10">
            <th className="text-left py-2.5 text-[11px] font-bold text-purple-200 uppercase">Item</th>
            <th className="text-center py-2.5 text-[11px] font-bold text-purple-200 uppercase">Qty</th>
            <th className="text-right py-2.5 text-[11px] font-bold text-purple-200 uppercase">Price</th>
            <th className="text-right py-2.5 text-[11px] font-bold text-purple-200 uppercase">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="py-3">
                <p className="text-[13px] font-semibold text-white">{p.name}</p>
                <p className="text-[11px] text-purple-300">SKU: {p.sku} | {p.variation}</p>
              </td>
              <td className="text-center py-3 text-[13px] text-purple-200">{p.qty}</td>
              <td className="text-right py-3 text-[13px] text-purple-200">৳ {p.price}</td>
              <td className="text-right py-3 text-[13px] font-bold text-white">৳ {p.price * p.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t-2 border-dashed border-white/10 pt-5">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <PriceRow label="Subtotal" value={subtotal} />
            <PriceRow label="Shipping" value={order.shipping} />
            {order.coupon > 0 && <PriceRow label="Coupon Discount" value={-order.coupon} color="text-emerald-300" />}
            {order.flashDiscount > 0 && <PriceRow label="Flash Sale Discount" value={-order.flashDiscount} color="text-emerald-300" />}
            {order.walletUsed > 0 && <PriceRow label="Wallet Used" value={-order.walletUsed} color="text-blue-300" />}
            <div className="flex justify-between pt-3 border-t-2 border-dashed border-white/10 mt-2">
              <span className="text-[15px] font-bold text-white">Grand Total</span>
              <span className="text-xl font-extrabold text-orange-300">৳ {grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-9 text-center pt-5 border-t border-white/10">
        <p className="text-xs text-purple-300">Thank you for your order!</p>
        <p className="text-[11px] text-purple-400 mt-1">HBC Achar | support@hbcachar.com | +880 1234-567890</p>
      </div>
    </div>
  );
};

/* ────────────────────────────────
   ROW ACTION DROPDOWN
   ──────────────────────────────── */
const RowActionMenu = ({ order, onView, onAssignCourier, onFraudCheck, onMarkDelivered, onCancel, onDelete, onSms, onPrint }) => {
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
    { icon: Eye, label: "View Order", onClick: () => { onView(); setOpen(false); } },
    { icon: Truck, label: "Assign Courier", onClick: () => { onAssignCourier?.(order); setOpen(false); } },
    { icon: ScanLine, label: "Fraud Check", onClick: () => { onFraudCheck?.(order); setOpen(false); } },
    { icon: Printer, label: "Print Invoice", onClick: () => { onPrint?.(order); setOpen(false); } },
    { icon: Send, label: "Send SMS", onClick: () => { onSms?.(order); setOpen(false); } },
    { icon: CheckCircle, label: "Mark Delivered", onClick: () => { onMarkDelivered?.(order); setOpen(false); } },
    { icon: Ban, label: "Cancel Order", onClick: () => { onCancel?.(order); setOpen(false); }, danger: true },
    { icon: Trash2, label: "Delete Order", onClick: () => { onDelete?.(order); setOpen(false); }, danger: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-purple-300 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute top-9 right-0 w-48 bg-[#5A2350] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <button
                key={i}
                onClick={a.onClick}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors ${
                  a.danger ? "text-rose-300 hover:bg-rose-400/10" : "text-purple-200 hover:bg-white/10"
                }`}
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

/* ────────────────────────────────
   MAIN ORDERS COMPONENT
   ──────────────────────────────── */
export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [courierServices, setCourierServices] = useState(DEFAULT_COURIER_SERVICES);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
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
  const [filteredOrders, setFilteredOrders] = useState([]);

  const fetchOrders = async (page = 1, filterOverrides = {}) => {
    setLoading(true);
    try {
      const params = { page, limit: 20, ...filters, ...filterOverrides };
      const { data } = await api.get("/admin/orders", { params });
      setFilteredOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Please log in as admin again."
          : err.response?.data?.message || "Failed to load orders.";
      toast.error(msg);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourierNames = async () => {
    try {
      const { data } = await api.get("/admin/couriers/active-names");
      if (data.couriers?.length) setCourierServices(data.couriers);
    } catch {
      /* keep defaults */
    }
  };

  useEffect(() => {
    fetchOrders(1);
    fetchCourierNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setSelectedOrders([]);
    fetchOrders(1);
  };

  const handleResetFilters = () => {
    const reset = {
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
    };
    setFilters(reset);
    setSelectedOrders([]);
    fetchOrders(1, reset);
  };

  const handleOrderUpdated = (updated) => {
    if (!updated) return;
    setFilteredOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    setViewingOrder(updated);
  };

  const updateOrderStatus = async (order, status) => {
    try {
      const { data } = await api.patch(`/admin/orders/${order._id}`, { orderStatus: status });
      toast.success(data.message || "Order updated");
      handleOrderUpdated(data.order);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleBulkStatus = async (status) => {
    if (!selectedOrders.length) return;
    try {
      const { data } = await api.patch("/admin/orders/bulk/status", {
        orderIds: selectedOrders,
        status,
      });
      toast.success(data.message);
      setSelectedOrders([]);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk update failed");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedOrders.length) return;
    if (!window.confirm(`Delete ${selectedOrders.length} order(s)?`)) return;
    try {
      const { data } = await api.delete("/admin/orders/bulk", { data: { orderIds: selectedOrders } });
      toast.success(data.message);
      setSelectedOrders([]);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk delete failed");
    }
  };

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Delete order ${order.id}?`)) return;
    try {
      await api.delete(`/admin/orders/${order._id}`);
      toast.success("Order deleted");
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSendSms = async (order) => {
    try {
      const { data } = await api.post(`/admin/orders/${order._id}/sms`);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "SMS failed");
    }
  };

  const handleExportCsv = () => {
    const orders = filteredOrders.filter((o) => selectedOrders.includes(o._id));
    if (!orders.length) {
      toast.warn("Please select at least one order to export");
      return;
    }
    exportOrdersToCsv(orders);
    toast.success(`${orders.length} order(s) exported to CSV`);
  };

  const handlePrintInvoice = (order) => {
    if (!order) return;
    openAdminInvoice(order, { print: true });
  };

  const handleBulkPrint = () => {
    const orders = filteredOrders.filter((o) => selectedOrders.includes(o._id));
    if (!orders.length) {
      toast.warn("Please select at least one order to print");
      return;
    }
    orders.forEach((o, i) => {
      setTimeout(() => openAdminInvoice(o, { print: true }), i * 900);
    });
  };

  const allSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;
  const toggleAll = () => {
    if (allSelected) setSelectedOrders([]);
    else setSelectedOrders(filteredOrders.map((o) => o._id));
  };
  const toggleOne = (id) => {
    const key = filteredOrders.find((o) => o.id === id || o._id === id)?._id || id;
    if (selectedOrders.includes(key))
      setSelectedOrders(selectedOrders.filter((i) => i !== key));
    else setSelectedOrders([...selectedOrders, key]);
  };

  const inputBase = "w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-purple-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 outline-none transition-all";
  const selectBase = `${inputBase} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23C4B5FD' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_10px_center] pr-8`;

  return (
    <div className="min-h-screen bg-[#4A1942] font-sans">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInRight {
          animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(0.8);
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div className="sticky top-0 z-30 bg-[#4A1942]/80 backdrop-blur-md border-b border-white/10 px-6 md:px-8 py-5">
        <div className="max-w-350 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Orders Management</h1>
            <p className="text-sm text-purple-200 mt-1">Manage, track, and process all customer orders</p>
          </div>
          
        </div>
      </div>

      <main className="px-6 md:px-8 py-6 max-w-350 mx-auto space-y-5">
        {/* ── MINIMAL COLLAPSIBLE FILTERS ── */}
        {loading ? (
          <SkeletonFilters />
        ) : (
          <div className="space-y-3">
            {/* Filter Toggle Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    mobileFiltersOpen
                      ? "bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] shadow-lg shadow-orange-500/20"
                      : "bg-white/10 text-purple-200 border border-white/10 hover:bg-white/20"
                  }`}
                >
                  <Filter size={16} />
                  Filters
                  {mobileFiltersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {/* Active Filter Chips */}
                <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-purple-200">
                      Search: {filters.search}
                      <button onClick={() => { setFilters({...filters, search: ""}); }} className="hover:text-white"><X size={10} /></button>
                    </span>
                  )}
                  {filters.status !== "All Status" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-purple-200">
                      Status: {filters.status}
                      <button onClick={() => { setFilters({...filters, status: "All Status"}); }} className="hover:text-white"><X size={10} /></button>
                    </span>
                  )}
                  {filters.paymentStatus !== "All Payment" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-purple-200">
                      Pay: {filters.paymentStatus}
                      <button onClick={() => { setFilters({...filters, paymentStatus: "All Payment"}); }} className="hover:text-white"><X size={10} /></button>
                    </span>
                  )}
                  {filters.paymentMethod !== "All Methods" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-purple-200">
                      Method: {filters.paymentMethod}
                      <button onClick={() => { setFilters({...filters, paymentMethod: "All Methods"}); }} className="hover:text-white"><X size={10} /></button>
                    </span>
                  )}
                  {filters.district !== "All Districts" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-purple-200">
                      District: {filters.district}
                      <button onClick={() => { setFilters({...filters, district: "All Districts"}); }} className="hover:text-white"><X size={10} /></button>
                    </span>
                  )}
                  {filters.flashSale !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-purple-200">
                      Flash: {filters.flashSale}
                      <button onClick={() => { setFilters({...filters, flashSale: "all"}); }} className="hover:text-white"><X size={10} /></button>
                    </span>
                  )}
                  {filters.landingPage !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-purple-200">
                      Landing: {filters.landingPage}
                      <button onClick={() => { setFilters({...filters, landingPage: "all"}); }} className="hover:text-white"><X size={10} /></button>
                    </span>
                  )}
                  {(filters.search || filters.status !== "All Status" || filters.paymentStatus !== "All Payment" || filters.paymentMethod !== "All Methods" || filters.district !== "All Districts" || filters.flashSale !== "all" || filters.landingPage !== "all") && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] text-orange-300 font-semibold hover:text-orange-200 transition-colors ml-1"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <span className="text-xs text-purple-300 font-medium">
                {filteredOrders.length} orders found
              </span>
            </div>

            {/* Collapsible Filter Panel */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                mobileFiltersOpen ? "max-h-200 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <GlassCard className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5">Search</label>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className={`${inputBase} pl-9`}
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5">Order ID</label>
                    <input
                      type="text"
                      placeholder="HBC-240514-xxx"
                      className={inputBase}
                      value={filters.orderId}
                      onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5">Customer Phone</label>
                    <input
                      type="text"
                      placeholder="01xxxxxxxxx"
                      className={inputBase}
                      value={filters.phone}
                      onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="">
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5">Order Status</label>
                    <select className={`${selectBase}`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                      {orderStatuses.map((s) => (
                        <option key={s} value={s} className="bg-[#4A1942]/80">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5">Delivery Status</label>
                    <select className={selectBase} value={filters.deliveryStatus} onChange={(e) => setFilters({ ...filters, deliveryStatus: e.target.value })}>
                      {deliveryStatuses.map((s) => (
                        <option key={s} value={s} className="bg-[#4A1942]/80">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5">Payment Status</label>
                    <select className={selectBase} value={filters.paymentStatus} onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}>
                      {paymentStatuses.map((s) => (
                        <option key={s} value={s} className="bg-[#4A1942]/80">{s}</option>
                      ))}
                    </select>
                  </div>
                  
                </div>

                <div className="flex gap-2.5 mt-4 justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-purple-200 text-xs font-semibold hover:bg-white/20 transition-colors border border-white/10"
                  >
                    <RefreshCw size={14} />
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] text-xs font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Filter size={14} />
                    Apply Filters
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── BULK ACTION TOOLBAR ── */}
        {selectedOrders.length > 0 && (
          <div className="px-5 py-3 bg-orange-300/10 rounded-2xl border border-orange-300/20 flex items-center gap-3 flex-wrap">
            <span className="text-[13px] font-bold text-white">{selectedOrders.length} selected</span>
            <div className="w-px h-5 bg-orange-300/30" />
            {[
              { icon: CheckCircle, label: "Confirm", color: "text-emerald-300 bg-emerald-300/10 hover:bg-emerald-300/20" },
              { icon: Play, label: "Processing", color: "text-orange-300 bg-orange-300/10 hover:bg-orange-300/20" },
              { icon: Truck, label: "Shipped", color: "text-blue-300 bg-blue-300/10 hover:bg-blue-300/20" },
              { icon: CheckCircle, label: "Delivered", color: "text-emerald-300 bg-emerald-300/10 hover:bg-emerald-300/20" },
              { icon: Ban, label: "Cancel", color: "text-rose-300 bg-rose-300/10 hover:bg-rose-300/20" },
              { icon: Trash2, label: "Delete", color: "text-rose-300 bg-rose-300/10 hover:bg-rose-300/20" },
              { icon: Printer, label: "Print", color: "text-purple-200 bg-white/5 hover:bg-white/10" },
              { icon: Download, label: "Export", color: "text-purple-200 bg-white/5 hover:bg-white/10" },
            ].map((a, i) => {
              const Icon = a.icon;
              const onBulk =
                a.label === "Confirm"
                  ? () => handleBulkStatus("Confirmed")
                  : a.label === "Processing"
                  ? () => handleBulkStatus("Processing")
                  : a.label === "Shipped"
                  ? () => handleBulkStatus("Shipped")
                  : a.label === "Delivered"
                  ? () => handleBulkStatus("Delivered")
                  : a.label === "Cancel"
                  ? () => handleBulkStatus("Cancelled")
                  : a.label === "Delete"
                  ? handleBulkDelete
                  : a.label === "Print"
                  ? handleBulkPrint
                  : a.label === "Export"
                  ? handleExportCsv
                  : undefined;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={onBulk}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:-translate-y-px ${a.color}`}
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
          <GlassCard className="overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-300">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-4 py-3.5 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="w-4 h-4 cursor-pointer accent-orange-300"
                      />
                    </th>
                    {["Order ID", "Customer", "Products", "Total", "Payment", "Pay Status", "Order Status", "Fraud", "Source", "Date", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr
                      key={order.id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${idx % 2 === 0 ? "bg-transparent" : "bg-white/2"}`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleOne(order._id)}
                          className="w-4 h-4 cursor-pointer accent-orange-300"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-bold text-white font-mono">{order.id}</span>
                          <div className="flex gap-1 flex-wrap">
                            {order.isFlashSale && <Tag type="flash" />}
                            {order.isLandingPage && <Tag type="landing" />}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={order.customer.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-[13px] font-semibold text-white">{order.customer.name}</p>
                            <p className="text-[11px] text-purple-300">{order.customer.phone}</p>
                            <div className="flex gap-1 mt-0.5">
                              {order.isVIP && <Tag type="vip" />}
                              {order.isRepeat && <Tag type="repeat" />}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {order.products.slice(0, 3).map((p, i) => (
                              <img
                                key={i}
                                src={p.image}
                                alt=""
                                className="w-7.5 h-7.5 rounded-md object-cover border-2 border-[#4A1942]"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-purple-300">
                            {order.products.length > 1 ? `+${order.products.length - 1} more` : "1 item"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-orange-300">৳ {order.total}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <PaymentBadge method={order.paymentMethod} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-4 py-3.5">
                        <FraudBadge score={order.fraudScore} isFraudulent={order.isFraudulent} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-purple-300 font-medium">{order.source}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-purple-300">{order.orderDate}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <RowActionMenu
                          order={order}
                          onView={() => handleViewOrder(order)}
                          onAssignCourier={() => handleViewOrder(order)}
                          onFraudCheck={() => handleViewOrder(order)}
                          onMarkDelivered={() => updateOrderStatus(order, "Delivered")}
                          onCancel={() => updateOrderStatus(order, "Cancelled")}
                          onDelete={() => handleDeleteOrder(order)}
                          onSms={() => handleSendSms(order)}
                          onPrint={handlePrintInvoice}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-purple-300">
                Showing {filteredOrders.length} of {pagination.total} entries
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchOrders(pagination.page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-purple-300 text-xs hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-3 py-1.5 text-xs text-purple-200">
                  Page {pagination.page} / {pagination.pages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchOrders(pagination.page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-purple-300 text-xs hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ── MOBILE TABLE CARDS ── */}
        {!loading && (
          <div className="md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <EmptyState type="search" />
            ) : (
              filteredOrders.map((order) => (
                <GlassCard key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[13px] font-bold text-white font-mono">{order.id}</span>
                      <div className="flex gap-1 mt-1">
                        {order.isFlashSale && <Tag type="flash" />}
                        {order.isLandingPage && <Tag type="landing" />}
                      </div>
                    </div>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <img src={order.customer.avatar} alt="" className="w-9 h-9 rounded-full" />
                    <div>
                      <p className="text-[13px] font-semibold text-white">{order.customer.name}</p>
                      <p className="text-[11px] text-purple-300">{order.customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs text-purple-300">{order.products.length} items · {order.source}</span>
                    <span className="text-base font-bold text-orange-300">৳ {order.total}</span>
                  </div>
                  <div className="flex gap-1.5 mb-3">
                    <PaymentBadge method={order.paymentMethod} />
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="flex-1 py-2 rounded-lg bg-linear-to-r from-orange-300 to-orange-400 text-[#4A1942] text-xs font-bold shadow-lg shadow-orange-500/20"
                    >
                      View Order
                    </button>
                    <button className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-purple-300">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* Empty state for desktop */}
        {!loading && filteredOrders.length === 0 && (
          <div className="hidden md:block">
            <EmptyState type="search" />
          </div>
        )}
      </main>

      {/* ── ORDER DETAILS DRAWER ── */}
      <OrderDetailsDrawer
        order={viewingOrder}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        courierServices={courierServices}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}
