import React from 'react';
import { MessageCircle, ShoppingBag, Copy, GitCompare } from 'lucide-react';
import { getProductImage, resolveMediaUrl } from '../../utils/media';
import { motion } from 'framer-motion';
import { notifySuccess } from '../../utils/alerts';

export default function ProductCard({ product, onSelect, onQuickBuy, isCompared = false, onToggleCompare }) {
  const isAvailable = Number(product.stock_quantity || 0) > 0;

  const handleCopyOEM = (e, oem) => {
    e.stopPropagation(); // Ngăn click lan ra thẻ Card
    navigator.clipboard.writeText(oem);
    notifySuccess(`Đã copy mã OEM: ${oem}`);
  };

  const handleQuickBuy = (e) => {
    e.stopPropagation();
    onQuickBuy(product);
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    onToggleCompare?.(product);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden flex flex-col justify-between cursor-pointer" 
      onClick={() => onSelect(product._id || product.id)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
    >
      
      {/* Ảnh & Badge */}
      <div className="w-full aspect-square relative bg-neutral-100 overflow-hidden">
        <motion.img 
          src={resolveMediaUrl(getProductImage(product))} 
          alt={product.title} 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <span className={`absolute top-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider shadow-sm ${
          isAvailable ? 'bg-emerald-600' : 'bg-neutral-500'
        }`}>
          {isAvailable ? 'Còn hàng' : 'Hết hàng'}
        </span>
      </div>

      {/* Nội dung chi tiết */}
      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-[#777777] font-medium mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              Mã OEM: <strong className="text-brand-dark">{product.oem_code || product.oem}</strong>
              <button 
                onClick={(e) => handleCopyOEM(e, product.oem_code || product.oem)} 
                className="hover:text-brand-primary p-0.5 rounded transition-colors"
                title="Copy mã OEM"
              >
                <Copy size={12} />
              </button>
            </span>
            <span className="truncate max-w-[80px] text-right">{product.brand}</span>
          </div>
          
          <h4 className="text-sm font-semibold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[40px] mb-3 leading-snug">
            {product.title}
          </h4>
        </div>

        <div className="mb-4">
          <div className="text-base sm:text-lg font-bold text-[#FF2F2F]">
            {product.price?.toLocaleString('vi-VN')} đ
          </div>
          {product.old_price > 0 && (
            <div className="text-[11px] text-[#777777] line-through">
              {product.old_price.toLocaleString('vi-VN')} đ
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex gap-2">
          <button 
            disabled={!isAvailable}
            onClick={handleQuickBuy}
            className={`flex-grow text-[11px] sm:text-xs font-bold uppercase py-2.5 rounded text-center transition-all duration-200 flex items-center justify-center gap-1 ${
              isAvailable
                ? 'bg-[#FF2F2F] hover:bg-[#111111] text-white' 
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={14} /> {isAvailable ? 'Mua ngay' : 'Hết hàng'}
          </button>
          
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`w-10 sm:w-11 flex items-center justify-center rounded border transition-colors duration-200 ${
              isCompared
                ? 'bg-[#111111] border-[#111111] text-white'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#FF2F2F] hover:text-[#FF2F2F]'
            }`}
            title={isCompared ? 'Bỏ so sánh' : 'So sánh'}
          >
            <GitCompare size={16} />
          </button>

          <a 
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-10 sm:w-11 bg-brand-secondary hover:bg-blue-700 text-white flex items-center justify-center rounded transition-colors duration-200"
            title="Tư vấn Zalo"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

