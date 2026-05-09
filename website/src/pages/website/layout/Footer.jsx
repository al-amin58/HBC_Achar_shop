import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-emerald-900 text-emerald-100 mt-auto">
      
      {/* 🔔 Newsletter Banner */}
      <div className="bg-linear-to-r from-orange-400 via-orange-300 to-orange-400 relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                <span>📩</span> Subscribe to Our Newsletter
              </h3>
              <p className="text-orange-50 text-sm md:text-base">
                Get exclusive offers, new arrival alerts & achar recipes!
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-2 max-w-md">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-4 pr-4 py-3 rounded-xl border-2 border-orange-200 focus:border-white focus:outline-none focus:ring-4 focus:ring-orange-200/50 text-emerald-900 placeholder:text-emerald-300 bg-white transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition shadow-lg whitespace-nowrap"
              >
                {subscribed ? '✅ Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      

      {/* 🦶 Main Footer Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <a href="/" className="inline-block">
              <img src="./logo.png" alt="HBC Achar" className="w-24 h-14 rounded-lg" />
            </a>
            <p className="text-emerald-300 text-sm leading-relaxed">
              Authentic homemade pickles crafted with love. Bringing the taste of tradition to your doorstep since 2018.
            </p>
            <p className="text-orange-300 text-xs font-bold uppercase tracking-wider">
              🏠 Homemade • 🧼 Hygienic • 💯 Natural
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: '📘', label: 'Facebook', href: '#' },
                { icon: '📸', label: 'Instagram', href: '#' },
                { icon: '🎬', label: 'YouTube', href: '#' },
                { icon: '💬', label: 'WhatsApp', href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-emerald-800 hover:bg-orange-500 rounded-xl flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-400 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: '🏠 Home', href: '/' },
                { name: '🛍️ Shop All', href: '/shop' },
                { name: '📂 Categories', href: '/categories' },
                { name: '🔥 Flash Sale', href: '/flash-sale' },
                { name: '🎁 Offers & Campaigns', href: '/offers' },
                { name: '✨ New Arrivals', href: '/category/new' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-emerald-300 hover:text-orange-300 text-sm transition flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-400 rounded-full"></span>
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: '👤 My Account', href: '/customer' },
                { name: '📦 My Orders', href: '/orders' },
                { name: '🚚 Track Order', href: '/track-order' },
                { name: '↩️ Return Policy', href: '/return-policy' },
                { name: '📝 Terms & Conditions', href: '/terms-and-conditions' },
                { name: '🔒 Privacy Policy', href: '/privacy-policy' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-emerald-300 hover:text-orange-300 text-sm transition flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-400 rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-lg mt-0.5">📍</span>
                <div>
                  <p className="text-sm text-white font-medium">Address</p>
                  <p className="text-sm text-emerald-300">House 12, Road 5, Dhanmondi, Dhaka-1205</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-lg mt-0.5">📞</span>
                <div>
                  <p className="text-sm text-white font-medium">Phone</p>
                  <a href="tel:01712345678" className="text-sm text-emerald-300 hover:text-orange-300 transition">
                    01712-345678
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-lg mt-0.5">📧</span>
                <div>
                  <p className="text-sm text-white font-medium">Email</p>
                  <a href="mailto:support@hbcachar.com" className="text-sm text-emerald-300 hover:text-orange-300 transition">
                    support@hbcachar.com
                  </a>
                </div>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
 

      {/* 📌 Copyright Bar */}
      <div className="border-t border-emerald-800 bg-emerald-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-emerald-400">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} <span className="text-orange-400 font-bold">HBC Achar</span>. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="/privacy-policy" className="hover:text-orange-300 transition">Privacy Policy</a>
              <span className="text-emerald-700">|</span>
              <a href="/terms" className="hover:text-orange-300 transition">Terms & Conditions</a>
              <span className="text-emerald-700">|</span>
              <a href="/refund-policy" className="hover:text-orange-300 transition">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;