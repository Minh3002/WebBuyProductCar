import React, { useState, useEffect } from 'react';

const mockNames = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D', 'Vũ Đức E'];
const mockLocations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
const mockProducts = ['Má phanh Ceramic', 'Cần gạt nước Bosch', 'Lọc dầu K&N', 'Bugi Iridium', 'Lọc gió động cơ'];

export default function RecentPurchaseToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState({ name: '', location: '', product: '' });

  useEffect(() => {
    // Hàm hiển thị thông báo
    const showToast = () => {
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      
      setPurchaseInfo({ name: randomName, location: randomLocation, product: randomProduct });
      setIsVisible(true);

      // Tự động ẩn sau 5 giây
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Chạy lần đầu sau 10s, sau đó lặp lại ngẫu nhiên từ 15-30s
    const firstTimeout = setTimeout(showToast, 10000);
    
    let interval;
    const loop = () => {
      const nextTime = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
      interval = setTimeout(() => {
        showToast();
        loop();
      }, nextTime);
    };
    
    loop();

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-6 z-[9000] animate-in slide-in-from-left-5 fade-in duration-500">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 flex items-center gap-3 w-72 hover:scale-105 transition-transform cursor-default">
        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex flex-shrink-0 items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500">Khách hàng vừa mua</p>
          <p className="text-sm font-bold text-gray-800 leading-tight">
            {purchaseInfo.name} <span className="font-normal text-xs">từ {purchaseInfo.location}</span>
          </p>
          <p className="text-xs text-brand-primary font-medium mt-0.5 truncate">{purchaseInfo.product}</p>
        </div>
      </div>
    </div>
  );
}
