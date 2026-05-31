import React from 'react';
import { Info } from 'lucide-react';

export default function GuideWiki() {
  return (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2 text-sm">
        <Info size={16} /> Hướng dẫn: Cách tìm số khung xe (VIN) chính xác
      </h3>
      <ul className="list-disc list-inside text-sm text-blue-800 space-y-1 ml-1">
        <li><strong>Kính chắn gió:</strong> Góc dưới cùng bên tài xế (nhìn từ ngoài vào).</li>
        <li><strong>Khung cửa tài xế:</strong> Mở cửa tài xế, tem thông số thường dán ở cột B.</li>
        <li><strong>Sổ đăng kiểm:</strong> Ghi rõ trên giấy chứng nhận kiểm định an toàn kỹ thuật.</li>
        <li><strong>Khoang động cơ:</strong> Được dập nổi hoặc đóng mác nhôm trên vách ngăn.</li>
      </ul>
      <p className="text-xs text-blue-700 mt-3 italic">
        * Hệ thống yêu cầu 17 ký tự, không bao gồm I, O, Q để tránh nhầm lẫn với số 1 và 0.
      </p>
    </div>
  );
}
