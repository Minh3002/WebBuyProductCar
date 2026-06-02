import React from 'react';
import { X } from 'lucide-react';

export default function FilterBox({ filters, setFilters, onReset, filterOptions, sortOrder, setSortOrder }) {
  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E5E5] mb-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-dark uppercase tracking-tight">
            Tìm Đúng Chính Xác Phụ Tùng Cho Xe Của Bạn
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            Chọn thông tin xe bên dưới để hệ thống tự động lọc linh kiện tương thích
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full sm:w-48 p-2.5 bg-white border border-[#E5E5E5] rounded text-sm font-medium focus:outline-none focus:border-brand-primary cursor-pointer transition-colors shadow-sm"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="asc">Giá: Thấp đến Cao</option>
            <option value="desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#777777] uppercase mb-1">1. Năm sản xuất</label>
          <select 
            value={filters.year} 
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-brand-primary cursor-pointer transition-colors"
          >
            <option value="">-- Tất cả các năm --</option>
            {filterOptions?.years?.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#777777] uppercase mb-1">2. Hãng xe</label>
          <select 
            value={filters.make} 
            onChange={(e) => handleChange('make', e.target.value)}
            className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-brand-primary cursor-pointer transition-colors"
          >
            <option value="">-- Tất cả các hãng --</option>
            {filterOptions?.makes?.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#777777] uppercase mb-1">3. Dòng xe (Model)</label>
          <select 
            value={filters.model} 
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-brand-primary cursor-pointer transition-colors"
          >
            <option value="">-- Tất cả các dòng --</option>
            {filterOptions?.models?.map(md => <option key={md} value={md}>{md}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#777777] uppercase mb-1">4. Động cơ / Phiên bản</label>
          <select 
            value={filters.engine} 
            onChange={(e) => handleChange('engine', e.target.value)}
            className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-brand-primary cursor-pointer transition-colors"
          >
            <option value="">-- Tất cả động cơ --</option>
            {filterOptions?.engines?.map(eg => <option key={eg} value={eg}>{eg}</option>)}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 text-right">
          <button 
            onClick={onReset} 
            className="text-xs text-brand-primary font-semibold hover:underline flex items-center justify-end gap-1 ml-auto"
          >
            <X size={14} /> Xóa bộ lọc xe, hiển thị lại tất cả
          </button>
        </div>
      )}
    </section>
  );
}
