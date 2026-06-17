import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductManager from './ProductManager';

export default function AdminDashboard({ user, onBack, handleLogout, onProductsChanged }) {
  const [activeTab, setActiveTab] = useState('orders'); // orders, customers, analytics, coupons, products
  
  // States
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Customer Modal States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null); // null means ADD mode
  const [customerFormData, setCustomerFormData] = useState({ full_name: '', phone: '', email: '', address: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      onBack();
      return;
    }
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    if (tab === 'products') return;

    setIsLoading(true);
    try {
      if (tab === 'orders') {
        const res = await axiosClient.get('/orders');
        if (res && Array.isArray(res)) setOrders(res);
        else if (res && Array.isArray(res.data)) setOrders(res.data);
        else setOrders([]);
      } else if (tab === 'customers') {
        const res = await axiosClient.get('/customers');
        if (res && Array.isArray(res)) setCustomers(res);
        else if (res && Array.isArray(res.data)) setCustomers(res.data);
        else setCustomers([]);
      } else if (tab === 'analytics') {
        const res = await axiosClient.get('/orders/analytics/top-products');
        if (res && Array.isArray(res)) setTopProducts(res);
        else if (res && Array.isArray(res.data)) setTopProducts(res.data);
        else setTopProducts([]);
      } else if (tab === 'coupons') {
        const res = await axiosClient.get('/coupons');
        if (res && Array.isArray(res)) setCoupons(res);
        else if (res && Array.isArray(res.data)) setCoupons(res.data);
        else setCoupons([]);
      }
    } catch (err) {
      console.error("API Error in fetchData:", err);
      if (err.response?.status === 401) {
        alert('Phiên làm việc hết hạn');
        handleLogout();
      } else {
        if (tab === 'orders') setOrders([]);
        if (tab === 'customers') setCustomers([]);
        if (tab === 'analytics') setTopProducts([]);
        if (tab === 'coupons') setCoupons([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrder = async (id) => {
    try {
      await axiosClient.patch(`/orders/${id}/status`, { status: 'Đã duyệt' });
      alert('Đã duyệt đơn hàng thành công!');
      fetchData('orders');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể duyệt đơn'));
    }
  };

  const printInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In Hóa Đơn - ${order._id}</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h2 { color: #ff2f2f; margin: 0; font-size: 28px; font-weight: 900; }
            .header p { margin: 0; color: #555; }
            h1 { text-align: center; border-bottom: 2px solid #111; padding-bottom: 10px; font-size: 24px; }
            .info-table { width: 100%; margin-top: 20px; }
            .info-table td { width: 50%; vertical-align: top; padding-right: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .items-table th { background: #111; color: white; padding: 10px; border: 1px solid #111; -webkit-print-color-adjust: exact; color-adjust: exact; print-color-adjust: exact; }
            .items-table td { padding: 10px; border: 1px solid #ccc; }
            .total { margin-top: 30px; text-align: right; }
            .total h2 { color: #ff2f2f; margin: 0; }
            .footer { margin-top: 50px; text-align: center; color: #777; font-size: 12px; }
            @media print {
              @page { margin: 0; }
              body { padding: 2cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>MAZLAY PARTS</h2>
            <p>Hệ Thống Phụ Tùng Ô Tô Chính Hãng</p>
          </div>
          <h1>HÓA ĐƠN BÁN HÀNG</h1>
          <table class="info-table">
            <tr>
              <td>
                <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
                <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('vi-VN')}</p>
                <p><strong>Phương thức TT:</strong> ${order.payment_method}</p>
              </td>
              <td>
                <p><strong>Khách hàng:</strong> ${order.customer_name}</p>
                <p><strong>SĐT:</strong> ${order.customer_phone}</p>
                <p><strong>Địa chỉ:</strong> ${order.shipping_address}</p>
                <p><strong>Số VIN:</strong> ${order.vin_number || 'Không có'}</p>
              </td>
            </tr>
          </table>
          <table class="items-table">
            <thead>
              <tr>
                <th style="text-align: left;">Sản phẩm</th>
                <th style="text-align: center;">SL</th>
                <th style="text-align: right;">Đơn giá</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(i => `
                <tr>
                  <td>${i.title} <br><span style="font-size: 11px; color: #777;">(OEM: ${i.oem_code})</span></td>
                  <td style="text-align: center;">${i.quantity}</td>
                  <td style="text-align: right;">${i.price_at_purchase.toLocaleString('vi-VN')} đ</td>
                  <td style="text-align: right; font-weight: bold;">${(i.price_at_purchase * i.quantity).toLocaleString('vi-VN')} đ</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <h2>TỔNG TIỀN THANH TOÁN: ${order.total_amount.toLocaleString('vi-VN')} đ</h2>
          </div>
          <div class="footer">
            <p>Cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ của Mazlay Parts.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // ---- CUSTOMER CRUD ----
  const openAddCustomer = () => {
    setCurrentCustomer(null);
    setCustomerFormData({ full_name: '', phone: '', email: '', address: '' });
    setIsCustomerModalOpen(true);
  };

  const openEditCustomer = (customer) => {
    setCurrentCustomer(customer);
    setCustomerFormData({ 
      full_name: customer.full_name || customer.name || '', 
      phone: customer.phone || '', 
      email: customer.email || '', 
      address: customer.address || '' 
    });
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    try {
      if (currentCustomer) {
        // Edit
        await axiosClient.put(`/customers/${currentCustomer._id}`, customerFormData);
        alert('Cập nhật khách hàng thành công!');
      } else {
        // Add
        await axiosClient.post('/customers', customerFormData);
        alert('Thêm khách hàng thành công!');
      }
      setIsCustomerModalOpen(false);
      fetchData('customers');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) return;
    try {
      await axiosClient.delete(`/customers/${id}`);
      alert('Xóa thành công!');
      fetchData('customers');
    } catch (err) {
      alert('Lỗi xóa khách hàng');
    }
  };

  // ---- COUPON CRUD ----
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const code = e.target.code.value.toUpperCase();
    const val = Number(e.target.val.value);
    try {
      await axiosClient.post('/coupons', { code, discount_value: val, isActive: true });
      fetchData('coupons');
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleToggleCoupon = async (id, isActive) => {
    try {
      await axiosClient.put(`/coupons/${id}`, { isActive: !isActive });
      fetchData('coupons');
    } catch (err) {
      alert('Lỗi cập nhật');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Xóa mã giảm giá này?')) return;
    try {
      await axiosClient.delete(`/coupons/${id}`);
      fetchData('coupons');
    } catch (err) {
      alert('Lỗi xóa');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-dark uppercase tracking-wider">Quản trị Hệ Thống</h2>
        <button onClick={onBack} className="px-4 py-2 bg-neutral-200 rounded font-bold hover:bg-neutral-300">Đóng</button>
      </div>

      <div className="flex gap-4 border-b pb-4 mb-6 overflow-x-auto">
        {['orders', 'products', 'customers', 'analytics', 'coupons'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold rounded uppercase text-sm whitespace-nowrap ${activeTab === tab ? 'bg-brand-dark text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
          >
            {tab === 'orders' ? 'Đơn hàng' : tab === 'products' ? 'Sản phẩm' : tab === 'customers' ? 'Khách hàng' : tab === 'analytics' ? 'Thống kê' : 'Coupons'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div>
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">Mã Đơn</th>
                    <th className="p-3 border">Khách hàng</th>
                    <th className="p-3 border text-center">Trạng thái</th>
                    <th className="p-3 border text-right">Tổng tiền</th>
                    <th className="p-3 border text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{o._id}</td>
                      <td className="p-3">
                        <p className="font-bold">{o.customer_name}</p>
                        <p className="text-xs text-gray-500">{o.customer_phone}</p>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${o.status === 'Chờ duyệt' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-brand-primary">{o.total_amount.toLocaleString('vi-VN')} đ</td>
                      <td className="p-3 text-center space-x-2">
                        {o.status === 'Chờ duyệt' && (
                          <button onClick={() => handleApproveOrder(o._id)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700">Duyệt</button>
                        )}
                        <button onClick={() => printInvoice(o)} className="bg-gray-800 text-white px-3 py-1 rounded text-xs font-bold hover:bg-black">In PDF</button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="5" className="p-6 text-center text-gray-500">Chưa có đơn hàng nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <ProductManager onProductsChanged={onProductsChanged} />
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={openAddCustomer} className="bg-brand-primary text-white font-bold px-4 py-2 rounded shadow hover:bg-red-600 transition">
                  + Thêm khách hàng mới
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">Họ và tên</th>
                      <th className="p-3 border">Số điện thoại</th>
                      <th className="p-3 border">Email</th>
                      <th className="p-3 border">Địa chỉ</th>
                      <th className="p-3 border text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(customers) && customers.length > 0 ? (
                      customers.map((customer, index) => (
                        <tr key={customer?._id || index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-bold">
                            {customer?.full_name || customer?.name || "Khách hàng chưa đặt tên"}
                            {customer?.role === 'admin' && <span className="ml-2 bg-brand-dark text-white text-[10px] px-1 py-0.5 rounded">ADMIN</span>}
                          </td>
                          <td className="p-3 text-neutral-600">
                            {customer?.phone || customer?._id || "Không có SĐT"}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {customer?.email || "---"}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {customer?.address || "---"}
                          </td>
                          <td className="p-3 text-center space-x-2">
                            <button onClick={() => openEditCustomer(customer)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-600">Sửa</button>
                            {customer?.role !== 'admin' && (
                              <button onClick={() => handleDeleteCustomer(customer?._id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600">Xóa</button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="p-6 text-center text-gray-500">Không có dữ liệu khách hàng hoặc đang tải...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Top Sản Phẩm Bán Chạy Nhất (Đã hoàn thành)</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border text-center">Top</th>
                    <th className="p-3 border">Sản phẩm</th>
                    <th className="p-3 border text-center">Số lượng bán</th>
                    <th className="p-3 border text-right">Doanh thu mang lại</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, idx) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-center font-bold text-xl text-gray-400">#{idx + 1}</td>
                      <td className="p-3 font-bold">{p.title} <br/><span className="text-xs font-mono text-gray-500">{p.oem_code}</span></td>
                      <td className="p-3 text-center font-bold text-brand-primary text-lg">{p.total_quantity}</td>
                      <td className="p-3 text-right font-bold">{p.total_revenue.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                  {topProducts.length === 0 && (
                    <tr><td colSpan="4" className="p-6 text-center text-gray-500">Chưa có đủ dữ liệu thống kê (Hãy thử duyệt đơn)</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div>
              <form onSubmit={handleCreateCoupon} className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded border">
                <input required name="code" type="text" placeholder="Nhập mã (VD: VUIHE)" className="p-2 border rounded uppercase font-mono flex-1" />
                <input required name="val" type="number" placeholder="Số tiền giảm (VND)" className="p-2 border rounded flex-1" />
                <button type="submit" className="bg-brand-dark text-white px-4 py-2 rounded font-bold hover:bg-black">Tạo Mã</button>
              </form>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">Mã Giảm Giá</th>
                      <th className="p-3 border text-right">Giá trị giảm</th>
                      <th className="p-3 border text-center">Trạng thái</th>
                      <th className="p-3 border text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c._id} className="border-b">
                        <td className="p-3 font-mono font-bold text-lg text-brand-primary">{c.code}</td>
                        <td className="p-3 text-right font-bold">{c.discount_value.toLocaleString('vi-VN')} đ</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${c.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {c.isActive ? 'Đang bật' : 'Đã tắt'}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <button onClick={() => handleToggleCoupon(c._id, c.isActive)} className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">
                            {c.isActive ? 'Tắt' : 'Bật'}
                          </button>
                          <button onClick={() => handleDeleteCoupon(c._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL CUSTOMER FORM */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-brand-dark px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">{currentCustomer ? 'Sửa thông tin Khách hàng' : 'Thêm khách hàng mới'}</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-gray-300 hover:text-white font-bold">X</button>
            </div>
            <form onSubmit={handleSaveCustomer} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Số điện thoại (Dùng làm ID)</label>
                <input 
                  type="text" 
                  required 
                  disabled={!!currentCustomer} 
                  value={customerFormData.phone} 
                  onChange={e => setCustomerFormData({...customerFormData, phone: e.target.value})}
                  className="w-full p-2 border rounded focus:border-brand-primary outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  required 
                  value={customerFormData.full_name} 
                  onChange={e => setCustomerFormData({...customerFormData, full_name: e.target.value})}
                  className="w-full p-2 border rounded focus:border-brand-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email</label>
                <input 
                  type="email" 
                  value={customerFormData.email} 
                  onChange={e => setCustomerFormData({...customerFormData, email: e.target.value})}
                  className="w-full p-2 border rounded focus:border-brand-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Địa chỉ</label>
                <input 
                  type="text" 
                  value={customerFormData.address} 
                  onChange={e => setCustomerFormData({...customerFormData, address: e.target.value})}
                  className="w-full p-2 border rounded focus:border-brand-primary outline-none"
                />
              </div>
              
              {!currentCustomer && (
                <p className="text-xs text-red-500 font-bold">* Mật khẩu mặc định sẽ là 12345</p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 font-bold">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded hover:bg-red-600 font-bold">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
