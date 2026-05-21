/** Normalize BD phone to 11 digits (01XXXXXXXXX) */
export const normalizeBdPhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('880')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('01')) {
    return digits;
  }
  if (digits.length === 10 && digits.startsWith('1')) {
    return `0${digits}`;
  }
  return digits;
};

export const phonesMatch = (a, b) => {
  const na = normalizeBdPhone(a);
  const nb = normalizeBdPhone(b);
  if (!na || !nb) return false;
  return na === nb || na.slice(-10) === nb.slice(-10);
};
