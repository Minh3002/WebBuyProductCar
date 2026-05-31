import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { Wrench, Package } from 'lucide-react';

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  return (
    <aside className="w-full md:w-1/4 shrink-0">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E5E5E5]">
        <h2 className="text-sm font-bold text-brand-dark uppercase tracking-wide border-b border-[#E5E5E5] pb-3 mb-3">
          Nhóm Phụ Tùng Chính
        </h2>
        <div className="flex flex-wrap md:flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-4 py-2.5 rounded flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat 
                  ? 'bg-brand-dark text-white font-semibold' 
                  : 'bg-[#F8F9FA] hover:bg-[#E5E5E5] text-[#222222]'
              }`}
            >
              {cat === "Tất cả" ? <Package size={16} /> : <Wrench size={16} />}
              {cat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
