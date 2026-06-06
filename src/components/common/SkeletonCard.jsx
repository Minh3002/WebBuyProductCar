import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Hình ảnh */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      <div className="p-4">
        {/* Badge */}
        <div className="w-16 h-5 bg-gray-200 rounded-full mb-3"></div>
        
        {/* Tiêu đề */}
        <div className="w-full h-5 bg-gray-200 rounded mb-2"></div>
        <div className="w-3/4 h-5 bg-gray-200 rounded mb-4"></div>
        
        {/* Thông tin phụ */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        </div>
        
        <div className="border-t border-gray-100 mt-2 mb-3"></div>
        
        {/* Giá và Nút */}
        <div className="flex justify-between items-end">
          <div>
            <div className="w-12 h-3 bg-gray-200 rounded mb-1"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
