import { useState, useEffect, useRef } from 'react';
import ProductCard from '../../componets/ProductCard.jsx';
import CountdownTimer from '../../componets/CountdownTimer.jsx';


const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=500&fit=crop',
    title: 'Authentic Homemade Pickles',
    subtitle: '100% Natural • No Preservatives • Traditional Taste',
    cta: 'Shop Now',
    link: '/shop',
    color: 'from-emerald-900/80 to-emerald-800/40'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&h=500&fit=crop',
    title: 'Eid Special Combo Offer',
    subtitle: 'Buy 3 Get 1 Free • Limited Time Only',
    cta: 'Grab Offer',
    link: '/offers',
    color: 'from-orange-900/80 to-orange-700/40'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1200&h=500&fit=crop',
    title: 'Spicy Mango Achar',
    subtitle: 'Sun-dried • Mustard Oil • Perfect Spice Blend',
    cta: 'Order Now',
    link: '/product/mango-achar',
    color: 'from-red-900/80 to-orange-800/40'
  }
];

const flashSaleProducts = [
  {
    id: 101,
    name: 'Premium Mango Achar',
    price: 299,
    oldPrice: 450,
    image: '🥭',
    rating: 4.8,
    sold: 124,
    total: 200,
    variations: [
      { id: 'v1', label: '250gm', price: 299 },
      { id: 'v2', label: '500gm', price: 550 },
      { id: 'v3', label: '1kg', price: 999 },
    ]
  },
  {
    id: 102,
    name: 'Spicy Mixed Pickle',
    price: 199,
    oldPrice: 320,
    image: '🌶️',
    rating: 4.6,
    sold: 89,
    total: 150,
    variations: [
      { id: 'v1', label: '250gm', price: 199 },
      { id: 'v2', label: '500gm', price: 380 },
    ]
  },
  {
    id: 103,
    name: 'Sweet Lime Achar',
    price: 249,
    oldPrice: 380,
    image: '🍯',
    rating: 4.9,
    sold: 156,
    total: 180,
    variations: [
      { id: 'v1', label: '250gm', price: 249 },
      { id: 'v2', label: '500gm', price: 480 },
      { id: 'v3', label: '1kg', price: 899 },
    ]
  },
  {
    id: 104,
    name: 'Garlic Chili Achar',
    price: 179,
    oldPrice: 280,
    image: '🧄',
    rating: 4.5,
    sold: 67,
    total: 120,
    variations: [
      { id: 'v1', label: '200gm', price: 179 },
      { id: 'v2', label: '400gm', price: 340 },
    ]
  },
  {
    id: 105,
    name: 'Olive Pickle Special',
    price: 349,
    oldPrice: 500,
    image: '🫒',
    rating: 4.7,
    sold: 45,
    total: 100,
    variations: [
      { id: 'v1', label: '250gm', price: 349 },
      { id: 'v2', label: '500gm', price: 650 },
    ]
  },
];

const featuredProducts = [
  { id: 201, name: 'Royal Mango Achar', price: 599, oldPrice: 750, image: '🥭', rating: 5.0, badge: 'BESTSELLER', variations: [{ id: 'v1', label: '500gm', price: 599 }, { id: 'v2', label: '1kg', price: 1100 }] },
  { id: 202, name: 'Mixed Veg Pickle', price: 349, oldPrice: 450, image: '🥒', rating: 4.7, badge: 'FEATURED', variations: [{ id: 'v1', label: '250gm', price: 349 }, { id: 'v2', label: '500gm', price: 650 }] },
  { id: 203, name: 'Tamarind Date Achar', price: 399, oldPrice: 520, image: '🌿', rating: 4.8, badge: 'FEATURED', variations: [{ id: 'v1', label: '300gm', price: 399 }] },
  { id: 204, name: 'Green Chili Achar', price: 159, oldPrice: 220, image: '🌶️', rating: 4.4, badge: null, variations: [{ id: 'v1', label: '200gm', price: 159 }, { id: 'v2', label: '400gm', price: 300 }] },
];

const newArrivals = [
  { id: 301, name: 'Kasundi Mustard', price: 199, oldPrice: null, image: '🟡', rating: 4.9, isNew: true, variations: [{ id: 'v1', label: '250gm', price: 199 }] },
  { id: 302, name: 'Plum Achar', price: 279, oldPrice: 350, image: '🟣', rating: 4.6, isNew: true, variations: [{ id: 'v1', label: '250gm', price: 279 }, { id: 'v2', label: '500gm', price: 520 }] },
  { id: 303, name: 'Carrot Pickle', price: 149, oldPrice: 200, image: '🥕', rating: 4.3, isNew: true, variations: [{ id: 'v1', label: '250gm', price: 149 }] },
  { id: 304, name: 'Lotus Stem Achar', price: 329, oldPrice: 420, image: '🪷', rating: 4.7, isNew: true, variations: [{ id: 'v1', label: '250gm', price: 329 }] },
];

const bestSelling = [
  { id: 401, name: 'Classic Mango Achar', price: 450, oldPrice: 550, image: '🥭', rating: 4.9, soldCount: 1205, variations: [{ id: 'v1', label: '500gm', price: 450 }, { id: 'v2', label: '1kg', price: 850 }] },
  { id: 402, name: 'Garlic Delight', price: 320, oldPrice: 400, image: '🧄', rating: 4.8, soldCount: 980, variations: [{ id: 'v1', label: '250gm', price: 320 }] },
  { id: 403, name: 'Lime Spicy Mix', price: 280, oldPrice: 350, image: '🍋', rating: 4.7, soldCount: 856, variations: [{ id: 'v1', label: '250gm', price: 280 }, { id: 'v2', label: '500gm', price: 520 }] },
  { id: 404, name: 'Panch Phoron Achar', price: 380, oldPrice: 480, image: '🌿', rating: 4.8, soldCount: 743, variations: [{ id: 'v1', label: '300gm', price: 380 }] },
];

const categoryWiseProducts = [
  {
    category: 'Mango Special',
    icon: '🥭',
    products: [
      { id: 501, name: 'Sweet Mango Achar', price: 350, oldPrice: 450, image: '🥭', rating: 4.8, variations: [{ id: 'v1', label: '250gm', price: 350 }] },
      { id: 502, name: 'Sour Mango Pickle', price: 320, oldPrice: 400, image: '🥭', rating: 4.6, variations: [{ id: 'v1', label: '250gm', price: 320 }] },
      { id: 503, name: 'Mustard Mango', price: 380, oldPrice: 480, image: '🥭', rating: 4.9, variations: [{ id: 'v1', label: '250gm', price: 380 }] },
      { id: 504, name: 'Mango Chutney', price: 299, oldPrice: 380, image: '🥭', rating: 4.5, variations: [{ id: 'v1', label: '250gm', price: 299 }] },
    ]
  },
  {
    category: 'Spicy Collection',
    icon: '🌶️',
    products: [
      { id: 601, name: 'Red Chili Blast', price: 180, oldPrice: 250, image: '🌶️', rating: 4.7, variations: [{ id: 'v1', label: '200gm', price: 180 }] },
      { id: 602, name: 'Ghost Pepper Achar', price: 250, oldPrice: 350, image: '🌶️', rating: 4.9, variations: [{ id: 'v1', label: '150gm', price: 250 }] },
      { id: 603, name: 'Mixed Spicy Box', price: 499, oldPrice: 650, image: '🌶️', rating: 4.8, variations: [{ id: 'v1', label: 'Combo', price: 499 }] },
      { id: 604, name: 'Green Chili Garlic', price: 199, oldPrice: 280, image: '🌶️', rating: 4.5, variations: [{ id: 'v1', label: '250gm', price: 199 }] },
    ]
  }
];



/* MAIN HOME COMPONENT*/

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCatTab, setActiveCatTab] = useState(0);
  const flashScrollRef = useRef(null);

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollFlash = (dir) => {
    if (flashScrollRef.current) {
      flashScrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30">
      
      {/* 1️⃣ HERO SLIDER */}
      <section className="relative h-75 sm:h-100 md:h-125 overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div 
              className={`absolute inset-0 bg-linear-to-r ${slide.color} z-10`}
            />
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl animate-fadeIn">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-emerald-100 text-sm sm:text-base md:text-lg mb-6 drop-shadow">
                    {slide.subtitle}
                  </p>
                  <a 
                    href={slide.link}
                    className="inline-flex items-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-full font-bold hover:bg-orange-400 hover:text-white transition shadow-lg"
                  >
                    {slide.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2️⃣ CAMPAIGN BANNER (Below Slider) */}
      <section className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-linear-to-r from-orange-400 to-orange-500 rounded-2xl p-4 md:p-5 shadow-xl shadow-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎉</span>
            <div>
              <h3 className="text-white font-bold text-sm md:text-base">Eid Special Offer Running!</h3>
              <p className="text-orange-100 text-xs">Free Delivery on orders above ৳500</p>
            </div>
          </div>
          <a href="/offers" className="bg-white text-orange-500 px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-50 transition shadow-sm whitespace-nowrap">
            View All Offers →
          </a>
        </div>
      </section>

     {/* 🫙 3️⃣ ACTION JAR SECTION */}
      
      {/* 🫙 4 ACHAR JAR FEATURE SECTION */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <span className="w-1.5 h-7 bg-orange-400 rounded-full"></span>
            Quick Access
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* 🫙 JAR 1: Coupon Collect - টিংগল জার স্টাইল */}
          <div className="group relative flex flex-col items-center">
            
            {/* Jar Lid - সোনালি/কালো ঢাকনা */}
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-linear-to-b from-amber-600 via-amber-700 to-amber-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-linear-to-b from-amber-700 via-amber-800 to-amber-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-amber-900/30"></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-amber-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-linear-to-b from-amber-900 to-amber-950 rounded-b-sm"></div>
            </div>

            {/* Jar Neck - চিকন গলা */}
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-linear-to-b from-emerald-100/80 to-white/90 border-x border-emerald-200/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>

            {/* Jar Shoulder */}
            <div className="relative z-10 w-[75%] h-3 bg-linear-to-b from-white to-emerald-50/50 rounded-t-[40%] border-t border-emerald-100/50"></div>

            {/* Jar Body - গোলাকার পেট */}
            <div className="relative -mt-1 w-full aspect-[0.8] bg-linear-to-b from-emerald-50/20 via-white to-emerald-50/30 rounded-[40%] border-2 border-emerald-100/80 group-hover:border-orange-300/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-100/30 flex flex-col items-center justify-center overflow-hidden">
              
              {/* Glass reflection - left side */}
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-8 left-6 w-2 h-10 bg-white/30 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              
              {/* Glass reflection - right side curve */}
              <div className="absolute top-6 right-2 w-6 h-24 bg-linear-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>

              {/* Achar inside - top visible */}
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-linear-to-b from-amber-900/20 via-amber-800/10 to-transparent z-10"></div>
              
              {/* Achar inside - bottom visible */}
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-linear-to-t from-orange-900/15 via-amber-800/10 to-transparent z-10"></div>

              {/* Label - সবুজ লেবেল (বড় করা হয়েছে button ধরতে) */}
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-linear-to-b from-emerald-400/90 via-emerald-500/95 to-emerald-600/90 rounded-[30%] border border-emerald-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                
                {/* Label pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                
                {/* Label content */}
                <div className="relative flex-1 pb-10 flex flex-col items-center justify-center p-3 text-center">
                  
                  {/* Brand logo area */}
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">🎟️</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white font-bold sm:text-2xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    কুপন
                  </h3>
                  <p className="text-emerald-100 sm:text-xl text-2xl font-medium mb-2">সংগ্রহ করুন</p>
                  
                  {/* Divider */}
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  
                  {/* Offer */}
                  <div className="bg-white/90 rounded-full px-3 py-1 shadow-md mb-2">
                    <p className="text-emerald-700 sm:text-[15px] text-[20px] font-extrabold">২০% ছাড়</p>
                  </div>
                  
                  {/* Code */}
                  <p className="text-emerald-100 sm:text-[15px] text-[20px] mb-2 tracking-wider">কোড: EID20</p>
                  
                  {/* 🔥 BUTTON INSIDE LABEL */}
                  <button className="w-full py-1.5 bg-linear-to-r from-orange-400 to-amber-500 text-white sm:text-[15px] text-[20px] cursor-pointer font-bold rounded-full hover:from-orange-500 hover:to-amber-600 transition shadow-md active:scale-95">
                    কুপন নিন
                  </button>
                </div>
              </div>

              
            </div>

            {/* Jar Bottom */}
            <div className="relative -mt-2 w-[70%] h-4 bg-linear-to-b from-emerald-100/40 to-emerald-200/20 rounded-[50%] shadow-sm"></div>
            
            {/* Shadow */}
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>

          {/* 🫙 JAR 2: Order Track */}
          <div className="group relative flex flex-col items-center">
            
            {/* Jar Lid */}
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-linear-to-b from-emerald-600 via-emerald-700 to-emerald-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-linear-to-b from-emerald-700 via-emerald-800 to-emerald-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-emerald-900/30"></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-emerald-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-linear-to-b from-emerald-900 to-emerald-950 rounded-b-sm"></div>
            </div>

            {/* Jar Neck */}
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-linear-to-b from-emerald-100/80 to-white/90 border-x border-emerald-200/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>

            {/* Jar Shoulder */}
            <div className="relative z-10 w-[75%] h-3 bg-linear-to-b from-white to-emerald-50/50 rounded-t-[40%] border-t border-emerald-100/50"></div>

            {/* Jar Body */}
            <div className="relative -mt-1 w-full aspect-[0.8] bg-linear-to-b from-emerald-50/20 via-white to-emerald-50/30 rounded-[40%] border-2 border-emerald-100/80 group-hover:border-emerald-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-100/30 flex flex-col items-center justify-center overflow-hidden">
              
              {/* Glass reflections */}
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-6 right-2 w-6 h-24 bg-linear-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>

              {/* Achar inside */}
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-linear-to-b from-emerald-900/15 via-emerald-800/10 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-linear-to-t from-emerald-900/12 via-teal-800/8 to-transparent z-10"></div>

              {/* Label */}
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-linear-to-b from-teal-400/90 via-emerald-500/95 to-emerald-600/90 rounded-[30%] border border-emerald-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                
                <div className="relative flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">📦</span>
                  </div>
                  <h3 className="text-white font-bold sm:text-xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    অর্ডার
                  </h3>
                  <p className="text-emerald-100 sm:text-[15px] text-[20px] font-medium mb-2">ট্র্যাক করুন</p>
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  
                  {/* Tracking progress */}
                  <div className="flex items-center gap-1 justify-center mb-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-4 h-0.5 bg-white/50"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    <div className="w-4 h-0.5 bg-white/30"></div>
                    <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  </div>
                  <p className="text-emerald-100 sm:text-[15px] text-[20px] mb-2">ডেলিভারিতে আছে</p>
                  
                  {/* 🔥 BUTTON INSIDE LABEL */}
                  <a href="/track-order" className="w-full py-1.5 bg-linear-to-r from-emerald-400 to-teal-500 text-white sm:text-[15px] text-[20px] font-bold rounded-full hover:from-emerald-500 hover:to-teal-600 transition shadow-md active:scale-95 text-center block">
                    ট্র্যাক করুন
                  </a>
                </div>
              </div>

              
            </div>

            <div className="relative -mt-2 w-[70%] h-4 bg-linear-to-b from-emerald-100/40 to-emerald-200/20 rounded-[50%] shadow-sm"></div>
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>

          {/* 🫙 JAR 3: Flash Sale */}
          <div className="group relative flex flex-col items-center">
            
            {/* Jar Lid */}
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-linear-to-b from-red-600 via-red-700 to-red-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-linear-to-b from-red-700 via-red-800 to-red-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-red-900/30"></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-red-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-linear-to-b from-red-900 to-red-950 rounded-b-sm"></div>
            </div>

            {/* Jar Neck */}
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-linear-to-b from-red-50/80 to-white/90 border-x border-red-100/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>

            {/* Jar Shoulder */}
            <div className="relative z-10 w-[75%] h-3 bg-linear-to-b from-white to-red-50/50 rounded-t-[40%] border-t border-red-100/50"></div>

            {/* Jar Body */}
            <div className="relative -mt-1 w-full aspect-[0.8] bg-linear-to-b from-red-50/20 via-white to-orange-50/30 rounded-[40%] border-2 border-red-100/80 group-hover:border-red-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-100/30 flex flex-col items-center justify-center overflow-hidden">
              
              {/* Glass reflections */}
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-6 right-2 w-6 h-24 bg-linear-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>

              {/* Achar inside - spicy red */}
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-linear-to-b from-red-900/20 via-red-800/10 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-linear-to-t from-red-900/15 via-orange-800/10 to-transparent z-10"></div>

              {/* Label */}
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-linear-to-b from-orange-400/90 via-red-500/95 to-red-600/90 rounded-[30%] border border-red-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                
                <div className="relative flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">🔥</span>
                  </div>
                  <h3 className="text-white font-bold sm:text-xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    ফ্ল্যাশ
                  </h3>
                  <p className="text-red-100 sm:text-[15px] text-[20px] font-medium mb-2">সেল চলছে</p>
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  
                  {/* Timer */}
                  <div className="flex justify-center gap-1 mb-2">
                    {['০২', '৪৫', '৩০'].map((time, i) => (
                      <span key={i} className="bg-white/90 text-red-600 sm:text-[15px] text-[20px] font-bold px-1 py-0.5 rounded">
                        {time}{i < 2 && ':'}
                      </span>
                    ))}
                  </div>
                  <p className="text-red-100 sm:text-[15px] text-[20px] mb-2">শেষ হতে চলেছে</p>
                  
                  {/* 🔥 BUTTON INSIDE LABEL */}
                  <a href="/flash-sale" className="w-full py-1.5 bg-linear-to-r from-red-400 to-orange-500 text-white sm:text-[15px] text-[20px] font-bold rounded-full hover:from-red-500 hover:to-orange-600 transition shadow-md active:scale-95 text-center block">
                    কিনুন
                  </a>
                </div>
              </div>

              
            </div>

            <div className="relative -mt-2 w-[70%] h-4 bg-linear-to-b from-red-100/40 to-red-200/20 rounded-[50%] shadow-sm"></div>
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>

          {/* 🫙 JAR 4: Support */}
          <div className="group relative flex flex-col items-center">
            
            {/* Jar Lid */}
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-linear-to-b from-blue-600 via-blue-700 to-blue-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-linear-to-b from-blue-700 via-blue-800 to-blue-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-blue-900/30"></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-blue-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-linear-to-b from-blue-900 to-blue-950 rounded-b-sm"></div>
            </div>

            {/* Jar Neck */}
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-linear-to-b from-blue-50/80 to-white/90 border-x border-blue-100/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>

            {/* Jar Shoulder */}
            <div className="relative z-10 w-[75%] h-3 bg-linear-to-b from-white to-blue-50/50 rounded-t-[40%] border-t border-blue-100/50"></div>

            {/* Jar Body */}
            <div className="relative -mt-1 w-full aspect-[0.8] bg-linear-to-b from-blue-50/20 via-white to-indigo-50/30 rounded-[40%] border-2 border-blue-100/80 group-hover:border-blue-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-100/30 flex flex-col items-center justify-center overflow-hidden">
              
              {/* Glass reflections */}
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-6 right-2 w-6 h-24 bg-linear-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>

              {/* Achar inside */}
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-linear-to-b from-blue-900/15 via-indigo-800/10 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-linear-to-t from-blue-900/12 via-indigo-800/8 to-transparent z-10"></div>

              {/* Label */}
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-linear-to-b from-blue-400/90 via-indigo-500/95 to-blue-600/90 rounded-[30%] border border-blue-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                
                <div className="relative flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">💬</span>
                  </div>
                  <h3 className="text-white font-bold sm:text-xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    সহায়তা
                  </h3>
                  <p className="text-blue-100 sm:text-[15px] text-[20px] font-medium mb-2">২৪/৭ সাপোর্ট</p>
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  
                  <div className="bg-white/90 rounded-full px-3 py-1 shadow-md mb-2">
                    <p className="text-blue-600 sm:text-[15px] text-[20px] font-bold">২ মিনিটে রিপ্লাই</p>
                  </div>
                  <p className="text-blue-100 sm:text-[15px] text-[20px] mb-2">এখনই চ্যাট করুন</p>
                  
                  {/* 🔥 BUTTON INSIDE LABEL */}
                  <a href="/support" className="w-full py-1.5 bg-linear-to-r from-blue-400 to-indigo-500 text-white sm:text-[15px] text-[20px] font-bold rounded-full hover:from-blue-500 hover:to-indigo-600 transition shadow-md active:scale-95 text-center block">
                    চ্যাট করুন
                  </a>
                </div>
              </div>

              
            </div>

            <div className="relative -mt-2 w-[70%] h-4 bg-linear-to-b from-blue-100/40 to-blue-200/20 rounded-[50%] shadow-sm"></div>
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>

        </div>
      </section>

      {/* 4️⃣ FLASH SALE SECTION */}
      <section className="py-10 md:py-14 border-y border-orange-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">⚡</span>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-red-600 flex items-center gap-2">
                  Flash Sale
                </h2>
                <p className="text-xs text-red-400 font-medium">Hurry up! Limited stock available</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center gap-5 w-full sm:w-auto">
              <div className="w-full sm:w-auto  sm:flex items-center  gap-2 bg-white px-3 py-1.5 rounded-xl border border-red-100 shadow-sm">
                <span className=" text-xl  font-bold text-red-500 uppercase ">Ends in :</span>
                <CountdownTimer/>
              </div>
              {/* Buttons শুধু sm এবং তার উপরে দেখাবে, mobile এ hide */}
              <div className="hidden sm:flex gap-1">
                <button onClick={() => scrollFlash(-1)} className="w-8 h-8 rounded-full bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => scrollFlash(1)} className="w-8 h-8 rounded-full bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile এ flex-col (vertical), sm এ flex-row (horizontal slider) */}
          <div 
            ref={flashScrollRef}
            className="flex flex-col sm:flex-row gap-4 sm:overflow-x-auto pb-2 sm:snap-x sm:snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="w-full sm:min-w-70 sm:snap-start">
                <ProductCard product={product} flashSale />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ FEATURED PRODUCTS */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <span className="w-1.5 h-7 bg-orange-400 rounded-full"></span>
            Featured Products
          </h2>
          <a href="/shop" className="text-sm text-orange-500 font-bold hover:text-orange-600 transition">View All →</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6️⃣ ADS / PROMO SECTION */}
      <section className="container mx-auto px-4 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ad 1 */}
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-800/90 to-emerald-600/70 z-10" />
            <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=300&fit=crop" alt="Combo" className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
              <span className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-1">Combo Offer</span>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Family Pack Special</h3>
              <p className="text-emerald-100 text-sm mb-4">Buy 4 jars & get 25% off + free delivery</p>
              <span className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                Shop Combo <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </div>
          
          {/* Ad 2 */}
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-r from-orange-800/90 to-orange-600/70 z-10" />
            <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=300&fit=crop" alt="New" className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
              <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider mb-1">New Recipe</span>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Kasundi Mustard</h3>
              <p className="text-orange-100 text-sm mb-4">Traditional Bengali flavor, now in stock</p>
              <span className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                Try Now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ NEW ARRIVALS */}
      <section className=" py-10 md:py-14 border-y border-emerald-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-1.5 h-7 bg-emerald-400 rounded-full"></span>
              New Arrivals
            </h2>
            <a href="/new-arrivals" className="text-sm text-orange-500 font-bold hover:text-orange-600 transition">View All →</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8️⃣ BEST SELLING */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <span className="w-1.5 h-7 bg-orange-400 rounded-full"></span>
            Best Selling
          </h2>
          <a href="/best-sellers" className="text-sm text-orange-500 font-bold hover:text-orange-600 transition">View All →</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {bestSelling.map((product) => (
            <ProductCard key={product.id} product={product} bestSeller />
          ))}
        </div>
      </section>

      {/* 9️⃣ CATEGORY-WISE PRODUCTS */}
      <section className=" py-10 md:py-14 border-t border-emerald-100">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2 mb-6">
            <span className="w-1.5 h-7 bg-orange-400 rounded-full"></span>
            Browse by Category
          </h2>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6">
            {categoryWiseProducts.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCatTab(idx)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  activeCatTab === idx
                    ? 'bg-emerald-800 text-white shadow-lg'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                <span className="mr-1">{cat.icon}</span> {cat.category}
              </button>
            ))}
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {categoryWiseProducts[activeCatTab].products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 🔔 TRUST BAR (Extra) */}
      <section className="bg-emerald-900 text-emerald-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'Orders over ৳500' },
              { icon: '🔄', title: 'Easy Returns', desc: '7 Days Return' },
              { icon: '💯', title: 'Genuine Product', desc: '100% Authentic' },
              { icon: '🛡️', title: 'Secure Payment', desc: 'SSL Encrypted' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-3xl mb-1">{item.icon}</span>
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-xs text-emerald-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;