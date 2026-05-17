import mongoose from 'mongoose';
import Cart from '../models/Cart.js';

const isValidId = (value) => {
  if (value == null || value === '') return false;
  const s = String(value).trim();
  if (s === 'undefined' || s === 'null') return false;
  return mongoose.Types.ObjectId.isValid(s);
};

const normalizeVariationId = (value) => {
  if (!isValidId(value)) return null;
  return String(value).trim();
};

const normalizeProductId = (value) => {
  if (!isValidId(value)) return null;
  return String(value).trim();
};

const makeCartId = (productId, variationId) =>
  variationId ? `${productId}_${variationId}` : String(productId);

const parseCartId = (cartId) => {
  const str = String(cartId || '');
  const idx = str.indexOf('_');
  if (idx === -1) return { productId: str, variationId: null };
  return {
    productId: str.slice(0, idx),
    variationId: str.slice(idx + 1) || null,
  };
};

const formatItem = (item) => {
  const productId = String(item.productId);
  const variationId = item.variationId ? String(item.variationId) : null;
  return {
    cartId: makeCartId(productId, variationId),
    id: productId,
    name: item.name,
    image: item.image || null,
    price: item.price,
    oldPrice: item.oldPrice ?? null,
    variation: variationId
      ? {
          id: variationId,
          label: item.variationLabel || '',
          price: item.price,
        }
      : null,
    isFlashSale: Boolean(item.isFlashSale),
    qty: item.qty,
  };
};

const formatCartResponse = (cart) => ({
  items: (cart?.items || []).map(formatItem),
  monthlySubscription: Boolean(cart?.monthlySubscription),
});

const findCartItem = (cart, productId, variationId) =>
  cart.items.find(
    (i) =>
      String(i.productId) === String(productId) &&
      String(i.variationId || '') === String(variationId || '')
  );

const getUserId = (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: 'Not authorized. Please login again.' });
    return null;
  }
  return userId;
};

/** GET /api/cart */
export const getMyCart = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const cart = await Cart.findOne({ user: userId });
    return res.json(formatCartResponse(cart || { items: [] }));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load cart', error: error.message });
  }
};

/** POST /api/cart/items */
export const addCartItem = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const {
      productId,
      variationId = null,
      name,
      image = '',
      price,
      oldPrice = null,
      variationLabel = '',
      isFlashSale = false,
      qty = 1,
    } = req.body;

    const pid = normalizeProductId(productId);
    const vid = normalizeVariationId(variationId);
    const itemPrice = Number(price);
    const itemQty = Math.max(1, Number(qty) || 1);

    if (!pid || !name || Number.isNaN(itemPrice) || itemPrice < 0) {
      return res.status(400).json({
        message: 'Valid productId, name and price are required',
      });
    }

    if (variationId && !vid) {
      return res.status(400).json({ message: 'Invalid variation id' });
    }

    const addQty = itemQty;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existing = findCartItem(cart, pid, vid);
    if (existing) {
      existing.qty += addQty;
      existing.price = itemPrice;
      existing.name = String(name).trim();
      existing.image = image || '';
      existing.oldPrice = oldPrice ?? null;
      existing.variationLabel = variationLabel || '';
      existing.isFlashSale = Boolean(isFlashSale);
    } else {
      cart.items.push({
        productId: pid,
        variationId: vid,
        name: String(name).trim(),
        image: image || '',
        price: itemPrice,
        oldPrice: oldPrice ?? null,
        variationLabel: variationLabel || '',
        isFlashSale: Boolean(isFlashSale),
        qty: addQty,
      });
    }

    cart.markModified('items');
    await cart.save();
    return res.json(formatCartResponse(cart));
  } catch (error) {
    console.error('addCartItem error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to add to cart',
    });
  }
};

/** PATCH /api/cart/items/:cartId  body: { delta } or { qty } */
export const updateCartItemQty = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { productId, variationId } = parseCartId(req.params.cartId);
    const { delta, qty } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = findCartItem(cart, productId, variationId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (qty != null) {
      const next = Number(qty);
      if (next < 1) {
        cart.items = cart.items.filter(
          (i) =>
            !(
              String(i.productId) === String(productId) &&
              String(i.variationId || '') === String(variationId || '')
            )
        );
      } else {
        item.qty = next;
      }
    } else if (delta != null) {
      const nextQty = item.qty + Number(delta);
      if (nextQty < 1) {
        cart.items = cart.items.filter(
          (i) =>
            !(
              String(i.productId) === String(productId) &&
              String(i.variationId || '') === String(variationId || '')
            )
        );
      } else {
        item.qty = nextQty;
      }
    } else {
      return res.status(400).json({ message: 'delta or qty is required' });
    }

    await cart.save();
    return res.json(formatCartResponse(cart));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
};

/** DELETE /api/cart/items/:cartId */
export const removeCartItem = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { productId, variationId } = parseCartId(req.params.cartId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (i) =>
        !(
          String(i.productId) === String(productId) &&
          String(i.variationId || '') === String(variationId || '')
        )
    );

    await cart.save();
    return res.json(formatCartResponse(cart));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
};

/** PATCH /api/cart/preferences  body: { monthlySubscription } */
export const updateCartPreferences = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { monthlySubscription } = req.body;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        monthlySubscription: Boolean(monthlySubscription),
      });
    } else {
      cart.monthlySubscription = Boolean(monthlySubscription);
      await cart.save();
    }
    return res.json(formatCartResponse(cart));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update cart preferences' });
  }
};

/** DELETE /api/cart */
export const clearMyCart = async (req, res) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return res.json(formatCartResponse(cart || { items: [] }));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};
