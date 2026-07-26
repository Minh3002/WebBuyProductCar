import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { notifyInfo } from '../../utils/alerts';

export default function PurchaseHistory({ user, onBack, handleLogout }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      handleLogout();
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await axiosClient.get('/orders/my-history');
        setOrders(data);
      } catch (err) {
        if (err.response?.status === 401) {
          await notifyInfo('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
          handleLogout();
        } else {
          setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ duyệt':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Chờ duyệt</span>;
      case 'Đã duyệt':
      case 'Đang giao':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{status}</span>;
      case 'Hoàn thành':
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Hoàn thành</span>;
      case 'Đã hủy':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Đã hủy</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg border border-[#E5E5E5] shadow-sm max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-[#E5E5E5] pb-4">
        <h2 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Lịch sử mua hàng</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-transparent text-[#777777] hover:text-[#111111] hover:bg-gray-100 font-bold rounded transition-colors"
        >
          Quay lại mua sắm
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#FF2F2F] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#777777] font-medium text-sm">Đang tải lịch sử đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-[#FF2F2F] font-bold mb-4">{error}</p>
          <button onClick={onBack} className="px-6 py-2 bg-[#111111] hover:bg-gray-800 text-white font-bold rounded">Quay lại</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[#777777] text-lg font-medium mb-6">Bạn chưa có đơn hàng nào.</p>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-[#FF2F2F] hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            Quay lại mua sắm
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border border-[#E5E5E5] rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-[#E5E5E5]">
                <div>
                  <p className="text-sm text-[#777777] mb-1">Mã đơn hàng: <span className="font-semibold text-[#111111]">{order._id}</span></p>
                  <p className="text-sm text-[#777777]">Ngày đặt: <span className="text-[#111111] font-medium">{new Date(order.createdAt).toLocaleString('vi-VN')}</span></p>
                  {order.vin_number && (
                    <p className="text-sm text-[#777777] mt-1">Số khung (VIN): <span className="text-[#111111] font-medium">{order.vin_number}</span></p>
                  )}
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] text-sm text-[#777777]">
                      <th className="pb-3 font-medium">Tên phụ tùng</th>
                      <th className="pb-3 font-medium">Mã OEM</th>
                      <th className="pb-3 font-medium text-center">Số lượng</th>
                      <th className="pb-3 font-medium text-right">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#111111]">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="py-4 pr-4">{item.title}</td>
                        <td className="py-4 pr-4 font-semibold">{item.oem_code}</td>
                        <td className="py-4 px-4 text-center">{item.quantity}</td>
                        <td className="py-4 text-right font-medium">{item.price_at_purchase.toLocaleString('vi-VN')} đ</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[#E5E5E5]">
                      <td colSpan="3" className="pt-4 text-right font-bold text-[#777777]">TỔNG CỘNG:</td>
                      <td className="pt-4 text-right font-black text-[#FF2F2F] text-lg">{order.total_amount.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


