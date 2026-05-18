import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/axios.js';
import { useCart, getAuthToken } from '../../componets/useCart.jsx';
import {
  getVariationStock,
  isVariationOutOfStock,
  isHtmlDescription,
  loadProductQuestions,
  saveProductQuestion,
} from '../../utils/productContent.js';

const WHATSAPP_NUMBER = '8801757121627';

const STAR_SIZES = {
  3: 'w-3 h-3',
  4: 'w-4 h-4',
  5: 'w-5 h-5',
};

const StarRating = ({ rating, size = 4 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${STAR_SIZES[size] || STAR_SIZES[4]} ${
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

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const isImageUrl = (src) =>
  src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:'));

const ProductDescription = ({ html }) => {
  if (!html?.trim()) {
    return <p className="text-sm text-gray-500">No description available for this product.</p>;
  }

  if (isHtmlDescription(html)) {
    return (
      <div
        className="product-description text-sm text-gray-700 leading-relaxed [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_em]:italic [&_a]:text-orange-600 [&_a]:underline [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="space-y-2">
      {String(html)
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, idx) => (
          <p key={idx} className="text-sm text-gray-700 leading-relaxed">
            {line}
          </p>
        ))}
    </div>
  );
};

const buildGallery = (product) => {
  if (!product) return [];
  const list = [];
  const main = product.image?.trim();
  if (main) list.push(main);
  for (const url of product.images || []) {
    const s = String(url).trim();
    if (s && !list.includes(s)) list.push(s);
  }
  return list;
};

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVar, setSelectedVar] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [actionLoading, setActionLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const imageRef = useRef(null);
  const isLoggedIn = Boolean(getAuthToken());

  const variations = product?.variations || [];
  const isFlashItem = Boolean(product?.isFlash || product?.status === 'flash');
  const gallery = useMemo(() => buildGallery(product), [product]);

  const displayPrice = selectedVar
    ? Number(selectedVar.price)
    : Number(product?.price || 0);

  const displayOldPrice = isFlashItem
    ? (selectedVar?.originalPrice ?? product?.oldPrice ?? null)
    : (product?.oldPrice || null);

  const discountPercent =
    displayOldPrice && displayOldPrice > displayPrice
      ? Math.round(((displayOldPrice - displayPrice) / displayOldPrice) * 100)
      : 0;

  const maxStock = useMemo(() => {
    const vs = getVariationStock(selectedVar);
    if (vs != null && vs > 0) return vs;
    const ps = Number(product?.stock);
    return Number.isFinite(ps) && ps > 0 ? ps : 0;
  }, [selectedVar, product?.stock]);

  const resolveVariationForCart = () => {
    if (variations.length === 0) return null;
    if (selectedVar?.id) return selectedVar;
    return variations[0];
  };

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError('Product not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(`/home/product/${productId}`);
      const p = data?.product;
      if (!p) {
        setError('Product not found.');
        setProduct(null);
        return;
      }

      setProduct(p);
      setRelatedProducts(Array.isArray(data.relatedProducts) ? data.relatedProducts : []);

      const vars = p.variations || [];
      setSelectedVar(vars.length > 0 ? vars[0] : null);
      setSelectedImage(0);
      setQuantity(1);
    } catch {
      setError('Could not load this product. Please try again.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (productId) {
      setQuestions(loadProductQuestions(productId));
    }
  }, [productId]);

  useEffect(() => {
    if (selectedVar?.image && isImageUrl(selectedVar.image)) {
      const idx = gallery.indexOf(selectedVar.image);
      if (idx >= 0) setSelectedImage(idx);
    }
  }, [selectedVar, gallery]);

  const handleSelectVariation = (v) => {
    if (!v?.id) return;
    setSelectedVar(v);
    if (v.image && isImageUrl(v.image)) {
      const idx = gallery.indexOf(v.image);
      if (idx >= 0) setSelectedImage(idx);
    }
    setQuantity(1);
  };

  const handleQuantity = (type) => {
    const limit = maxStock > 0 ? maxStock : 99;
    if (type === 'inc' && quantity < limit) setQuantity((q) => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const cartOptions = { isFlashSale: isFlashItem, openCart: true };

  const handleAddToCart = async () => {
    if (!product || actionLoading) return;
    const varToUse = resolveVariationForCart();
    if (variations.length > 0 && !varToUse) {
      toast.error('Please select a variation.');
      return;
    }
    if (varToUse && isVariationOutOfStock(varToUse, product.stock)) {
      toast.error('This variation is out of stock.');
      return;
    }
    setActionLoading(true);
    await addToCart(product, varToUse, quantity, cartOptions);
    setActionLoading(false);
  };

  const handleBuyNow = async () => {
    if (!product || actionLoading) return;
    const varToUse = resolveVariationForCart();
    if (variations.length > 0 && !varToUse) {
      toast.error('Please select a variation.');
      return;
    }
    if (varToUse && isVariationOutOfStock(varToUse, product.stock)) {
      toast.error('This variation is out of stock.');
      return;
    }
    setActionLoading(true);
    const ok = await addToCart(product, varToUse, quantity, { ...cartOptions, openCart: false });
    setActionLoading(false);
    if (!ok) return;

    const checkoutPrice = varToUse ? Number(varToUse.price) : Number(product.price);
    navigate('/checkout', {
      state: {
        buyNow: true,
        product: {
          id: product.id,
          name: product.name,
          image: varToUse?.image || product.image,
          price: checkoutPrice,
          variation: varToUse ? varToUse.label : null,
          isFlashSale: isFlashItem,
          qty: quantity,
        },
      },
    });
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const productUrl = `${window.location.origin}/product-details?id=${product.id}`;
    const varText = selectedVar ? ` (${selectedVar.label} - ৳${selectedVar.price})` : '';
    const msg = [
      "Hello! I'd like to order:",
      '',
      `🛒 ${product.name}${varText}`,
      `🔗 ${productUrl}`,
      '',
      'Please let me know the details.',
    ].join('\n');
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const mainImage =
    (selectedVar?.image && isImageUrl(selectedVar.image) ? selectedVar.image : null) ||
    gallery[selectedImage] ||
    product?.image ||
    '';
  const showImageZoom = isImageUrl(mainImage);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    const text = questionText.trim();
    if (!text) return;

    setQuestionSubmitting(true);
    const entry = {
      id: Date.now(),
      user: 'You',
      question: text,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      answer: null,
    };
    const next = saveProductQuestion(productId, entry);
    setQuestions(next);
    setQuestionText('');
    setQuestionSubmitting(false);
    toast.success('Your question has been submitted.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
        <p className="text-gray-700 mb-4">{error || 'Product not found.'}</p>
        <Link to="/" className="text-orange-600 font-semibold hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const categoryName = product.category?.name || 'Products';
  const brandLabel = product.brand?.trim() || 'HBC Achar Shop';
  const rating = Number(product.rating) || 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="hover:text-orange-600 cursor-default">{categoryName}</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 sticky top-24">
              <div
                className={`relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 ${
                  showImageZoom ? 'cursor-crosshair' : ''
                }`}
                onMouseEnter={() => showImageZoom && setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={showImageZoom ? handleMouseMove : undefined}
                ref={imageRef}
              >
                {isImageUrl(mainImage) ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-200 ${
                      isZoomed ? 'scale-[2.5]' : 'scale-100'
                    }`}
                    style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    {mainImage || '🫙'}
                  </div>
                )}

                {showImageZoom && !isZoomed && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                    Hover to zoom
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2.5 rounded-full shadow-md transition-all ${
                      isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    className="p-2.5 rounded-full bg-white/90 text-gray-600 hover:text-orange-600 shadow-md"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {isFlashItem && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    FLASH SALE
                  </span>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-orange-500 ring-2 ring-orange-100'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {isImageUrl(img) ? (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-2xl bg-gray-50">
                          {img || '🫙'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h1 className="heading-product-name text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                {rating > 0 && (
                  <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-green-600 fill-green-600" />
                    <span className="font-bold text-green-700">{rating.toFixed(1)}</span>
                  </div>
                )}
                {product.sold > 0 && (
                  <span className="text-sm text-gray-500">{product.sold} sold</span>
                )}
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">
                  Brand: <span className="text-blue-600">{brandLabel}</span>
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Category: <span className="text-blue-600">{categoryName}</span>
                {product.sku && (
                  <span className="ml-3 text-gray-400">SKU: {product.sku}</span>
                )}
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-orange-600">৳{displayPrice}</span>
                  {displayOldPrice && displayOldPrice > displayPrice && (
                    <span className="text-lg text-gray-400 line-through">৳{displayOldPrice}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-sm font-medium text-white bg-orange-500 px-2 py-0.5 rounded-md">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {variations.length > 0 && (
                <div className="space-y-4 mb-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-700">Select variation</p>
                      {selectedVar && (
                        <span className="text-xs text-orange-600 font-medium truncate max-w-[50%]">
                          Selected: {selectedVar.label}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2" role="listbox" aria-label="Product variations">
                      {variations.map((v) => {
                        const isSelected = String(selectedVar?.id) === String(v.id);
                        const outOfStock = isVariationOutOfStock(v, product.stock);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleSelectVariation(v)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-200 shadow-sm'
                                : outOfStock
                                ? 'border-gray-200 bg-gray-50 text-gray-500 hover:border-orange-300'
                                : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50/50 text-gray-700'
                            }`}
                          >
                            <span className="block">{v.label}</span>
                            <span className={`block text-xs mt-0.5 ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
                              ৳{v.price}
                              {outOfStock && ' · Out of stock'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleQuantity('dec')}
                    className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantity('inc')}
                    className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                    disabled={maxStock > 0 && quantity >= maxStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {maxStock > 0 ? `${maxStock} available` : product.status === 'outstock' ? 'Out of stock' : 'In stock'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={actionLoading || product.status === 'outstock'}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-200 transition-all active:scale-95 disabled:opacity-60"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={actionLoading || product.status === 'outstock'}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-60"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95"
              >
                <WhatsAppIcon />
                Order on WhatsApp
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <h3 className="font-bold text-gray-800 mb-3">Delivery Options</h3>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Delivery across Bangladesh</p>
                  <p className="text-xs text-gray-500 mt-0.5">Enter your address at checkout</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Standard Delivery</p>
                  <p className="text-xs text-gray-500">Shipping fee calculated at checkout</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">💰</span>
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
                  <p className="text-sm text-gray-700">Quality guaranteed homemade products</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-5 mb-5">
          <h3 className="font-bold text-gray-800 mb-6">
            Ratings & Reviews of <span className="heading-product-name">{product.name}</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-8 mb-8">
            <div className="text-center sm:text-left">
              <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <span className="text-5xl font-bold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-xl text-gray-400">/5</span>
              </div>
              <div className="flex justify-center sm:justify-start my-2">
                <StarRating rating={rating} size={5} />
              </div>
              <p className="text-sm text-gray-500">Based on store rating</p>
            </div>

            <div className="flex-1 max-w-md space-y-1.5">
              {[5, 4, 3, 2, 1].map((stars) => (
                <ProgressBar
                  key={stars}
                  stars={stars}
                  value={stars === Math.round(rating) && rating > 0 ? 1 : 0}
                  total={rating > 0 ? 1 : 0}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 text-center py-6">
            <p className="text-sm text-gray-500">No customer reviews yet for this product.</p>
            <button type="button" className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-600 transition-colors mx-auto">
              <ThumbsUp className="w-3.5 h-3.5" />
              Be the first to review
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Questions about this product</h3>

          {isLoggedIn ? (
            <form onSubmit={handleSubmitQuestion} className="mb-6">
              <label htmlFor="product-question" className="block text-sm font-medium text-gray-700 mb-1.5">
                Your question
              </label>
              <textarea
                id="product-question"
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask about ingredients, size, delivery, spice level..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none"
              />
              <button
                type="submit"
                disabled={questionSubmitting || !questionText.trim()}
                className="mt-3 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
              >
                {questionSubmitting ? 'Submitting...' : 'Submit question'}
              </button>
            </form>
          ) : (
            <div className="mb-6 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-5 text-center">
              <HelpCircle className="w-10 h-10 text-orange-300 mx-auto mb-2" />
              <p className="text-sm text-gray-700 mb-3">
                Please login to ask a question about this product.
              </p>
              <Link
                to="/login"
                state={{ from: `/product-details?id=${productId}` }}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {questions.length > 0 ? (
            <div className="space-y-4 border-t border-gray-100 pt-4">
              {questions.map((q) => (
                <div key={q.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {(q.user || 'Q').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-800">{q.user || 'Customer'}</p>
                        <span className="text-xs text-gray-400 shrink-0">{q.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{q.question}</p>
                      {q.answer ? (
                        <div className="mt-3 ml-2 pl-3 border-l-2 border-orange-200 bg-orange-50/60 rounded-r-lg p-3">
                          <p className="text-xs font-bold text-gray-700 mb-1">Seller answer</p>
                          <p className="text-sm text-gray-700">{q.answer}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2 italic">Waiting for seller response</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border-t border-gray-100">
              <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {isLoggedIn
                  ? 'No questions yet. Be the first to ask!'
                  : 'No questions yet.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button type="button" className="px-5 py-4 text-md font-bold relative">
                Product Details
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              </button>
              <div className="flex-1 relative">
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                Product details of <span className="heading-product-name">{product.name}</span>
              </h3>
              <ProductDescription html={product.description} />
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-6">You may also like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(`/product-details?id=${item.id}`)}
                    className="group text-left p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {isImageUrl(item.image) ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-5xl">
                          {item.image || '🫙'}
                        </span>
                      )}
                    </div>
                    <h4 className="heading-product-name text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors mb-1">
                      {item.name}
                    </h4>
                    <p className="text-lg font-bold text-orange-600">৳{item.price}</p>
                    {item.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">{item.rating}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
