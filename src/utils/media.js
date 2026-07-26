const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api/v1' : '/api/v1');
const API_ORIGIN = API_BASE_URL.startsWith('http')
  ? API_BASE_URL.replace(/\/api\/v1\/?$/, '')
  : '';

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  
  // Nếu url quá dài (hàng nghìn ký tự) và không chứa khoảng trắng, khả năng cao là chuỗi base64 raw bị thiếu prefix
  if (url.length > 500 && !url.includes(' ')) {
    // Tự động thêm prefix data:image/jpeg;base64, nếu chưa có
    return `data:image/jpeg;base64,${url}`;
  }

  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
};

export const getProductImage = (product) => {
  return (
    product?.images?.[0] ||
    product?.image_url ||
    product?.image ||
    'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=400&auto=format&fit=crop'
  );
};
