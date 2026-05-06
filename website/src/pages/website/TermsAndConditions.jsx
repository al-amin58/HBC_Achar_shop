import { useState, useEffect } from 'react';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  // Scroll spy to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionIds.map(id => document.getElementById(id));
      const scrollPos = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const sectionIds = [
    'acceptance',
    'products',
    'pricing',
    'shipping',
    'cancellation',
    'returns',
    'accounts',
    'safety',
    'property',
    'liability',
    'law',
    'changes',
    'contact'
  ];

  const navItems = [
    { id: 'acceptance', label: 'Acceptance of Terms', icon: '✅' },
    { id: 'products', label: 'Products & Descriptions', icon: '📦' },
    { id: 'pricing', label: 'Pricing & Payment', icon: '💳' },
    { id: 'shipping', label: 'Shipping & Delivery', icon: '🚚' },
    { id: 'cancellation', label: 'Order Cancellation', icon: '❌' },
    { id: 'returns', label: 'Returns & Refunds', icon: '🔄' },
    { id: 'accounts', label: 'User Accounts', icon: '👤' },
    { id: 'safety', label: 'Food Safety', icon: '🛡️' },
    { id: 'property', label: 'Intellectual Property', icon: '©️' },
    { id: 'liability', label: 'Limitation of Liability', icon: '⚖️' },
    { id: 'law', label: 'Governing Law', icon: '📜' },
    { id: 'changes', label: 'Changes to Terms', icon: '📝' },
    { id: 'contact', label: 'Contact Us', icon: '📞' },
  ];

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans pb-16">
      
      {/* 🏔️ Hero Banner */}
      <div className="bg-linear-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 text-9xl">📜</div>
          <div className="absolute bottom-5 left-20 text-8xl">⚖️</div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-orange-300 text-sm font-bold uppercase tracking-wider mb-3">
              <span className="w-8 h-0.5 bg-orange-400"></span>
              Legal Information
              <span className="w-8 h-0.5 bg-orange-400"></span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Terms & <span className="text-orange-400">Conditions</span>
            </h1>
            <p className="text-emerald-100 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Please read these terms carefully before using our website or placing an order. 
              By accessing HBC Achar, you agree to be bound by these terms.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Last Updated: May 05, 2026
            </div>
          </div>
        </div>
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80V40C240 0 480 0 720 26.7C960 53 1200 80 1440 40V80H0Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* 📑 Sticky Sidebar Navigation */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-100/30 overflow-hidden">
              <div className="p-4 bg-emerald-800 text-white">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Table of Contents
                </h3>
              </div>
              <nav className="p-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 mb-0.5 ${
                      activeSection === item.id
                        ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200 shadow-sm'
                        : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                    {activeSection === item.id && (
                      <svg className="w-4 h-4 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* 📄 Main Content */}
          <main className="flex-1 space-y-6">
            
            {/* Section 1: Acceptance */}
            <section id="acceptance" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">✅</div>
                <h2 className="text-xl font-bold text-emerald-900">1. Acceptance of Terms</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  Welcome to <strong className="text-emerald-900">HBC Achar</strong>. By accessing our website, placing an order, or using any of our services, 
                  you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
                <p>
                  If you do not agree with any part of these terms, please do not use our website or services. 
                  We reserve the right to update or modify these terms at any time without prior notice.
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-xl">
                  <p className="text-orange-800 font-medium text-xs">
                    💡 <strong>Note:</strong> These terms apply to all users, including visitors, registered customers, and vendors.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Products */}
            <section id="products" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">📦</div>
                <h2 className="text-xl font-bold text-emerald-900">2. Products & Descriptions</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  HBC Achar specializes in homemade, hygienic, and traditional Bengali pickles (achar). 
                  All products are prepared using natural ingredients without artificial preservatives unless stated otherwise.
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Product images are for representation purposes only. Actual product packaging may vary.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>We make every effort to display accurate colors, but we cannot guarantee that your device's display will reflect the true color.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>All products are subject to availability. We reserve the right to discontinue any product without notice.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Weight and quantity mentioned are approximate and may have a ±5% variation due to manual packaging.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Pricing */}
            <section id="pricing" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">💳</div>
                <h2 className="text-xl font-bold text-emerald-900">3. Pricing & Payment</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  All prices listed on our website are in <strong className="text-emerald-900">Bangladeshi Taka (৳)</strong> and are inclusive of applicable taxes unless stated otherwise.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 text-xs uppercase mb-2">Accepted Payments</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-emerald-700 border border-emerald-200">Cash on Delivery</span>
                      <span className="px-2 py-1 bg-pink-100 rounded-lg text-xs font-bold text-pink-700 border border-pink-200">bKash</span>
                      <span className="px-2 py-1 bg-orange-100 rounded-lg text-xs font-bold text-orange-700 border border-orange-200">Nagad</span>
                      <span className="px-2 py-1 bg-purple-100 rounded-lg text-xs font-bold text-purple-700 border border-purple-200">Rocket</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-orange-900 text-xs uppercase mb-2">Price Changes</h4>
                    <p className="text-xs text-orange-700">Prices may change without prior notice. Orders already placed will not be affected by price changes.</p>
                  </div>
                </div>
                <p className="mt-3">
                  In case of payment failure, your order will not be processed. For bKash/Nagad payments, 
                  please keep the transaction ID for reference.
                </p>
              </div>
            </section>

            {/* Section 4: Shipping */}
            <section id="shipping" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🚚</div>
                <h2 className="text-xl font-bold text-emerald-900">4. Shipping & Delivery</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  We deliver across Bangladesh. Delivery times and charges vary based on your location:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs mt-3 border border-emerald-100 rounded-xl overflow-hidden">
                    <thead className="bg-emerald-800 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-left">Delivery Time</th>
                        <th className="px-4 py-3 text-left">Shipping Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      <tr className="bg-emerald-50/50">
                        <td className="px-4 py-3 font-medium">Inside Dhaka</td>
                        <td className="px-4 py-3">24 - 48 Hours</td>
                        <td className="px-4 py-3 text-orange-600 font-bold">৳60</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-medium">Outside Dhaka</td>
                        <td className="px-4 py-3">2 - 5 Days</td>
                        <td className="px-4 py-3 text-orange-600 font-bold">৳120</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="px-4 py-3 font-medium">Free Delivery</td>
                        <td className="px-4 py-3">As per location</td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">৳0 (Orders ৳500+)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">
                  We are not responsible for delays caused by natural disasters, political unrest, or courier service issues. 
                  However, we will do our best to keep you updated.
                </p>
              </div>
            </section>

            {/* Section 5: Cancellation */}
            <section id="cancellation" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">❌</div>
                <h2 className="text-xl font-bold text-emerald-900">5. Order Cancellation</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>You may cancel your order under the following conditions:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span><strong>Before Dispatch:</strong> Full refund if cancelled before the order is shipped.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span><strong>After Dispatch:</strong> Cancellation is not possible, but you may refuse delivery and request a return.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span><strong>Custom Orders:</strong> Special or bulk custom orders cannot be cancelled once production begins.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6: Returns */}
            <section id="returns" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🔄</div>
                <h2 className="text-xl font-bold text-emerald-900">6. Returns & Refunds</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  We accept returns within <strong className="text-emerald-900">7 days</strong> of delivery, provided the product is unused, 
                  unopened, and in its original packaging.
                </p>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-3">
                  <h4 className="text-red-800 font-bold text-xs uppercase mb-2">⚠️ Important for Food Items</h4>
                  <p className="text-red-700 text-xs leading-relaxed">
                    Due to hygiene and food safety regulations, we cannot accept returns of opened, partially consumed, 
                    or damaged-by-customer food products. Please inspect your package upon delivery.
                  </p>
                </div>
                <p className="mt-3">
                  For complete return guidelines, please visit our{' '}
                  <a href="/return-policy" className="text-orange-500 font-bold hover:underline">Return Policy</a> page.
                </p>
              </div>
            </section>

            {/* Section 7: Accounts */}
            <section id="accounts" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">👤</div>
                <h2 className="text-xl font-bold text-emerald-900">7. User Accounts</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  To place orders, you may need to create an account. You are responsible for maintaining the confidentiality 
                  of your account credentials.
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Provide accurate and complete information during registration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>Notify us immediately of any unauthorized use of your account.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>We reserve the right to suspend or terminate accounts with false information or suspicious activity.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 8: Food Safety */}
            <section id="safety" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🛡️</div>
                <h2 className="text-xl font-bold text-emerald-900">8. Food Safety & Hygiene</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  At HBC Achar, food safety is our top priority. All products are prepared in a hygienic environment 
                  following standard food safety protocols.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {[
                    { icon: '🧼', title: 'Hygienic Prep', desc: 'Clean kitchen environment' },
                    { icon: '🌡️', title: 'Proper Storage', desc: 'Temperature controlled' },
                    { icon: '📅', title: 'Expiry Dates', desc: 'Clearly labeled on all jars' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-emerald-50 p-3 rounded-xl text-center border border-emerald-100">
                      <span className="text-2xl mb-1 block">{item.icon}</span>
                      <h5 className="font-bold text-emerald-900 text-xs">{item.title}</h5>
                      <p className="text-[10px] text-emerald-600 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3">
                  Customers must store products as instructed on the label. We are not liable for spoilage due to improper storage 
                  after delivery.
                </p>
              </div>
            </section>

            {/* Section 9: Intellectual Property */}
            <section id="property" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">©️</div>
                <h2 className="text-xl font-bold text-emerald-900">9. Intellectual Property</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  All content on this website, including text, graphics, logos, images, product descriptions, and software, 
                  is the property of HBC Achar and is protected by copyright and trademark laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, or republish any content from this website without our prior written consent.
                </p>
              </div>
            </section>

            {/* Section 10: Liability */}
            <section id="liability" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">⚖️</div>
                <h2 className="text-xl font-bold text-emerald-900">10. Limitation of Liability</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  HBC Achar shall not be liable for any indirect, incidental, special, or consequential damages arising from 
                  the use of our products or website.
                </p>
                <p>
                  Our total liability in any circumstance shall not exceed the total amount paid by you for the specific product 
                  in question.
                </p>
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-xl mt-3">
                  <p className="text-emerald-800 text-xs">
                    <strong>Allergen Notice:</strong> Our products may contain common allergens like mustard, sesame, or sulfites. 
                    Please read labels carefully if you have food allergies.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11: Governing Law */}
            <section id="law" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">📜</div>
                <h2 className="text-xl font-bold text-emerald-900">11. Governing Law</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of the 
                  <strong className="text-emerald-900"> People's Republic of Bangladesh</strong>.
                </p>
                <p>
                  Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.
                </p>
              </div>
            </section>

            {/* Section 12: Changes */}
            <section id="changes" className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">📝</div>
                <h2 className="text-xl font-bold text-emerald-900">12. Changes to Terms</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-700 leading-relaxed">
                <p>
                  We reserve the right to update or modify these Terms and Conditions at any time. Changes will be effective 
                  immediately upon posting on this page.
                </p>
                <p>
                  It is your responsibility to review these terms periodically. Continued use of our website after changes 
                  constitutes acceptance of the updated terms.
                </p>
              </div>
            </section>

            {/* Section 13: Contact */}
            <section id="contact" className="bg-linear-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 md:p-8 text-white shadow-xl scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm">📞</div>
                <h2 className="text-xl font-bold">13. Contact Us</h2>
              </div>
              <div className="space-y-3 text-sm text-emerald-100 leading-relaxed">
                <p>
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <a href="mailto:support@hbcachar.com" className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition">
                    <span className="text-2xl mb-2 block">📧</span>
                    <p className="font-bold text-white text-xs uppercase">Email</p>
                    <p className="text-xs mt-1">support@hbcachar.com</p>
                  </a>
                  <a href="tel:01712345678" className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition">
                    <span className="text-2xl mb-2 block">📱</span>
                    <p className="font-bold text-white text-xs uppercase">Phone</p>
                    <p className="text-xs mt-1">01712-345678</p>
                  </a>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <span className="text-2xl mb-2 block">📍</span>
                    <p className="font-bold text-white text-xs uppercase">Address</p>
                    <p className="text-xs mt-1">Dhanmondi, Dhaka-1205</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Agreement Checkbox */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
              <p className="text-sm text-orange-800 font-medium mb-2">
                By continuing to use HBC Achar, you acknowledge that you have read and agree to these Terms and Conditions.
              </p>
              <p className="text-xs text-orange-600">
                Last Updated: May 05, 2026 | Version 1.0
              </p>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;