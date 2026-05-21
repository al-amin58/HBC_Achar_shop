// InvoicePage.jsx
import { useRef, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { mapAdminOrderToInvoiceOrder } from '../../utils/invoiceHelpers';

const formatBnDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

const paymentMethodLabel = (m, t) =>
  t(`invoice.paymentMethods.${m}`, { defaultValue: m });

const paymentStatusLabel = (s, t) =>
  t(`invoice.paymentStatus.${s}`, { defaultValue: s });

// Helper to render logo - image or emoji
const LogoDisplay = ({ logo, className = '' }) => {
  const isImage = logo && (logo.startsWith('http') || logo.startsWith('data:') || logo.startsWith('/'));
  if (isImage) {
    return <img src={logo} alt="Logo" className={className} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.classList?.remove('hidden'); }} />;
  }
  return <span className={className}>{logo || '🫙'}</span>;
};

const buildInvoiceView = (order, settings, t) => ({
  invoiceNo: `INV-${order.orderNumber}`,
  orderId: order.orderNumber,
  issueDate: formatBnDate(order.createdAt),
  dueDate: formatBnDate(order.createdAt),
  monthlySubscription: order.monthlySubscription,
  business: {
    name: settings?.siteName || 'HBC Achar Shop',
    nameEn: settings?.siteTitle || '',
    address: settings?.storeAddress || '',
    phone: settings?.supportPhone || '',
    email: settings?.email || '',
    website: settings?.website || '',
    logo: settings?.logoPreview || '🫙',
    footer: settings?.invoiceFooter || '',
  },
  customer: {
    name: order.customer?.fullName || '',
    phone: order.customer?.phone || '',
    email: order.customer?.email || '',
    address: order.customer?.address || '',
    district: order.customer?.district || '',
    thana: order.customer?.thana || '',
    postcode: '',
  },
  shipping: {
    method: t('invoice.homeDelivery'),
    charge: order.pricing?.deliveryCharge || 0,
    address: order.shipping?.fullAddress || order.customer?.address || '',
    note: order.orderNote || '',
  },
  items: (order.items || []).map((it) => ({
    id: it.id,
    name: it.name,
    variation: it.variation || it.variationLabel || '',
    sku: it.productId?.slice(-6) || '',
    price: it.price,
    qty: it.qty,
    total: it.total || it.price * it.qty,
  })),
  pricing: {
    subtotal: order.pricing?.subtotal || 0,
    discount: order.pricing?.discount || 0,
    coupon: order.pricing?.couponCode || '',
    delivery: order.pricing?.deliveryCharge || 0,
    walletUsed: order.pricing?.walletUsed || 0,
    total: order.pricing?.total || 0,
    totalInWords: `৳${order.pricing?.total || 0}`,
  },
  payment: {
    method: paymentMethodLabel(order.payment?.method, t),
    status: paymentStatusLabel(order.payment?.status, t),
    paid: order.payment?.paid || 0,
    due: order.payment?.due ?? order.pricing?.total,
  },
});

export default function InvoicePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = searchParams.get('id');
  const isAdmin = searchParams.get('admin') === '1';
  const autoprint = searchParams.get('print') === '1';

  // Handle missing orderId without setState in effect
  const initialError = !orderId ? t('invoice.noOrderId') : '';

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;
    const load = async () => {
      try {
        const settingsRes = await api.get('/settings/public');
        let orderPayload;

        if (isAdmin) {
          const orderRes = await api.get(`/admin/orders/${orderId}`);
          orderPayload = mapAdminOrderToInvoiceOrder(orderRes.data.order);
        } else {
          const orderRes = await api.get(`/orders/${orderId}`);
          orderPayload = orderRes.data;
        }

        if (!cancelled) {
          setInvoiceData(buildInvoiceView(orderPayload, settingsRes.data, t));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || t('invoice.loadFailed'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [orderId, isAdmin, t]);

  useEffect(() => {
    if (!autoprint || !invoiceData || loading) return;
    const timer = setTimeout(() => window.print(), 700);
    return () => clearTimeout(timer);
  }, [autoprint, invoiceData, loading]);

  // Use initial error state when orderId is missing
  const displayError = initialError || error;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // Show error immediately if orderId is missing, otherwise show loading
  if (displayError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-600">{displayError}</p>
        <button type="button" onClick={() => navigate('/')} className="text-orange-600 font-bold">
          {t('invoice.backHome')}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-700">
        {t('invoice.loading')}
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-600">{displayError || t('invoice.noData')}</p>
        <button type="button" onClick={() => navigate('/')} className="text-orange-600 font-bold">
          {t('invoice.backHome')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-green-50 print:bg-white">
      
      {/* Toolbar - Hidden when printing */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-green-400 flex items-center justify-center text-white font-bold overflow-hidden">
              <LogoDisplay logo={invoiceData.business.logo} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">{invoiceData.business.name}</h1>
              <p className="text-xs text-gray-500">{t('invoice.title')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => window.close()}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕ বন্ধ করুন
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/thank-you')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← পেছনে
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-all text-sm font-medium shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              প্রিন্ট
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all text-sm font-medium shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              পিডিএফ
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Paper */}
      <div className="max-w-4xl mx-auto px-4 py-8 print:p-0">
        <div 
          ref={invoiceRef}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 print:shadow-none print:border-0 print:rounded-none overflow-hidden"
        >
          
          {/* Invoice Header */}
          <div className="relative">
            {/* Top Gradient Bar */}
            <div className="h-3 bg-linear-to-r from-orange-400 via-amber-400 to-green-400" />
            
            <div className="p-8 pb-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Business Info */}
                <div className="flex gap-4">
                  <div className="w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden">
                    <LogoDisplay logo={invoiceData.business.logo} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{invoiceData.business.name}</h2>
                    <p className="text-sm text-gray-500">{invoiceData.business.nameEn}</p>
                    <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                      <p>📍 {invoiceData.business.address}</p>
                      <p>📞 {invoiceData.business.phone}</p>
                      <p>✉️ {invoiceData.business.email}</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Meta */}
                <div className="md:text-right space-y-2">
                  <div className="inline-block bg-linear-to-r from-orange-50 to-green-50 border border-orange-200 rounded-xl px-4 py-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">ইনভয়েস নম্বর</p>
                    <p className="text-lg font-bold text-gray-800 font-mono">{invoiceData.invoiceNo}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">ইস্যু তারিখ:</span>
                      <span className="ml-2 font-medium text-gray-800">{invoiceData.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ডিউ তারিখ:</span>
                      <span className="ml-2 font-medium text-gray-800">{invoiceData.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">অর্ডার নম্বর:</span>
                      <span className="ml-2 font-medium text-orange-600">{invoiceData.orderId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">BIN:</span>
                      <span className="ml-2 font-medium text-gray-800">{invoiceData.business.bin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="px-8 py-6 bg-gray-50/50 border-y border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Bill To */}
            <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm">
              <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-sm">👤</span>
                বিল প্রদানকারী
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-lg font-bold text-gray-800">{invoiceData.customer.name}</p>
                <p className="text-gray-600">{invoiceData.customer.phone}</p>
                <p className="text-gray-500">{invoiceData.customer.email}</p>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {invoiceData.customer.address}<br />
                  {invoiceData.customer.thana}, {invoiceData.customer.district} - {invoiceData.customer.postcode}
                </p>
              </div>
            </div>

            {invoiceData.monthlySubscription && (
              <div className="mx-8 mb-4 p-4 bg-amber-50 border border-amber-300 rounded-xl text-center">
                <p className="text-sm font-bold text-amber-800">প্রতি মাসে কিনতে চাই (Monthly Subscription)</p>
              </div>
            )}

            {/* Ship To */}
            <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm">
              <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center text-sm">🚚</span>
                শিপিং তথ্য
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-gray-800">{invoiceData.shipping.method}</p>
                <p className="text-gray-600 leading-relaxed">{invoiceData.shipping.address}</p>
                {invoiceData.shipping.note && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg text-blue-700 text-xs border border-blue-100">
                    📝 {invoiceData.shipping.note}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-orange-200">
                  <th className="text-left py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="text-left py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">পণ্যের বিবরণ</th>
                  <th className="text-center py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="text-center py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">পরিমাণ</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">দর</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">মোট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-4 px-2 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-4 px-2">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        {item.nameEn ? <p className="text-xs text-gray-500">{item.nameEn}</p> : null}
                        <p className="text-xs text-orange-600 mt-0.5">{item.variation}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center text-sm text-gray-500 font-mono">{item.sku}</td>
                    <td className="py-4 px-2 text-center text-sm font-medium text-gray-800">{item.qty}</td>
                    <td className="py-4 px-2 text-right text-sm text-gray-600">৳{item.price}</td>
                    <td className="py-4 px-2 text-right text-sm font-bold text-gray-800">৳{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Totals */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-end gap-8">
              
              {/* Terms / Notes */}
              <div className="flex-1 max-w-md">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h4 className="font-bold text-amber-800 text-sm mb-2">📋 শর্তাবলী</h4>
                  <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                    <li>পণ্য ডেলিভারির সময় অবশ্যই চেক করে নিন</li>
                    <li>ড্যামেজ পণ্য ডেলিভারি বয়ের কাছে ফেরত দিন</li>
                    <li>COD অর্ডার ৭ দিনের মধ্যে রিটার্নযোগ্য</li>
                    <li>রিটার্ন শর্ত প্রযোজ্য</li>
                  </ul>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-700 text-sm mb-1">💰 মোট টাকা কথায়</h4>
                  <p className="text-lg font-bold text-gray-800">{invoiceData.pricing.totalInWords}</p>
                </div>
              </div>

              {/* Calculation Table */}
              <div className="w-full md:w-80">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">সাবটোটাল</span>
                    <span className="font-medium text-gray-800">৳{invoiceData.pricing.subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ডেলিভারি চার্জ</span>
                    <span className="font-medium text-gray-800">৳{invoiceData.pricing.delivery}</span>
                  </div>

                  {invoiceData.pricing.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        ছাড় ({invoiceData.pricing.coupon})
                      </span>
                      <span className="font-medium text-green-600">-৳{invoiceData.pricing.discount}</span>
                    </div>
                  )}

                  {invoiceData.pricing.walletUsed > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">ওয়ালেট ব্যবহার</span>
                      <span className="font-medium text-green-600">-৳{invoiceData.pricing.walletUsed}</span>
                    </div>
                  )}

                  <div className="border-t-2 border-dashed border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-800">সর্বমোট</span>
                      <span className="text-2xl font-bold bg-linear-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                        ৳{invoiceData.pricing.total}
                      </span>
                    </div>
                  </div>

                  {/* Payment Status Box */}
                  <div className={`mt-3 p-3 rounded-lg border text-center ${
                    invoiceData.payment.status === 'পরিশোধিত' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <p className="text-xs uppercase tracking-wider font-bold mb-1">পেমেন্ট স্ট্যাটাস</p>
                    <p className="text-lg font-bold">{invoiceData.payment.status}</p>
                    <p className="text-xs mt-1">{invoiceData.payment.method}</p>
                  </div>

                  {invoiceData.payment.status !== 'পরিশোধিত' && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">বাকি টাকা</p>
                      <p className="text-lg font-bold text-gray-800">৳{invoiceData.payment.due}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-linear-to-r from-gray-50 to-orange-50 border-t border-gray-100 p-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto   flex items-center justify-center  overflow-hidden">
                <LogoDisplay logo={invoiceData.business.logo} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{invoiceData.business.name} - এ আপনাকে স্বাগতম</p>
                <p className="text-sm text-gray-500 mt-1">স্বাদে ও গুণে অতুলনীয় দেশি আচার</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 pt-2">
                <span>📞 {invoiceData.business.phone}</span>
                <span>•</span>
                <span>✉️ {invoiceData.business.email}</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                {invoiceData.business.footer || 'এই ইনভয়েসটি কম্পিউটার জেনারেটেড, কোনো স্বাক্ষর প্রয়োজন নেই।'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions - Hidden when printing */}
        {!isAdmin && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden pb-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm"
            >
              🏠 হোমপেজ
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-white border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-all font-medium shadow-sm"
            >
              📦 আমার অর্ডার
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-green-500 text-white rounded-xl hover:from-orange-600 hover:to-green-600 transition-all font-medium shadow-md"
            >
              🖨️ প্রিন্ট / পিডিএফ সেভ
            </button>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-0 { border: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:bg-white { background: white !important; }
        }
      `}</style>
    </div>
  );
}