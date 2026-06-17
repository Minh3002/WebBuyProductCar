import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, PhoneCall, ShoppingCart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { getProductImage, resolveMediaUrl } from '../../utils/media';

export default function ProductView({ productId, onBack, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/products/${productId}`);
        setProduct(response.data || response);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        setError("Không thể tải thông tin chi tiết sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#FF2F2F] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#777777] font-medium">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-300 p-12 text-center shadow-sm min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button onClick={onBack} className="px-4 py-2 bg-neutral-200 rounded text-neutral-700 font-medium hover:bg-neutral-300">
          Quay lại
        </button>
      </div>
    );
  }

  if (!product) return null;
  const isAvailable = Number(product.stock_quantity || 0) > 0;

  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] p-4 sm:p-8 shadow-sm">
      
      {/* Nút quay lại */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#777777] hover:text-[#FF2F2F] transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại danh sách sản phẩm
      </button>

      {/* Khối chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Ảnh */}
        <div className="w-full aspect-square bg-neutral-50 rounded-lg overflow-hidden border border-[#E5E5E5]">
          <img src={resolveMediaUrl(getProductImage(product))} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* Thông tin đặt hàng */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-700">
                Thương hiệu: {product.brand || 'Đang cập nhật'}
              </span>
              <span className={`px-2.5 py-1 rounded text-xs font-bold text-white ${isAvailable ? 'bg-emerald-600' : 'bg-neutral-500'}`}>
                {isAvailable ? 'Còn hàng tại kho' : 'Hết hàng tạm thời'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111111] leading-tight mb-4">
              {product.title}
            </h1>

            <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#E5E5E5] mb-5">
              <div className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">
                Mã phụ tùng chuẩn (OEM / Part Number):
              </div>
              <div className="text-xl font-mono font-bold text-[#111111] select-all">
                {product.oem_code || product.oem}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-black text-[#FF2F2F]">
                {product.price?.toLocaleString('vi-VN')} đ
              </span>
              {(product.old_price || product.oldPrice) > 0 && (
                <span className="text-base text-[#777777] line-through">
                  {(product.old_price || product.oldPrice).toLocaleString('vi-VN')} đ
                </span>
              )}
            </div>

            {/* Thông số nhanh */}
            <div className="grid grid-cols-2 gap-y-3 text-sm border-t border-b border-[#E5E5E5] py-4 mb-6">
              <div><span className="text-[#777777]">Xuất xứ:</span> <span className="font-semibold ml-1">{product.origin || 'N/A'}</span></div>
              <div><span className="text-[#777777]">Tình trạng:</span> <span className="font-semibold text-emerald-600 ml-1">{product.condition || 'Mới 100%'}</span></div>
              <div className="col-span-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#FF2F2F]" />
                <span className="text-[#777777]">Bảo hành:</span> <span className="font-semibold text-[#111111]">{product.warranty || 'Theo tiêu chuẩn nhà sản xuất'}</span>
              </div>
            </div>
          </div>

          {/* Hành động */}
          <div className="space-y-3">
            <button 
              disabled={!isAvailable}
              onClick={() => onAddToCart(product)}
              className={`w-full py-4 rounded-lg font-bold text-center uppercase tracking-wide text-sm sm:text-base shadow transition-all flex items-center justify-center gap-2 ${
                isAvailable
                  ? 'bg-[#FF2F2F] text-white hover:bg-[#111111]' 
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isAvailable ? <><ShoppingCart size={20} /> Mua Ngay - Giao Hàng Toàn Quốc</> : '❌ Hết hàng'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="border border-[#0068FF] text-[#0068FF] bg-blue-50/50 hover:bg-blue-50 py-3 rounded-lg text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <MessageCircle size={18} /> Chat Tư Vấn Zalo
              </a>
              <a href="tel:0901000000" className="border border-[#111111] bg-white text-[#111111] hover:bg-neutral-50 py-3 rounded-lg text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <PhoneCall size={18} /> Gọi Kỹ Thuật Viên
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Thông số kỹ thuật & Mô tả */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#E5E5E5] pt-8">
        
        {/* Bảng thông số */}
        <div className="md:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#111111] mb-4 border-l-4 border-[#FF2F2F] pl-2">
            Thông số kỹ thuật
          </h3>
          <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-white'}>
                      <td className="px-4 py-3 text-[#777777] font-medium border-r border-[#E5E5E5] w-1/2">{spec.label || spec.key}</td>
                      <td className="px-4 py-3 font-semibold text-[#222222]">{spec.value}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-[#F8F9FA]">
                    <td className="px-4 py-3 text-[#777777] italic text-center" colSpan="2">Đang cập nhật...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-5 p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed shadow-sm">
            📌 <strong>Khuyên dùng:</strong> Hãy gửi <strong>Số khung xe (17 ký tự VIN)</strong> cho Mazlay, đội ngũ kỹ thuật sẽ tra cứu chính xác tuyệt đối sơ đồ lắp ráp của nhà máy cho bạn.
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="md:col-span-2 space-y-5 text-sm text-[#444444] leading-relaxed">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#111111] mb-4 border-l-4 border-[#FF2F2F] pl-2">
            Mô tả chi tiết sản phẩm
          </h3>
          <p className="font-medium text-[#222222] text-base">
            {product.description || 'Đang cập nhật mô tả chi tiết...'}
          </p>
          <div className="bg-neutral-50 p-5 rounded-lg space-y-3 border border-[#E5E5E5] mt-6">
            <h4 className="font-bold text-[#FF2F2F] text-sm uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 size={18} /> Quyền lợi khi mua hàng tại Mazlay Parts:
            </h4>
            <ul className="list-none space-y-2 text-sm text-neutral-700">
              <li className="flex gap-2"><span className="text-emerald-500">✔</span> Hoàn tiền 100% nếu sản phẩm giao đến không đúng với mã OEM đã thỏa thuận.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✔</span> Hỗ trợ ship COD, được kiểm tra hàng chuẩn chỉnh trước khi thanh toán.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✔</span> Sản phẩm đi kèm tem chống hàng giả và phiếu bảo hành chính thức.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
