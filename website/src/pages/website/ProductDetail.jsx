// pages/ProductDetail.jsx
import { useState, useRef } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  Truck, 
  ShieldCheck, 
  RefreshCcw, 
  MapPin, 
  ChevronRight, 
  ThumbsUp,
  Share2,
  Heart,
  CheckCircle2,
  Minus,
  Plus,
  HelpCircle,
  Store
} from 'lucide-react';

// ─── Mock Data ──────────────────────────────────────────────
const productData = {
  _id: 'p1',
  name: 'Chaltar Achar (Homemade)',
  brand: 'No Brand',
  category: 'Canned, Dry & Packaged Foods',
  price: 210,
  originalPrice: 249,
  discountPercent: 16,
  rating: 5.0,
  totalRatings: 1,
  totalReviews: 1,
  stock: 15,
  sku: '529878242_BD-2546607714',
  weight: '350 gm',
  packageType: 'Boxes',
  countryOfOrigin: 'Bangladesh',
  images: [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    'https://images.unsplash.com/photo-1589187154184-995b8a4e740a?w=800&q=80',
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80'
  ],
  variations: {
    size: [
      { value: '250g', price: 150, available: true },
      { value: '500g', price: 210, available: true },
      { value: '1kg', price: 380, available: false }
    ],
    spicyLevel: [
      { value: 'Low', available: true },
      { value: 'Medium', available: true },
      { value: 'High', available: true }
    ]
  },
  description: [
    'হোমমেইড চালতার আচার',
    'খাঁটি ঘরোয়া পদ্ধতিতে তৈরি চালতার আচার, তৈরি করা হয়েছে সম্পূর্ণ স্বাস্থ্যসম্মত উপায়ে।',
    'চালতা বাছাই করে শুকিয়ে মশলা মাখানো—সবকিছুতেই রয়েছে যত্ন আর ভালোবাসা।',
    'কোন প্রিজারভেটিভ ছাড়া, পারিবারিক রেসিপিতে তৈরি এই আচার খেতে টক-ঝাল-মিষ্টি, যা ভাত কিংবা বিস্কুটের সঙ্গেও অসাধারণ যায়।',
    'উপাদান: চালতা, সরিষার তেল, শুকনা মরিচ, রসুন, মেথি, পাঁচফোড়ন ও দেশি মসলা।'
  ],
  seller: {
    name: 'JP Mart',
    positiveRating: 76,
    shipOnTime: 100
  },
  reviews: [
    {
      id: 1,
      user: 'Angela K',
      avatar: 'A',
      rating: 5,
      date: '10 Sep 2025',
      isVerified: true,
      comment: 'সেই ছোটবেলার কথা মনে করিয়ে দিলো।',
      likes: 0,
      sellerResponse: {
        text: 'আপনার মূল্যবান ৫ স্টার রিভিউয়ের জন্য আন্তরিক ধন্যবাদ। আপনার সন্তুষ্টিই আমাদের সবচেয়ে বড় প্রাপ্তি। আশা করি ভবিষ্যতেও আপনাকে আমাদের সাথে পেতে পারবো!',
        date: '8 months ago'
      }
    }
  ],
  ratingBreakdown: [
    { stars: 5, count: 1 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ],
  relatedProducts: [
    { id: 'r1', name: 'Spicy Muri Masala 300gram', price: 181, rating: 4.5, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&q=80' },
    { id: 'r2', name: 'Beef Pickle', price: 463, rating: 4.8, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80' },
    { id: 'r3', name: 'Ilish fish pickle', price: 278, rating: 4.2, image: 'https://images.unsplash.com/photo-1589187154184-995b8a4e740a?w=300&q=80' },
    { id: 'r4', name: 'Spicy Chicken Pickle', price: 367, rating: 4.6, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80' }
  ]
};

// ─── Helper Components ──────────────────────────────────────
const StarRating = ({ rating, size = 4 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-${size} h-${size} ${
          star <= Math.round(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 fill-gray-300'
        }`}
      />
    ))}
  </div>
);

const ProgressBar = ({ value, total, stars }) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1 w-12">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span className="text-gray-600">{stars}</span>
      </div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-500 text-xs">{value}</span>
    </div>
  );
};

// ─── WhatsApp Icon Component ────────────────────────────────
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Main Component ─────────────────────────────────────────
const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('500g');
  const [selectedSpicy, setSelectedSpicy] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const activeTab = 'details';
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const currentPrice = productData.variations.size.find(s => s.value === selectedSize)?.price || productData.price;
  const currentOriginalPrice = Math.round(currentPrice / (1 - productData.discountPercent / 100));

  const handleQuantity = (type) => {
    if (type === 'inc' && quantity < productData.stock) setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  // Image Zoom Handler
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ── Breadcrumb ───────────────────────────────────── */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <span className="hover:text-orange-600 cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-orange-600 cursor-pointer">Achar</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium truncate">{productData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ═══════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: Images with Zoom                     */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 cursor-crosshair"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                ref={imageRef}
              >
                <img 
                  src={productData.images[selectedImage]} 
                  alt={productData.name}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZoomed ? 'scale-[2.5]' : 'scale-100'
                  }`}
                  style={isZoomed ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                  } : {}}
                />
                
                {/* Zoom Hint */}
                {!isZoomed && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                    Hover to zoom
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2.5 rounded-full shadow-md transition-all ${
                      isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2.5 rounded-full bg-white/90 text-gray-600 hover:text-orange-600 shadow-md">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productData.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-orange-500 ring-2 ring-orange-100' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: Product Info (Full Width)           */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              {/* Title & Rating */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {productData.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  <span className="font-bold text-green-700">{productData.rating}</span>
                </div>
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {productData.totalRatings} Ratings
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">Brand: <span className="text-blue-600 hover:underline cursor-pointer">{productData.brand}</span></span>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                More <span className="text-blue-600 hover:underline cursor-pointer">{productData.category}</span> from <span className="text-blue-600 hover:underline cursor-pointer">{productData.brand}</span>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-orange-600">৳{currentPrice}</span>
                  <span className="text-lg text-gray-400 line-through">৳{currentOriginalPrice}</span>
                  <span className="text-sm font-medium text-white bg-orange-500 px-2 py-0.5 rounded-md">
                    -{productData.discountPercent}%
                  </span>
                </div>
              </div>

              {/* Variations */}
              <div className="space-y-4 mb-5">
                {/* Size */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {productData.variations.size.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => size.available && setSelectedSize(size.value)}
                        disabled={!size.available}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                          selectedSize === size.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : size.available
                            ? 'border-gray-200 hover:border-orange-300 text-gray-700'
                            : 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50 line-through'
                        }`}
                      >
                        {size.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spicy Level */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Spicy Level</p>
                  <div className="flex flex-wrap gap-2">
                    {productData.variations.spicyLevel.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => level.available && setSelectedSpicy(level.value)}
                        disabled={!level.available}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                          selectedSpicy === level.value
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : level.available
                            ? 'border-gray-200 hover:border-green-300 text-gray-700'
                            : 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
                        }`}
                      >
                        {level.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => handleQuantity('dec')}
                    className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                  <button 
                    onClick={() => handleQuantity('inc')}
                    className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                    disabled={quantity >= productData.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">{productData.stock} pieces available</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-200 transition-all active:scale-95">
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* WhatsApp Button - Full Width */}
              <a 
                href={`https://wa.me/8801XXXXXXXXX?text=I'm interested in ${productData.name} (${selectedSize}, ${selectedSpicy}) - ৳${currentPrice}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95"
              >
                <WhatsAppIcon />
                Order on WhatsApp
              </a>
            </div>

            {/* Delivery & Returns */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <h3 className="font-bold text-gray-800 mb-3">Delivery Options</h3>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Dhaka, Dhaka North, Banani</span>
                    <button className="text-sm text-blue-600 font-medium hover:underline">CHANGE</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Road No. 12 - 19</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Standard Delivery</p>
                      <p className="text-xs text-gray-500">Guaranteed by 9-12 May</p>
                    </div>
                    <span className="font-semibold text-gray-800">৳85</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 p-2 rounded-lg">
                    Spend at least ৳499 on <span className="text-blue-600 font-medium">JP Mart</span> to enjoy free shipping
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                  <span className="text-lg">💰</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Cash on Delivery Available</p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <h3 className="font-bold text-gray-800">Return & Warranty</h3>
                <div className="flex items-start gap-3">
                  <RefreshCcw className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-700">14 days easy return</p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-700">Warranty not available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Reviews */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-5 mb-5">
            <h3 className="font-bold text-gray-800 mb-6">
              Ratings & Reviews of {productData.name}
            </h3>

            <div className="flex flex-col sm:flex-row gap-8 mb-8">
              {/* Left: Overall Score */}
              <div className="text-center sm:text-left">
                <div className="flex items-baseline justify-center sm:justify-start gap-1">
                  <span className="text-5xl font-bold text-gray-900">{productData.rating}</span>
                  <span className="text-xl text-gray-400">/5</span>
                </div>
                <div className="flex justify-center sm:justify-start my-2">
                  <StarRating rating={productData.rating} size={5} />
                </div>
                <p className="text-sm text-gray-500">{productData.totalRatings} Ratings</p>
              </div>

              {/* Right: Breakdown */}
              <div className="flex-1 max-w-md space-y-1.5">
                {productData.ratingBreakdown.map((item) => (
                  <ProgressBar 
                    key={item.stars} 
                    stars={item.stars} 
                    value={item.count} 
                    total={productData.totalRatings} 
                  />
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="border-t border-gray-100 pt-6 ">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Product Reviews</h4>
                <div className="flex gap-3">
                  <button className="text-xs flex items-center gap-1 text-gray-600 hover:text-orange-600">
                    ↕ Sort: Relevance
                  </button>
                </div>
              </div>

              <div className="space-y-6 ">
                {productData.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{review.user}</p>
                          {review.isVerified && (
                            <span className="text-[10px] flex items-center gap-0.5 text-green-600">
                              <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>

                    <div className="mb-2">
                      <StarRating rating={review.rating} size={3} />
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {review.likes || 'Helpful?'}
                    </button>

                    {/* Seller Response */}
                    {review.sellerResponse && (
                      <div className="mt-4 ml-4 pl-4 border-l-2 border-orange-200 bg-orange-50/50 rounded-r-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                            <Store className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-bold text-gray-800">Seller Response</span>
                          <span className="text-[10px] text-gray-500">- {review.sellerResponse.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.sellerResponse.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Q&A Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-6">Questions about this product</h3>
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">There are no questions yet.</p>
              <p className="text-xs text-gray-400">
                <span className="text-blue-600 hover:underline cursor-pointer">Login</span> or <span className="text-blue-600 hover:underline cursor-pointer">Register</span> to ask the seller now and answer will show here.
              </p>
            </div>
          </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* BOTTOM SECTION: Details, Specs, Reviews, Q&A        */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="mt-8 space-y-6">
          
          {/* Tabs: Details & Specs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button className=" px-5 py-4 text-md font-bold  relative ">
                    Product Details
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"/>
                  
                </button>
                <div className="flex-1 relative ">
                    
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"/>
                  
                </div>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800">Product details of {productData.name}</h3>
                  <ul className="space-y-2">
                    {productData.description.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                        <span className="text-orange-500 mt-1.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {productData.description.join('\n')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          

          

          {/* ═══════════════════════════════════════════════════ */}
          {/* RELATED PRODUCTS (Moved to Bottom)                */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-6">You may also like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productData.relatedProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors mb-1">
                    {item.name}
                  </h4>
                  <p className="text-lg font-bold text-orange-600">৳{item.price}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;