// pages/CategoryProducts.jsx
import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Star, 
  SlidersHorizontal,
  Flame,
  Package
} from 'lucide-react';
import api from '../../api/axios.js';
import ProductCard from '../../componets/ProductCard.jsx';

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
    if (!delay || delay <= 0) {
      setDebounced(value);
      return;
    }
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const flush = (nextValue) => {
    setDebounced(nextValue);
  };

  return [debounced, flush];
}

const normalizeKey = (val) =>
  String(val || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');

const collectVarAttrValues = (variation, matcher) => {
  const out = new Set();

  const attrs = variation?.attributes;
  if (attrs && typeof attrs === 'object') {
    for (const [k, v] of Object.entries(attrs)) {
      if (!matcher.test(String(k))) continue;
      const value = String(v || '').trim();
      if (value) out.add(value);
    }
  }

  const combo = Array.isArray(variation?.combination) ? variation.combination : [];
  for (const item of combo) {
    const k = normalizeKey(item?.attributeName);
    if (!matcher.test(k)) continue;
    const value = String(item?.value || '').trim();
    if (value) out.add(value);
  }

  return Array.from(out);
};

// ─── Main Component ─────────────────────────────────────────
const CategoryProducts = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categorySlug = String(searchParams.get('category') || '').trim();

  const [products, setProducts] = useState([]);
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // ── Filter States ────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, flushDebouncedSearch] = useDebounce(searchInput, 500);
  
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSpicyLevels, setSelectedSpicyLevels] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const resetAllFilters = () => {
    setSearchInput('');
    flushDebouncedSearch('');
    setSelectedSubcategories([]);
    setSelectedRating(null);
    setSelectedPriceRange(null);
    setSelectedSizes([]);
    setSelectedSpicyLevels([]);
    setSortBy('latest');
    setIsMobileFilterOpen(false);
  };

  useEffect(() => {
    let alive = true;

    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        const rows = Array.isArray(res?.data) ? res.data : [];
        const mapped = rows
          .filter((c) => String(c?.status || '').toLowerCase() !== 'inactive')
          .map((c) => ({
            name: c?.name ? String(c.name) : 'Category',
            slug: c?.slug ? String(c.slug) : '',
          }))
          .filter((c) => c.slug);
        if (!alive) return;
        setCategories(mapped);
      } catch {
        if (!alive) return;
        setCategories([]);
      }
    };

    loadCategories();
    return () => {
      alive = false;
    };
  }, []);

  useLayoutEffect(() => {
    setLoading(true);
    setLoadError('');
    setProducts([]);
    setCategoryMeta(null);
    setSubcategories([]);
    resetAllFilters();
  }, [categorySlug]);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        const productsUrl = categorySlug
          ? `/home/products?category=${encodeURIComponent(categorySlug)}`
          : '/home/products';
        const subUrl = categorySlug
          ? `/home/subcategories?category=${encodeURIComponent(categorySlug)}`
          : '/home/subcategories';

        setLoading(true);
        setLoadError('');
        const [prodRes, subRes] = await Promise.all([api.get(productsUrl), api.get(subUrl)]);
        if (!alive) return;

        const list = Array.isArray(prodRes?.data?.products) ? prodRes.data.products : [];
        setProducts(list);
        setCategoryMeta(prodRes?.data?.category || null);

        const subList = Array.isArray(subRes?.data?.subcategories) ? subRes.data.subcategories : [];
        setSubcategories(subList);
      } catch (err) {
        if (!alive) return;
        setProducts([]);
        setCategoryMeta(null);
        setSubcategories([]);
        setLoadError(err?.response?.data?.message || 'Failed to load products.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [categorySlug]);

  const availableSubcategories = useMemo(() => {
    return (subcategories || [])
      .map((s) => ({
        slug: String(s?.slug || '').trim(),
        name: String(s?.name || '').trim(),
      }))
      .filter((s) => s.slug && s.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [subcategories]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    const matcher = /(size|weight|pack|qty|quantity)/i;
    for (const p of products) {
      for (const v of p?.variations || []) {
        for (const val of collectVarAttrValues(v, matcher)) set.add(val);
      }
    }
    return Array.from(set);
  }, [products]);

  const availableSpicyLevels = useMemo(() => {
    const set = new Set();
    const matcher = /(spicy)/i;
    for (const p of products) {
      for (const v of p?.variations || []) {
        for (const val of collectVarAttrValues(v, matcher)) set.add(val);
      }
    }
    return Array.from(set);
  }, [products]);

  useEffect(() => {
    if (loading) return;

    const validSub = new Set(availableSubcategories.map((s) => s.slug));
    const validSizes = new Set(availableSizes);
    const validSpicy = new Set(availableSpicyLevels);

    setSelectedSubcategories((prev) => prev.filter((v) => validSub.has(v)));
    setSelectedSizes((prev) => prev.filter((v) => validSizes.has(v)));
    setSelectedSpicyLevels((prev) => prev.filter((v) => validSpicy.has(v)));
  }, [loading, availableSubcategories, availableSizes, availableSpicyLevels]);

  // ── Handlers ─────────────────────────────────────────────
  const toggleArrayFilter = (setter, current, value) => {
    setter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    resetAllFilters();
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
    let result = [...products];

    // 1. Search Filter
    // Backend: name: { $regex: search, $options: "i" }
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        String(p?.name || '').toLowerCase().includes(query) ||
        String(p?.category?.name || '').toLowerCase().includes(query) ||
        String(p?.subCategory?.name || '').toLowerCase().includes(query) ||
        String(p?.brand || '').toLowerCase().includes(query)
      );
    }

    // 2. Subcategory Filter
    if (selectedSubcategories.length > 0) {
      result = result.filter(p => selectedSubcategories.includes(String(p?.subCategory?.slug || '')));
    }

    // 3. Rating Filter
    // Backend: rating: { $gte: selectedRating }
    if (selectedRating) {
      result = result.filter(p => Number(p?.rating || 0) >= selectedRating);
    }

    // 4. Price Range Filter
    // Backend: price: { $gte: min, $lte: max }
    if (selectedPriceRange) {
      result = result.filter(p => 
        Number(p?.price || 0) >= selectedPriceRange.min && Number(p?.price || 0) <= selectedPriceRange.max
      );
    }

    // 5. Variation Filters
    // Backend: "variations.size": { $in: selectedSizes }
    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        (p?.variations || []).some(v => {
          const values = collectVarAttrValues(v, /(size|weight|pack|qty|quantity)/i);
          return values.some((val) => selectedSizes.includes(val));
        })
      );
    }
    // Backend: "variations.spicyLevel": { $in: selectedSpicyLevels }
    if (selectedSpicyLevels.length > 0) {
      result = result.filter(p => 
        (p?.variations || []).some(v => {
          const values = collectVarAttrValues(v, /(spicy)/i);
          return values.some((val) => selectedSpicyLevels.includes(val));
        })
      );
    }

    // ── Sorting ────────────────────────────────────────────
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
        break;
      case 'latest':
        result.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
        break;
      case 'bestseller':
        result.sort((a, b) => Number(b?.sold || 0) - Number(a?.sold || 0));
        break;
      case 'rated':
        result.sort((a, b) => Number(b?.rating || 0) - Number(a?.rating || 0));
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

  // ── Filter sidebar (render fn — not a nested component; satisfies react-hooks/static-components)
  const renderFilterContent = () => (
    <div className="space-y-6">
      {categories.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-4 h-4" /> Category
          </h3>
          <div className="relative">
            <select
              value={categorySlug}
              onChange={(e) => {
                const next = String(e.target.value || '').trim();
                if (!next) {
                  navigate('/category-products');
                  return;
                }
                navigate(`/category-products?category=${encodeURIComponent(next)}`);
              }}
              className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-sm font-medium cursor-pointer shadow-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      )}

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
          <Search className="w-4 h-4" /> {t('categoryProducts.search')}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder={t('categoryProducts.searchPlaceholder')}
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
        <p className="text-xs text-gray-500">{t('categoryProducts.searchHint')}</p>
      </div>

      {/* Subcategory Filter */}
      {availableSubcategories.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-4 h-4" /> {t('categoryProducts.subcategory')}
          </h3>
          <div className="space-y-1.5">
            {availableSubcategories.map(sub => (
              <label key={sub.slug} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSubcategories.includes(sub.slug)}
                  onChange={() => toggleArrayFilter(setSelectedSubcategories, selectedSubcategories, sub.slug)}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-orange-700 transition-colors">{sub.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Star className="w-4 h-4" /> {t('categoryProducts.rating')}
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
          <SlidersHorizontal className="w-4 h-4" /> {t('categoryProducts.priceRange')}
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
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-4 h-4" /> {t('categoryProducts.size')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(size => (
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
      )}

      {/* Variation: Spicy Level Filter */}
      {availableSpicyLevels.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Flame className="w-4 h-4" /> {t('categoryProducts.spicyLevel')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSpicyLevels.map(level => (
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen ">
      {/* Header / Breadcrumb Area */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {categoryMeta?.name || t('categoryProducts.title')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{t('categoryProducts.subtitle')}</p>
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
                <h2 className="text-lg font-bold text-gray-800">{t('categoryProducts.filters')}</h2>
                <Filter className="w-5 h-5 text-orange-500" />
              </div>
              {renderFilterContent()}
            </div>
          </aside>

          {/* ─── Product Grid Area ────────────────────────────── */}
          <main className="flex-1 min-w-0">
            
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {loading ? 'Loading…' : t('categoryProducts.showing', { count: filteredProducts.length })}
              </p>
            </div>

            {/* Grid */}
            {loadError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{loadError}</h3>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="py-10 text-sm text-gray-500">Loading products…</div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map(product => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} flashSale={Boolean(product?.isFlash || product?.status === 'flash')} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t('categoryProducts.noProducts')}</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                  {t('categoryProducts.clearFilters')}
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
          {t('categoryProducts.filters')}
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
              <h2 className="text-lg font-bold text-gray-800">{t('categoryProducts.filters')}</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 pb-32">
              {renderFilterContent()}
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
