import React from 'react';
import { ArrowLeft, ShoppingCart, X } from 'lucide-react';
import { getProductImage, resolveMediaUrl } from '../../utils/media';

const formatPrice = (price) => Number(price || 0).toLocaleString('vi-VN');

const formatCompatibility = (product) => {
  if (!product) return '—';
  if (product.compatible_cars) return product.compatible_cars;
  if (!Array.isArray(product.compatibility) || product.compatibility.length === 0) {
    return 'Tất cả các dòng';
  }

  return product.compatibility
    .slice(0, 4)
    .map((item) => [item.year, item.make, item.model, item.engine].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(', ') || 'Tất cả các dòng';
};

export default function CompareProducts({ products = [], onRemoveProduct, onAddToCart, onBack }) {
  const displaySlots = [...products, ...Array(3 - products.length).fill(null)].slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 dark:bg-[#111827] dark:border-neutral-800">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF2F2F]"
      >
        <ArrowLeft size={16} /> Quay lại mua sắm
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 dark:text-neutral-100">
        <span aria-hidden="true">📊</span>
        Bảng So Sánh Chi Tiết Sản Phẩm
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] table-fixed border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-neutral-800">
              <th className="w-1/4 p-4 text-left font-medium text-gray-400 text-sm">
                Thông tin sản phẩm
              </th>
              {displaySlots.map((product, index) => (
                <th key={product?._id || index} className="w-1/4 p-4 text-center align-top relative border-l border-gray-50 dark:border-neutral-800">
                  {product ? (
                    <div className="group">
                      <button
                        type="button"
                        onClick={() => onRemoveProduct(product._id || product.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                        title="Xóa khỏi so sánh"
                      >
                        <X size={16} />
                      </button>
                      <img
                        src={resolveMediaUrl(getProductImage(product))}
                        alt={product.title}
                        className="w-32 h-32 object-cover mx-auto rounded-lg mb-3 bg-gray-50"
                      />
                      <h3 className="font-bold text-sm text-gray-800 line-clamp-2 min-h-[40px] text-left px-2 dark:text-neutral-100">
                        {product.title}
                      </h3>
                      <p className="text-[#FF2F2F] font-bold text-left px-2 mt-1">
                        {formatPrice(product.price)} đ
                      </p>
                      <button
                        type="button"
                        disabled={Number(product.stock_quantity || 0) <= 0}
                        onClick={() => onAddToCart(product)}
                        className="w-full mt-3 bg-[#FF2F2F] hover:bg-[#111111] disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={14} />
                        {Number(product.stock_quantity || 0) > 0 ? 'Mua ngay' : 'Hết hàng'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 dark:bg-[#0f172a] dark:border-neutral-700">
                      <span className="text-gray-400 text-xs">Chưa chọn sản phẩm</span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700 dark:divide-neutral-800 dark:text-neutral-200">
            <tr className="hover:bg-gray-50/50">
              <td className="p-4 font-semibold text-gray-500 bg-gray-50/30">Thương hiệu</td>
              {displaySlots.map((product, index) => (
                <td key={product?._id || index} className="p-4 text-center border-l border-gray-50 font-medium dark:border-neutral-800">
                  {product ? product.brand || 'Chính hãng' : '—'}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-gray-50/50">
              <td className="p-4 font-semibold text-gray-500 bg-gray-50/30">Mã phụ tùng (OEM)</td>
              {displaySlots.map((product, index) => (
                <td key={product?._id || index} className="p-4 text-center border-l border-gray-50 text-xs text-blue-600 font-semibold dark:border-neutral-800">
                  {product ? product.oem_code || product.oem || 'Đang cập nhật' : '—'}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-gray-50/50">
              <td className="p-4 font-semibold text-gray-500 bg-gray-50/30">Dòng xe phù hợp</td>
              {displaySlots.map((product, index) => (
                <td key={product?._id || index} className="p-4 text-center border-l border-gray-50 text-xs text-gray-600 px-3 dark:border-neutral-800 dark:text-neutral-300">
                  {formatCompatibility(product)}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-gray-50/50">
              <td className="p-4 font-semibold text-gray-500 bg-gray-50/30">Tình trạng</td>
              {displaySlots.map((product, index) => {
                const isAvailable = Number(product?.stock_quantity || 0) > 0;
                return (
                  <td key={product?._id || index} className="p-4 text-center border-l border-gray-50 dark:border-neutral-800">
                    {product ? (
                      <span className={`font-medium px-2 py-0.5 rounded text-xs ${isAvailable ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>
                        {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    ) : '—'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
