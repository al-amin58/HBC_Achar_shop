// InvoicePage.jsx
import  { useRef } from 'react';
import { useNavigate } from 'react-router';

// Demo Invoice Data
const invoiceData = {
  invoiceNo: 'INV-ACH-2026-8842',
  orderId: 'ACH-2026-8842',
  issueDate: '৬ মে, ২০২৬',
  dueDate: '৮ মে, ২০২৬',
  
  business: {
    name: 'আচার ',
    nameEn: ' Achar ',
    address: '১২৩, পিকচার প্যালেস মার্কেট,, ঢাকা-১২১৬',
    phone: '০১৭১২৩৪৫৬৭৮',
    email: 'support@deshiacharghor.com',
    website: 'www.deshiacharghor.com',
    bin: '০০১২৩৪৫৬৭৮৯০'
  },

  customer: {
    name: 'রাহিম উদ্দিন',
    phone: '০১৭১২৩৪৫৬৭৮',
    email: 'rahim@email.com',
    address: 'বাড়ি #৪২, রোড #৩, মিরপুর-১০',
    district: 'ঢাকা',
    thana: 'মিরপুর',
    postcode: '১২১৬'
  },

  shipping: {
    method: 'ঢাকার ভিতরে',
    charge: 60,
    address: 'বাড়ি #৪২, রোড #৩, মিরপুর-১০, ঢাকা',
    note: 'গেটে রাখবেন, ডেলিভারির আগে কল করবেন'
  },

  items: [
    {
      id: 1,
      name: 'মিষ্টি আমের আচার',
      nameEn: 'Sweet Mango Pickle',
      variation: '৫০০গ্রাম জার',
      sku: 'MNG-500',
      price: 280,
      qty: 2,
      total: 560
    },
    {
      id: 2,
      name: 'তেতুলের আচার',
      nameEn: 'Tamarind Pickle',
      variation: '২৫০গ্রাম জার',
      sku: 'TML-250',
      price: 180,
      qty: 1,
      total: 180
    }
  ],

  pricing: {
    subtotal: 740,
    discount: 74,
    coupon: 'ACHAR10',
    delivery: 60,
    walletUsed: 0,
    total: 726,
    totalInWords: 'সাতশত ছাব্বিশ টাকা মাত্র'
  },

  payment: {
    method: 'ক্যাশ অন ডেলিভারি',
    status: 'অপেক্ষমাণ',
    paid: 0,
    due: 726
  }
};

export default function InvoicePage() {
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In production, use libraries like html2pdf.js or jspdf
    alert('📄 পিডিএফ ডাউনলোড শুরু হচ্ছে...\n(প্রোডাকশনে html2pdf.js বা jspdf ব্যবহার করুন)');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-green-50 print:bg-white">
      
      {/* Toolbar - Hidden when printing */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-green-400 flex items-center justify-center text-white font-bold">
              {invoiceData.business.logo}
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">{invoiceData.business.name}</h1>
              <p className="text-xs text-gray-500">ইনভয়েস</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/thank-you')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← পেছনে
            </button>
            <button
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
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-400 to-green-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {invoiceData.business.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{invoiceData.business.name}</h2>
                    <p className="text-sm text-gray-500">{invoiceData.business.nameEn}</p>
                    <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                      <p>📍 {invoiceData.business.address}</p>
                      <p>📞 {invoiceData.business.phone}</p>
                      <p>✉️ {invoiceData.business.email}</p>
                      <p>🌐 {invoiceData.business.website}</p>
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
                        <p className="text-xs text-gray-500">{item.nameEn}</p>
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
              <div className="w-12 h-12 mx-auto rounded-full bg-linear-to-br from-orange-400 to-green-400 flex items-center justify-center text-white text-xl font-bold">
                {invoiceData.business.logo}
              </div>
              <div>
                <p className="font-bold text-gray-800">{invoiceData.business.name} - এ আপনাকে স্বাগতম</p>
                <p className="text-sm text-gray-500 mt-1">স্বাদে ও গুণে অতুলনীয় দেশি আচার</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 pt-2">
                <span>📞 {invoiceData.business.phone}</span>
                <span>•</span>
                <span>✉️ {invoiceData.business.email}</span>
                <span>•</span>
                <span>🌐 {invoiceData.business.website}</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                এই ইনভয়েসটি কম্পিউটার জেনারেটেড, কোনো স্বাক্ষর প্রয়োজন নেই।
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions - Hidden when printing */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden pb-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm"
          >
            🏠 হোমপেজ
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-white border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-all font-medium shadow-sm"
          >
            📦 আমার অর্ডার
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-linear-to-r from-orange-500 to-green-500 text-white rounded-xl hover:from-orange-600 hover:to-green-600 transition-all font-medium shadow-md"
          >
            🖨️ প্রিন্ট / পিডিএফ সেভ
          </button>
        </div>
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