import React, { useEffect, useState } from 'react';
import { getProductImage, resolveMediaUrl } from '../../utils/media';

const STORAGE_KEY = 'recentlyViewed';
const MAX_STORED_PRODUCTS = 5;
const MAX_DISPLAY_PRODUCTS = 2;

const getProductId = (product) => product?._id || product?.id;

export default function RecentlyViewed({ currentProduct, onSelectProduct }) {
  const [listProducts, setListProducts] = useState([]);

  useEffect(() => {
    const currentId = getProductId(currentProduct);
    if (!currentId || typeof window === 'undefined') return;

    let viewed = [];
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      const parsedValue = storedValue ? JSON.parse(storedValue) : [];
      viewed = Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
      viewed = [];
    }

    viewed = viewed.filter((product) => getProductId(product) !== currentId);

    viewed.unshift({
      _id: currentId,
      title: currentProduct.title,
      price: currentProduct.price,
      image_url: getProductImage(currentProduct),
    });

    viewed = viewed.slice(0, MAX_STORED_PRODUCTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));

    setListProducts(
      viewed
        .filter((product) => getProductId(product) !== currentId)
        .slice(0, MAX_DISPLAY_PRODUCTS),
    );
  }, [currentProduct]);

  if (listProducts.length === 0) return null;

  return (
    <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1">
        <span aria-hidden="true">👀</span>
        Sản phẩm bạn vừa xem
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listProducts.map((product) => (
          <button
            key={getProductId(product)}
            type="button"
            onClick={() => onSelectProduct?.(getProductId(product))}
            className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:shadow-sm hover:border-[#FF2F2F]/40 transition-all text-left"
          >
            <img
              src={resolveMediaUrl(getProductImage(product))}
              alt={product.title}
              className="w-14 h-14 object-cover rounded bg-gray-50 border border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-semibold text-gray-800 truncate">
                {product.title}
              </h5>
              <p className="text-xs font-bold text-[#FF2F2F] mt-1">
                {Number(product.price || 0).toLocaleString('vi-VN')} đ
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
