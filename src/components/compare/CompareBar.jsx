import React from 'react';
import { X } from 'lucide-react';
import { getProductImage, resolveMediaUrl } from '../../utils/media';

export default function CompareBar({ products, onRemoveProduct, onOpenCompare }) {
  if (!products.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-lg p-3 pointer-events-auto dark:bg-[#111827] dark:border-neutral-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase text-gray-500 mb-2">
              Sản phẩm đang so sánh ({products.length}/3)
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="relative flex items-center gap-2 min-w-[170px] max-w-[220px] bg-gray-50 border border-gray-100 rounded-lg p-2 dark:bg-[#0f172a] dark:border-neutral-700"
                >
                  <img
                    src={resolveMediaUrl(getProductImage(product))}
                    alt={product.title}
                    className="w-11 h-11 rounded object-cover bg-gray-100"
                  />
                  <div className="min-w-0 pr-5">
                    <p className="text-xs font-semibold text-gray-800 truncate dark:text-neutral-100">
                      {product.title}
                    </p>
                    <p className="text-[11px] font-bold text-[#FF2F2F]">
                      {Number(product.price || 0).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(product._id || product.id)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 flex items-center justify-center dark:bg-[#111827] dark:border-neutral-600"
                    title="Xóa khỏi so sánh"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCompare}
            className="sm:w-44 bg-[#FF2F2F] hover:bg-[#111111] text-white font-bold text-sm px-4 py-3 rounded-lg transition-colors"
          >
            So sánh ngay ({products.length})
          </button>
        </div>
      </div>
    </div>
  );
}
