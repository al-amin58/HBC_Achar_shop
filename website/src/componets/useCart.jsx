/**
 * Cart — MongoDB via /api/cart (login required to add)
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import api from '../api/axios';

const CartContext = createContext(null);
const PENDING_CART_KEY = 'hbc_pending_cart';

export const getAuthToken = () => localStorage.getItem('token');

const isFlashProduct = (product, variation, options = {}) =>
  Boolean(
    options.isFlashSale ??
      product?.isFlash ??
      product?.status === 'flash' ??
      variation?.flashSale
  );

/** Flash sale = discountPrice; normal = variation.price or product.price */
const resolveCartPrice = (product, variation, options = {}) => {
  const flash = isFlashProduct(product, variation, options);

  if (variation) {
    // API already sets variation.price = flash price for flash products
    const fromVariation = Number(variation.price);
    if (Number.isFinite(fromVariation) && fromVariation >= 0) return fromVariation;

    if (flash) {
      const flashFromDiscount = Number(variation.discountPrice);
      if (Number.isFinite(flashFromDiscount) && flashFromDiscount >= 0) {
        return flashFromDiscount;
      }
      const productFlash = Number(product?.price);
      if (Number.isFinite(productFlash) && productFlash >= 0) return productFlash;
    }
  }

  const base = Number(product?.price);
  return Number.isFinite(base) ? base : 0;
};

const resolveOldPrice = (product, variation, options = {}) => {
  const flash = isFlashProduct(product, variation, options);
  if (variation?.originalPrice != null && flash) {
    return Number(variation.originalPrice) || null;
  }
  return product?.oldPrice ?? product?.originalPrice ?? null;
};

const buildAddPayload = (product, variation, qty, options = {}) => {
  const flash = isFlashProduct(product, variation, options);
  const price = resolveCartPrice(product, variation, options);

  return {
    productId: product?.id,
    variationId: variation?.id || null,
    name: product?.name || 'Product',
    image: variation?.image || product?.image || '',
    price,
    oldPrice: resolveOldPrice(product, variation, options),
    variationLabel: variation?.label || '',
    isFlashSale: flash,
    qty,
  };
};

const savePendingCart = (product, variation, qty, options = {}) => {
  try {
    sessionStorage.setItem(
      PENDING_CART_KEY,
      JSON.stringify({
        product: {
          id: product?.id,
          name: product?.name,
          image: product?.image,
          price: product?.price,
          oldPrice: product?.oldPrice,
          originalPrice: product?.originalPrice,
          status: product?.status,
          isFlash: product?.isFlash,
        },
        variation: variation
          ? {
              id: variation.id,
              label: variation.label,
              price: variation.price,
              discountPrice: variation.discountPrice,
              originalPrice: variation.originalPrice,
              flashSale: variation.flashSale,
              image: variation.image,
            }
          : null,
        qty,
        isFlashSale: isFlashProduct(product, variation, options),
        openCart: options.openCart !== false,
      })
    );
  } catch {
    /* ignore quota errors */
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [monthlySubscription, setMonthlySubscription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartOpenSignal, setCartOpenSignal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCart = useCallback(async () => {
    if (!getAuthToken()) {
      setCart([]);
      setMonthlySubscription(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(Array.isArray(res.data?.items) ? res.data.items : []);
      setMonthlySubscription(Boolean(res.data?.monthlySubscription));
    } catch {
      setCart([]);
      setMonthlySubscription(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const processPendingCart = useCallback(async () => {
    if (!getAuthToken()) return false;

    let pending;
    try {
      const raw = sessionStorage.getItem(PENDING_CART_KEY);
      if (!raw) return false;
      pending = JSON.parse(raw);
      sessionStorage.removeItem(PENDING_CART_KEY);
    } catch {
      sessionStorage.removeItem(PENDING_CART_KEY);
      return false;
    }

    if (!pending?.product?.id) return false;

    try {
      const res = await api.post(
        '/cart/items',
        buildAddPayload(pending.product, pending.variation, pending.qty || 1, {
          isFlashSale: pending.isFlashSale,
        })
      );
      setCart(Array.isArray(res.data?.items) ? res.data.items : []);
      toast.success('কার্টে যোগ হয়েছে!');
      if (pending.openCart !== false) {
        setCartOpenSignal((n) => n + 1);
      }
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'কার্টে যোগ করা যায়নি';
      toast.error(msg);
      return false;
    }
  }, []);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const onAuthChange = async () => {
      const hadPending = sessionStorage.getItem(PENDING_CART_KEY);
      if (hadPending && getAuthToken()) {
        await processPendingCart();
      } else {
        await fetchCart();
      }
    };
    window.addEventListener('hbc-auth-login', onAuthChange);
    window.addEventListener('hbc-auth-logout', () => {
      setCart([]);
      setMonthlySubscription(false);
      sessionStorage.removeItem(PENDING_CART_KEY);
    });
    return () => {
      window.removeEventListener('hbc-auth-login', onAuthChange);
    };
  }, [fetchCart, processPendingCart]);

  const requireLogin = useCallback(
    (message = 'কার্টে যোগ করতে লগইন করুন') => {
      toast.info(message);
      navigate('/login', {
        state: {
          from: location.pathname + location.search,
          reason: 'cart',
        },
      });
      return false;
    },
    [navigate, location]
  );

  const addToCart = useCallback(
    async (product, variation = null, qty = 1, options = {}) => {
      if (!getAuthToken()) {
        savePendingCart(product, variation, qty, options);
        requireLogin();
        return false;
      }
      try {
        const res = await api.post(
          '/cart/items',
          buildAddPayload(product, variation, qty, options)
        );
        setCart(Array.isArray(res.data?.items) ? res.data.items : []);
        return true;
      } catch (err) {
        if (err.response?.status === 401) {
          savePendingCart(product, variation, qty, options);
          localStorage.removeItem('token');
          setCart([]);
          requireLogin('সেশন শেষ। আবার লগইন করুন');
          return false;
        }
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'কার্টে যোগ করা যায়নি';
        toast.error(msg);
        return false;
      }
    },
    [requireLogin]
  );

  const removeFromCart = useCallback(async (cartId) => {
    if (!getAuthToken()) return;
    try {
      const res = await api.delete(`/cart/items/${encodeURIComponent(cartId)}`);
      setCart(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'আইটেম মুছতে সমস্যা হয়েছে');
    }
  }, []);

  const changeQty = useCallback(async (cartId, delta) => {
    if (!getAuthToken()) return;
    try {
      const res = await api.patch(`/cart/items/${encodeURIComponent(cartId)}`, { delta });
      setCart(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'পরিমাণ আপডেট করা যায়নি');
    }
  }, []);

  const clearCart = useCallback(async () => {
    if (!getAuthToken()) {
      setCart([]);
      return;
    }
    try {
      const res = await api.delete('/cart');
      setCart(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch {
      setCart([]);
    }
  }, []);

  const openCart = useCallback(() => {
    if (!getAuthToken()) {
      requireLogin('কার্ট দেখতে লগইন করুন');
      return;
    }
    setCartOpenSignal((n) => n + 1);
  }, [requireLogin]);

  const toggleMonthlySubscription = useCallback(async (checked) => {
    setMonthlySubscription(checked);
    if (!getAuthToken()) return;
    try {
      const res = await api.patch('/cart/preferences', { monthlySubscription: checked });
      setMonthlySubscription(Boolean(res.data?.monthlySubscription));
    } catch {
      toast.error('মাসিক সাবস্ক্রিপশন সেভ করা যায়নি');
    }
  }, []);

  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        changeQty,
        clearCart,
        openCart,
        fetchCart,
        cartOpenSignal,
        monthlySubscription,
        toggleMonthlySubscription,
        itemCount,
        subtotal,
        isLoggedIn: !!getAuthToken(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};
