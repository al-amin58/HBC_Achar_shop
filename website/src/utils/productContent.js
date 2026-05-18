/** Variation stock: empty/null means "not tracked per variation" — still selectable */
export const getVariationStock = (variation) => {
  if (variation?.stock == null || variation.stock === '') return null;
  const n = Number(variation.stock);
  return Number.isFinite(n) ? n : null;
};

export const isVariationOutOfStock = (variation, productStock = 0) => {
  const vs = getVariationStock(variation);
  if (vs != null) return vs <= 0;
  return Number(productStock) <= 0 && productStock !== null;
};

export const isHtmlDescription = (text) => {
  if (!text || typeof text !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(text.trim());
};

const QA_PREFIX = 'hbc_product_questions_';

export const loadProductQuestions = (productId) => {
  if (!productId) return [];
  try {
    const raw = localStorage.getItem(`${QA_PREFIX}${productId}`);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const saveProductQuestion = (productId, entry) => {
  const list = loadProductQuestions(productId);
  const next = [{ ...entry, id: entry.id || Date.now() }, ...list];
  localStorage.setItem(`${QA_PREFIX}${productId}`, JSON.stringify(next));
  return next;
};
