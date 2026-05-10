import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

const ADMIN_ROUTE_PREFIXES = [
    '/categories',
    '/subcategories',
    '/product-attributes',
    '/product-variations',
    '/products',
    '/auth/admin',
];

/** Match admin API paths whether config.url is relative, absolute, or already merged with baseURL */
const isAdminRoute = (config) => {
  const url = config.url || '';
  const paths = new Set();
  if (url) paths.add(url);
  try {
    if (/^https?:\/\//i.test(url)) {
      paths.add(new URL(url).pathname);
    } else if (config.baseURL && url) {
      const base = config.baseURL.replace(/\/$/, '');
      const rel = url.replace(/^\//, '');
      paths.add(new URL(`${base}/${rel}`).pathname);
    }
  } catch {
    /* ignore */
  }
  for (const p of paths) {
    if (
      ADMIN_ROUTE_PREFIXES.some(
        (prefix) =>
          p === prefix ||
          p === `/api${prefix}` ||
          p.startsWith(`${prefix}/`) ||
          p.startsWith(`${prefix}?`) ||
          p.startsWith(`/api${prefix}/`) ||
          p.startsWith(`/api${prefix}?`)
      )
    ) {
      return true;
    }
  }
  return false;
};

// request type অনুযায়ী সঠিক token attach হবে
api.interceptors.request.use(config => {
  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  const token = isAdminRoute(config)
    ? (adminToken || userToken)
    : (userToken || adminToken);

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default api;