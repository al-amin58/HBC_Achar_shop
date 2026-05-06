import { useState } from 'react';

const ReturnPolicy = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const policyHighlights = [
    {
      icon: '🔄',
      title: '7 Days Return',
      desc: 'Return any product within 7 days of delivery if unused and in original packaging.'
    },
    {
      icon: '💰',
      title: 'Full Refund',
      desc: 'Get 100% money back within 3-5 business days after we receive the return.'
    },
    {
      icon: '🚚',
      title: 'Free Pickup',
      desc: 'We will pick up the return item from your doorstep at no extra cost.'
    },
    {
      icon: '✅',
      title: 'Easy Process',
      desc: 'Simple 3-step return process. No complicated forms or long waiting.'
    }
  ];

  const returnSteps = [
    {
      step: '01',
      title: 'Request Return',
      desc: 'Go to "My Orders" and click "Return" on the product you want to return. Or call us at 01712-345678.'
    },
    {
      step: '02',
      title: 'Pack the Item',
      desc: 'Keep the product in its original packaging with the invoice. Make sure the seal is not broken.'
    },
    {
      step: '03',
      title: 'Handover / Pickup',
      desc: 'Our delivery partner will pick it up from your address within 24-48 hours.'
    },
    {
      step: '04',
      title: 'Refund Processed',
      desc: 'Once we verify the item, your refund will be sent via bKash/Nagad/Bank within 3-5 working days.'
    }
  ];

  const conditions = [
    { allowed: true, text: 'Product is unused and seal is not broken' },
    { allowed: true, text: 'Original packaging and invoice are available' },
    { allowed: true, text: 'Return request is made within 7 days of delivery' },
    { allowed: true, text: 'Product was damaged during delivery (with photo proof)' },
    { allowed: false, text: 'Product has been opened, used, or partially consumed' },
    { allowed: false, text: 'Return request after 7 days of delivery date' },
    { allowed: false, text: 'Product packaging is heavily damaged by customer' },
    { allowed: false, text: 'Perishable items after the expiry date (check before buying)' },
  ];

  const faqs = [
    {
      q: 'Can I return a pickle jar if I already opened it?',
      a: 'No, for hygiene and food safety reasons, we cannot accept returns of opened or partially consumed food items. Please check the product carefully before opening.'
    },
    {
      q: 'What if my product arrived damaged or leaked?',
      a: 'If your product arrives damaged, leaking, or with a broken seal, please take a clear photo immediately and contact us within 24 hours. We will arrange a free replacement or full refund.'
    },
    {
      q: 'How long does it take to get my refund?',
      a: 'Once we receive and verify the returned item, refunds are processed within 3-5 business days. bKash/Nagad refunds are usually instant after processing.'
    },
    {
      q: 'Do I need to pay for return shipping?',
      a: 'No, return pickup is completely free within Dhaka city. For outside Dhaka, we will guide you on the nearest drop-off point or arrange a pickup.'
    },
    {
      q: 'Can I exchange instead of refund?',
      a: 'Yes! If you want a different size or flavor, you can request an exchange. We will send the new item once we receive your return.'
    },
    {
      q: 'What if I received the wrong product?',
      a: 'If we sent the wrong item by mistake, we take full responsibility. You will get a free replacement + a small gift voucher as an apology!'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans pb-16">
      
      {/* 🏔️ Hero Banner */}
      <div className="bg-linear-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🔄</div>
          <div className="absolute bottom-10 right-10 text-8xl">🛡️</div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-orange-300 text-sm font-bold uppercase tracking-wider mb-3">
              <span className="w-8 h-0.5 bg-orange-400"></span>
              Customer Support
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Return & Refund <span className="text-orange-400">Policy</span>
            </h1>
            <p className="text-emerald-100 text-base md:text-lg leading-relaxed">
              Your satisfaction is our priority. If you are not happy with your purchase, 
              we make returns simple, fast, and hassle-free.
            </p>
          </div>
        </div>
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80V40C240 0 480 0 720 26.7C960 53 1200 80 1440 40V80H0Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </div>

      {/* ⭐ Policy Highlights */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {policyHighlights.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group"
            >
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{item.icon}</span>
              <h3 className="font-bold text-emerald-900 mb-1">{item.title}</h3>
              <p className="text-sm text-emerald-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📋 Return Process Steps */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">How to Return a Product</h2>
          <p className="text-emerald-600">Follow these simple steps to return your order</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-emerald-200 -z-10" />
          
          {returnSteps.map((item, idx) => (
            <div key={idx} className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl border-2 border-emerald-100 flex items-center justify-center mb-4 shadow-md group-hover:border-orange-300 group-hover:shadow-orange-100/50 transition-all">
                <span className="text-3xl font-black text-orange-400">{item.step}</span>
              </div>
              <h3 className="font-bold text-emerald-900 mb-2">{item.title}</h3>
              <p className="text-sm text-emerald-600 leading-relaxed px-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅❌ Conditions Grid */}
      <section className=" py-14 md:py-20 border-y border-emerald-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Accepted */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 md:p-8 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">
                  ✅
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">We Accept Returns</h3>
                  <p className="text-sm text-emerald-600">If these conditions are met</p>
                </div>
              </div>
              <ul className="space-y-3">
                {conditions.filter(c => c.allowed).map((c, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-emerald-100">
                    <span className="text-emerald-500 mt-0.5 text-sm">✓</span>
                    <span className="text-sm text-emerald-800 font-medium">{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Accepted */}
            <div className="bg-red-50/50 rounded-3xl p-6 md:p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-red-200">
                  ❌
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900">Not Eligible for Return</h3>
                  <p className="text-sm text-red-600">Returns will be rejected if</p>
                </div>
              </div>
              <ul className="space-y-3">
                {conditions.filter(c => !c.allowed).map((c, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-red-100">
                    <span className="text-red-400 mt-0.5 text-sm">✕</span>
                    <span className="text-sm text-red-800 font-medium">{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ❓ FAQ Accordion */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-emerald-600">Quick answers about returns and refunds</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaq === idx ? 'bg-white border-orange-200 shadow-lg shadow-orange-100/30' : 'bg-white border-emerald-100 hover:border-emerald-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-bold text-sm md:text-base pr-4 ${openFaq === idx ? 'text-orange-600' : 'text-emerald-900'}`}>
                    {faq.q}
                  </span>
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    openFaq === idx ? 'bg-orange-500 text-white rotate-180' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div className={`px-5 transition-all duration-300 ${openFaq === idx ? 'pb-5 max-h-40' : 'max-h-0 overflow-hidden'}`}>
                  <p className="text-sm text-emerald-600 leading-relaxed border-t border-emerald-50 pt-3">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📞 Contact CTA */}
      <section className="container mx-auto px-4 pb-8">
        <div className="bg-linear-to-r from-emerald-800 to-emerald-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <span className="text-5xl mb-4 block">💬</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Still Have Questions?</h2>
            <p className="text-emerald-200 mb-8 max-w-md mx-auto">
              Our support team is ready to help you with any return or refund related queries.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="tel:01712345678"
                className="flex items-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold hover:bg-orange-400 hover:text-white transition shadow-lg"
              >
                <span>📞</span> 01712-345678
              </a>
              <a 
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition border border-emerald-600"
              >
                <span>💬</span> WhatsApp Support
              </a>
            </div>
            
            <p className="text-emerald-400 text-xs mt-6">
              Working Hours: Saturday - Thursday | 10:00 AM - 8:00 PM
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ReturnPolicy;