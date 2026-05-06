// pages/CategoryProducts.jsx
import  { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Star, 
  ShoppingCart, 
  SlidersHorizontal,
  Flame,
  Package
} from 'lucide-react';

// ─── Mock Data (Achar Products) ─────────────────────────────
const mockProducts = [
  {
    _id: '1',
    name: 'Mango Achar (Kacha)',
    category: 'Oil-based',
    price: 250,
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80',
    isBestSeller: true,
    createdAt: '2026-04-15',
    variations: [
      { size: '250g', price: 250, spicyLevel: 'Medium' },
      { size: '500g', price: 450, spicyLevel: 'High' },
      { size: '1kg', price: 850, spicyLevel: 'Medium' }
    ]
  },
  {
    _id: '2',
    name: 'Lemon Achar (Dry)',
    category: 'Dry achar',
    price: 180,
    rating: 4.2,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=500&q=80',
    isBestSeller: false,
    createdAt: '2026-05-01',
    variations: [
      { size: '250g', price: 180, spicyLevel: 'Low' },
      { size: '500g', price: 320, spicyLevel: 'Medium' }
    ]
  },
  {
    _id: '3',
    name: 'Chili Achar (Jhal)',
    category: 'Oil-based',
    price: 150,
    rating: 4.8,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1589187154184-995b8a4e740a?w=500&q=80',
    isBestSeller: true,
    createdAt: '2026-03-20',
    variations: [
      { size: '250g', price: 150, spicyLevel: 'High' },
      { size: '500g', price: 280, spicyLevel: 'High' },
      { size: '1kg', price: 520, spicyLevel: 'High' }
    ]
  },
  {
    _id: '4',
    name: 'Mixed Vegetable Achar',
    category: 'Oil-based',
    price: 300,
    rating: 3.9,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80',
    isBestSeller: false,
    createdAt: '2026-04-28',
    variations: [
      { size: '500g', price: 300, spicyLevel: 'Medium' },
      { size: '1kg', price: 550, spicyLevel: 'Low' }
    ]
  },
  {
    _id: '5',
    name: 'Tamarind Achar (Tetul)',
    category: 'Dry achar',
    price: 200,
    rating: 4.0,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&q=80',
    isBestSeller: false,
    createdAt: '2026-02-10',
    variations: [
      { size: '250g', price: 200, spicyLevel: 'Medium' },
      { size: '500g', price: 380, spicyLevel: 'Medium' }
    ]
  },
  {
    _id: '6',
    name: 'Garlic Achar (Roshun)',
    category: 'Oil-based',
    price: 350,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80',
    isBestSeller: true,
    createdAt: '2026-05-05',
    variations: [
      { size: '250g', price: 350, spicyLevel: 'High' },
      { size: '1kg', price: 1200, spicyLevel: 'High' }
    ]
  }
];

// ─── Filter Constants ───────────────────────────────────────
const SUBCATEGORIES = ['Oil-based', 'Dry achar'];
const SIZES = ['250g', '500g', '1kg'];
const SPICY_LEVELS = ['Low', 'Medium', 'High'];
const PRICE_RANGES = [
  { label: '৳100 – ৳500', min: 100, max: 500 },
  { label: '৳500 – ৳1000', min: 500, max: 1000 },
  { label: '৳1000+', min: 1000, max: 99999 }
];
const RATING_FILTERS = [
  { label: '4★ & above', value: 4 },
  { label: '3★ & above', value: 3 }
];
const SORT_OPTIONS = [
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Latest Products', value: 'latest' },
  { label: 'Best Selling', value: 'bestseller' },
  { label: 'Top Rated', value: 'rated' }
];

// ─── Debounce Hook ──────────────────────────────────────────
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Main Component ─────────────────────────────────────────
const CategoryProducts = () => {
  // ── Filter States ────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSpicyLevels, setSelectedSpicyLevels] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ── Handlers ─────────────────────────────────────────────
  const toggleArrayFilter = (setter, current, value) => {
    setter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSelectedSubcategories([]);
    setSelectedRating(null);
    setSelectedPriceRange(null);
    setSelectedSizes([]);
    setSelectedSpicyLevels([]);
    setSortBy('latest');
  };

  const activeFilterCount = 
    selectedSubcategories.length + 
    (selectedRating ? 1 : 0) + 
    (selectedPriceRange ? 1 : 0) + 
    selectedSizes.length + 
    selectedSpicyLevels.length +
    (debouncedSearch ? 1 : 0);

  // ── Filter Logic (Frontend simulation of backend queries) ─
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // 1. Search Filter
    // Backend: name: { $regex: search, $options: "i" }
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // 2. Subcategory Filter
    if (selectedSubcategories.length > 0) {
      result = result.filter(p => selectedSubcategories.includes(p.category));
    }

    // 3. Rating Filter
    // Backend: rating: { $gte: selectedRating }
    if (selectedRating) {
      result = result.filter(p => p.rating >= selectedRating);
    }

    // 4. Price Range Filter
    // Backend: price: { $gte: min, $lte: max }
    if (selectedPriceRange) {
      result = result.filter(p => 
        p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
      );
    }

    // 5. Variation Filters
    // Backend: "variations.size": { $in: selectedSizes }
    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.variations.some(v => selectedSizes.includes(v.size))
      );
    }
    // Backend: "variations.spicyLevel": { $in: selectedSpicyLevels }
    if (selectedSpicyLevels.length > 0) {
      result = result.filter(p => 
        p.variations.some(v => selectedSpicyLevels.includes(v.spicyLevel))
      );
    }

    // ── Sorting ────────────────────────────────────────────
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'bestseller':
        result.sort((a, b) => (b.isBestSeller === a.isBestSeller) ? 0 : b.isBestSeller ? 1 : -1);
        break;
      case 'rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [
    debouncedSearch, 
    selectedSubcategories, 
    selectedRating, 
    selectedPriceRange, 
    selectedSizes, 
    selectedSpicyLevels, 
    sortBy
  ]);

  // ── Filter Sidebar Component ─────────────────────────────
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters Badge */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between bg-orange-50 p-3 rounded-lg border border-orange-200">
          <span className="text-sm font-medium text-orange-800">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </span>
          <button 
            onClick={clearAllFilters}
            className="text-xs text-orange-600 hover:text-orange-800 underline font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Search Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Search className="w-4 h-4" /> Search
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. mango achar..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">Instant search with debounce (500ms)</p>
      </div>

      {/* Subcategory Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Package className="w-4 h-4" /> Subcategory
        </h3>
        <div className="space-y-1.5">
          {SUBCATEGORIES.map(sub => (
            <label key={sub} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedSubcategories.includes(sub)}
                onChange={() => toggleArrayFilter(setSelectedSubcategories, selectedSubcategories, sub)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-700 group-hover:text-orange-700 transition-colors">{sub}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Star className="w-4 h-4" /> Rating
        </h3>
        <div className="space-y-1.5">
          {RATING_FILTERS.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === value}
                onChange={() => setSelectedRating(value)}
                className="w-4 h-4 border-gray-300 text-orange-500 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
          {selectedRating && (
            <button 
              onClick={() => setSelectedRating(null)}
              className="text-xs text-orange-600 hover:underline mt-1"
            >
              Clear rating
            </button>
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Price Range
        </h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selectedPriceRange?.label === range.label}
                onChange={() => setSelectedPriceRange(range)}
                className="w-4 h-4 border-gray-300 text-orange-500 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
          {selectedPriceRange && (
            <button 
              onClick={() => setSelectedPriceRange(null)}
              className="text-xs text-orange-600 hover:underline mt-1"
            >
              Clear price
            </button>
          )}
        </div>
      </div>

      {/* Variation: Size Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Package className="w-4 h-4" /> Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggleArrayFilter(setSelectedSizes, selectedSizes, size)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedSizes.includes(size)
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Variation: Spicy Level Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Flame className="w-4 h-4" /> Spicy Level
        </h3>
        <div className="flex flex-wrap gap-2">
          {SPICY_LEVELS.map(level => (
            <button
              key={level}
              onClick={() => toggleArrayFilter(setSelectedSpicyLevels, selectedSpicyLevels, level)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedSpicyLevels.includes(level)
                  ? 'bg-green-500 text-white border-green-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      {/* Header / Breadcrumb Area */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Achar Collection</h1>
              <p className="text-sm text-gray-500 mt-1">Authentic homemade pickles & preserves</p>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-sm font-medium cursor-pointer shadow-sm"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          
          {/* ─── Desktop Sidebar Filters ──────────────────────── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                <Filter className="w-5 h-5 text-orange-500" />
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* ─── Product Grid Area ────────────────────────────── */}
          <main className="flex-1 min-w-0">
            
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
              </p>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map(product => (
                  <div 
                    key={product._id} 
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.isBestSeller && (
                        <span className="absolute top-3 left-3 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Best Seller
                        </span>
                      )}
                      <button className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-50">
                        <ShoppingCart className="w-4 h-4 text-orange-600" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-orange-700 transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-xs text-gray-500 mb-3">{product.category}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex items-center bg-green-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                          <span className="text-xs font-bold text-green-700 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
                      </div>

                      {/* Variations Preview */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.variations.map((v, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] px-2 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-100"
                          >
                            {v.size} • {v.spicyLevel}
                          </span>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
                          <span className="text-xs text-gray-400 ml-1">/starting</span>
                        </div>
                        <button className="bg-linear-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-md shadow-orange-200 transition-all active:scale-95">
                          View Options
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ─── Mobile Sticky Filter Button ────────────────────── */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-medium active:scale-95 transition-transform"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ─── Mobile Filter Drawer ───────────────────────────── */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 pb-32">
              <FilterContent />
            </div>

            {/* Mobile Drawer Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-orange-400 to-orange-500 text-white font-medium shadow-lg shadow-orange-200"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CategoryProducts;