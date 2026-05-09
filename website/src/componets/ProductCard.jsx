import { useState } from 'react';
import { useNavigate } from "react-router";

const ProductCardStarRating = ({ rating, reviewCount = 0 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-orange-400' : 'text-emerald-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-[10px] text-emerald-500 font-medium ml-1">({reviewCount})</span>
  </div>
);

const ProductCardSoldBadge = ({ sold }) => (
  <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-100/90 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-orange-200 backdrop-blur-sm">
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    {sold}+ Sold
  </div>
);

const ProductCard = ({ product }) => {
  const [selectedVar, setSelectedVar] = useState(product.variations?.[0] || null);
  const [showVariations, setShowVariations] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleVarSelect = (variation) => {
    setSelectedVar(variation);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowVariations(false);
    }, 1500);
  };

  const whatsappLink = `https://wa.me/8801712345678?text=Hi! I want to order ${encodeURIComponent(product.name)} ${selectedVar ? `(${selectedVar.label})` : ''}`;

  return (
     <div className='flex flex-col'>
      <div className='card'>
        <div className="group bg-white rounded-2xl border border-emerald-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 overflow-hidden flex flex-col">
          
          {/* Image Area */}
            <div className="relative bg-linear-to-br from-emerald-50 to-orange-50 p-6 flex items-center justify-center aspect-square">
              <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                {product.image}
              </span>
              
              {/* Badges - Left Side */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    NEW
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Sold Badge - Top Right */}
              {product.sold && <ProductCardSoldBadge sold={product.sold} />}
            </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-emerald-900 text-sm mb-1 line-clamp-1 group-hover:text-orange-600 transition">
              {product.name}
            </h3>
            
            <ProductCardStarRating rating={product.rating} reviewCount={product.reviews || 0} />
            
            {/* Price */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <span className="text-lg font-bold text-orange-500">৳{selectedVar ? selectedVar.price : product.price}</span>
              {product.oldPrice && (
                <span className="text-xs text-emerald-400 line-through">৳{product.oldPrice}</span>
              )}
            </div>

            
    {/* ✅ Added Success Message */}
            {added && (
              <div className="mb-3 bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 flex items-center gap-2 animate-fadeIn">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-emerald-700 font-bold">Added to cart!</span>
              </div>
            )}

          

            {/* 3 Buttons Row */}
            <div className="mt-auto flex gap-2">
              
              {/* Left - Buy Now */}
              <button onClick={() => navigate("/checkout")}  className="cursor-pointer flex-1 py-2.5 rounded-xl font-bold text-[10px] transition-all duration-200 bg-linear-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-200 hover:shadow-lg flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Buy Now
              </button>

              {/* Middle - WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition flex items-center justify-center"
                title="Order via WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              {/* Right - Add to Cart (Variation Toggle) */}
              <button
                onClick={() => setShowVariations(!showVariations)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] transition-all duration-200 flex items-center justify-center gap-1 ${
                  showVariations
                    ? 'bg-orange-100 text-orange-600 border-2 border-orange-300'
                    : 'bg-linear-to-r from-orange-400 to-amber-500 text-white hover:from-orange-500 hover:to-amber-600 shadow-md shadow-orange-200 hover:shadow-lg'
                }`}
              >
                
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
                  
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 🎯 VARIATION LIST - Add to Cart button এর সাথেই */}
      {showVariations && <div class="variation-list">
        {showVariations && product.variations?.length > 0 && (
          <div className="mb-3 bg-orange-50 absolute z-50 w-62.5 -t-[50px] rounded-xl border border-orange-100 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-orange-100/50 border-b border-orange-100">
              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Select Size</p>
              <button 
                onClick={() => setShowVariations(false)}
                className="p-0.5 hover:bg-orange-200 rounded-full transition text-orange-400"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* All Variations - No Scroll, Direct Show */}
            <div className="p-2 space-y-1">
              {product.variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVarSelect(v)}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold border transition flex items-center justify-between ${
                    selectedVar?.id === v.id && added
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-emerald-800 border-emerald-100 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    {v.label}
                  </span>
                  <span className="text-orange-500">৳{v.price}</span>
                </button>
              ))}
            </div>
            
            {/* Quick quantity hint */}
            <p className="text-[9px] text-orange-400 text-center pb-2">Click to add directly to cart</p>
          </div>
        )}
        </div>}
        
    </div>
  );
};

export default ProductCard;