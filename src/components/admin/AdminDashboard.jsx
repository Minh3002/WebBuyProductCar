import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Trash2, TrendingUp, DollarSign, Users, ShoppingBag, Award } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import ProductManager from './ProductManager';
import DeviceManager from './DeviceManager';

export default function AdminDashboard({ user, onBack, handleLogout, onProductsChanged }) {
  const [activeTab, setActiveTab] = useState('orders'); // orders, customers, analytics, coupons, products
  
  // States
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

  // ---- BULK DELETE ----
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [selectedCouponIds, setSelectedCouponIds] = useState([]);

  const handleBulkDeleteOrders = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedOrderIds.length} đơn hàng đã chọn không?`)) return;
    try {
      await axiosClient.post('/orders/bulk-delete', { ids: selectedOrderIds });
      setSelectedOrderIds([]);
      fetchData('orders');
    } catch (err) {
      alert('Lỗi xóa đơn hàng');
    }
  };

  const handleBulkDeleteCustomers = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCustomerIds.length} khách hàng đã chọn không?`)) return;
    try {
      await axiosClient.post('/customers/bulk-delete', { ids: selectedCustomerIds });
      setSelectedCustomerIds([]);
      fetchData('customers');
    } catch (err) {
      alert('Lỗi xóa khách hàng');
    }
  };

  const handleBulkDeleteCoupons = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCouponIds.length} mã giảm giá đã chọn không?`)) return;
    try {
      await axiosClient.post('/coupons/bulk-delete', { ids: selectedCouponIds });
      setSelectedCouponIds([]);
      fetchData('coupons');
    } catch (err) {
      alert('Lỗi xóa mã giảm giá');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-dark uppercase tracking-wider">Quản trị Hệ Thống</h2>
        <button onClick={onBack} className="px-4 py-2 bg-neutral-200 rounded font-bold hover:bg-neutral-300">Đóng</button>
      </div>

      <div className="flex gap-4 border-b pb-4 mb-6 overflow-x-auto">
        {['orders', 'products', 'customers', 'analytics', 'coupons', 'devices'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold rounded uppercase text-sm whitespace-nowrap ${activeTab === tab ? 'bg-brand-dark text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
          >
            {tab === 'orders' ? 'Đơn hàng' : tab === 'products' ? 'Sản phẩm' : tab === 'customers' ? 'Khách hàng' : tab === 'analytics' ? 'Thống kê' : tab === 'coupons' ? 'Coupons' : 'Thiết bị'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div>
          {(() => {
            const getPaginationData = (items) => {
              const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
              const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
              return { totalPages, currentItems };
            };
            const { totalPages: orderPages, currentItems: pagedOrders } = getPaginationData(orders);
            const { totalPages: customerPages, currentItems: pagedCustomers } = getPaginationData(customers);
            const { totalPages: couponPages, currentItems: pagedCoupons } = getPaginationData(coupons);

            const renderPagination = (totalPages) => {
              if (totalPages <= 1) return null;
              return (
                <div className="flex justify-center items-center gap-2 mt-6 pb-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-600 font-medium">Trang {currentPage} / {totalPages}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              );
            };

            return (
              <>
                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              {selectedOrderIds.length > 0 && (
                <div className="mb-4">
                  <button 
                    onClick={handleBulkDeleteOrders}
                    className="px-3 py-2 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
                  >
                    <Trash2 size={16} />
                    Xóa mục đã chọn ({selectedOrderIds.length})
                  </button>
                </div>
              )}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border text-center w-10">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 cursor-pointer"
                        checked={pagedOrders.length > 0 && selectedOrderIds.length === pagedOrders.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedOrderIds(pagedOrders.map(o => o._id));
                          else setSelectedOrderIds([]);
                        }}
                      />
                    </th>
                    <th className="p-3 border">Mã Đơn</th>
                    <th className="p-3 border">Khách hàng</th>
                    <th className="p-3 border text-center">Trạng thái</th>
                    <th className="p-3 border text-right">Tổng tiền</th>
                    <th className="p-3 border text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedOrders.map(o => (
                    <tr key={o._id} className={`border-b hover:bg-gray-50 ${selectedOrderIds.includes(o._id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="p-3 text-center border">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedOrderIds.includes(o._id)}
                          onChange={() => {
                            if (selectedOrderIds.includes(o._id)) setSelectedOrderIds(selectedOrderIds.filter(id => id !== o._id));
                            else setSelectedOrderIds([...selectedOrderIds, o._id]);
                          }}
                        />
                      </td>
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
                  {pagedOrders.length === 0 && (
                    <tr><td colSpan="6" className="p-6 text-center text-gray-500">Chưa có đơn hàng nào</td></tr>
                  )}
                </tbody>
              </table>
              {renderPagination(orderPages)}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <ProductManager onProductsChanged={onProductsChanged} />
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  {selectedCustomerIds.length > 0 && (
                    <button 
                      onClick={handleBulkDeleteCustomers}
                      className="px-3 py-2 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
                    >
                      <Trash2 size={16} />
                      Xóa mục đã chọn ({selectedCustomerIds.length})
                    </button>
                  )}
                </div>
                <button onClick={openAddCustomer} className="bg-brand-primary text-white font-bold px-4 py-2 rounded shadow hover:bg-red-600 transition">
                  + Thêm khách hàng mới
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border text-center w-10">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer"
                          checked={pagedCustomers.length > 0 && selectedCustomerIds.length === pagedCustomers.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCustomerIds(pagedCustomers.map(c => c._id));
                            else setSelectedCustomerIds([]);
                          }}
                        />
                      </th>
                      <th className="p-3 border">Họ và tên</th>
                      <th className="p-3 border">Số điện thoại</th>
                      <th className="p-3 border">Email</th>
                      <th className="p-3 border">Địa chỉ</th>
                      <th className="p-3 border text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(pagedCustomers) && pagedCustomers.length > 0 ? (
                      pagedCustomers.map((customer, index) => (
                        <tr key={customer?._id || index} className={`border-b hover:bg-gray-50 ${selectedCustomerIds.includes(customer?._id) ? 'bg-blue-50/50' : ''}`}>
                          <td className="p-3 text-center border">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 cursor-pointer"
                              checked={selectedCustomerIds.includes(customer?._id)}
                              onChange={() => {
                                if (selectedCustomerIds.includes(customer?._id)) setSelectedCustomerIds(selectedCustomerIds.filter(id => id !== customer?._id));
                                else setSelectedCustomerIds([...selectedCustomerIds, customer?._id]);
                              }}
                            />
                          </td>
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
                            <button onClick={() => openEditCustomer(customer)} className="text-blue-500 hover:text-blue-700 font-bold px-2 py-1">Sửa</button>
                            <button onClick={() => handleDeleteCustomer(customer._id)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1">Xóa</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="p-6 text-center text-gray-500">Chưa có khách hàng nào</td></tr>
                    )}
                  </tbody>
                </table>
                {renderPagination(customerPages)}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (() => {
            const completedOrders = orders.filter(o => ['Đã duyệt', 'Đang giao', 'Hoàn thành'].includes(o.status));
            const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
            const totalOrdersCount = orders.length;
            const totalCustomersCount = customers.length;
            const activeCouponsCount = coupons.filter(c => c.isActive).length;
            const maxTopQty = topProducts.length > 0 ? Math.max(...topProducts.map(p => p.total_quantity)) : 1;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative z-10">
                      <p className="text-blue-100 text-xs font-bold mb-1 uppercase tracking-wider">Tổng Doanh Thu</p>
                      <h3 className="text-3xl font-bold truncate">{totalRevenue.toLocaleString('vi-VN')} đ</h3>
                    </div>
                    <DollarSign size={80} className="absolute -right-4 -bottom-4 text-white opacity-20 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative z-10">
                      <p className="text-emerald-100 text-xs font-bold mb-1 uppercase tracking-wider">Đơn Hàng Mới</p>
                      <h3 className="text-3xl font-bold">{totalOrdersCount}</h3>
                    </div>
                    <ShoppingBag size={80} className="absolute -right-4 -bottom-4 text-white opacity-20 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative z-10">
                      <p className="text-purple-100 text-xs font-bold mb-1 uppercase tracking-wider">Khách Hàng</p>
                      <h3 className="text-3xl font-bold">{totalCustomersCount}</h3>
                    </div>
                    <Users size={80} className="absolute -right-4 -bottom-4 text-white opacity-20 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative z-10">
                      <p className="text-orange-100 text-xs font-bold mb-1 uppercase tracking-wider">Khuyến mãi (Active)</p>
                      <h3 className="text-3xl font-bold">{activeCouponsCount}</h3>
                    </div>
                    <Award size={80} className="absolute -right-4 -bottom-4 text-white opacity-20 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <TrendingUp className="text-brand-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">Top Sản Phẩm Bán Chạy</h3>
                      <p className="text-sm text-gray-500">Xếp hạng theo số lượng đã bán</p>
                    </div>
                  </div>
                  
                  {topProducts.length === 0 ? (
                    <div className="p-16 text-center text-gray-500">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <ShoppingBag size={32} className="text-gray-300" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-1">Chưa có đủ dữ liệu thống kê</p>
                      <p className="text-sm">Hãy duyệt hoặc hoàn thành các đơn hàng để hệ thống ghi nhận.</p>
                    </div>
                  ) : (
                    <div className="p-0 overflow-x-auto">
                      <div className="min-w-[700px]">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50/80 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <div className="col-span-1 text-center">Hạng</div>
                          <div className="col-span-5">Sản phẩm</div>
                          <div className="col-span-3 text-center">Số lượng bán</div>
                          <div className="col-span-3 text-right pr-4">Doanh thu</div>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                          {topProducts.map((p, idx) => (
                            <div key={p._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                              <div className="col-span-1 flex justify-center">
                                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-600 ring-4 ring-yellow-50' : idx === 1 ? 'bg-gray-200 text-gray-600 ring-4 ring-gray-50' : idx === 2 ? 'bg-orange-100 text-orange-600 ring-4 ring-orange-50' : 'bg-gray-50 text-gray-400'}`}>
                                  {idx + 1}
                                </span>
                              </div>
                              <div className="col-span-5 pr-4">
                                <p className="font-bold text-gray-800 line-clamp-2 text-sm leading-tight mb-1">{p.title}</p>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                  OEM: {p.oem_code}
                                </span>
                              </div>
                              <div className="col-span-3">
                                <div className="flex flex-col gap-1.5 items-center">
                                  <span className="font-bold text-lg text-brand-primary leading-none">{p.total_quantity}</span>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[140px] overflow-hidden">
                                    <div className="bg-gradient-to-r from-red-500 to-brand-primary h-1.5 rounded-full relative" style={{ width: `${Math.max(2, (p.total_quantity / maxTopQty) * 100)}%` }}></div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-3 text-right pr-4">
                                <p className="font-bold text-gray-800">{p.total_revenue.toLocaleString('vi-VN')} đ</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <form onSubmit={handleCreateCoupon} className="flex-1 flex gap-4 bg-gray-50 p-4 rounded border">
                  <input required name="code" type="text" placeholder="Nhập mã (VD: VUIHE)" className="p-2 border rounded uppercase font-mono flex-1" />
                  <input required name="val" type="number" placeholder="Số tiền giảm (VND)" className="p-2 border rounded flex-1" />
                  <button type="submit" className="bg-brand-dark text-white px-4 py-2 rounded font-bold hover:bg-black">Tạo Mã</button>
                </form>
                {selectedCouponIds.length > 0 && (
                  <div className="flex items-center">
                    <button 
                      onClick={handleBulkDeleteCoupons}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap h-full"
                    >
                      <Trash2 size={16} />
                      Xóa mục đã chọn ({selectedCouponIds.length})
                    </button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border text-center w-10">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer"
                          checked={pagedCoupons.length > 0 && selectedCouponIds.length === pagedCoupons.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCouponIds(pagedCoupons.map(c => c._id));
                            else setSelectedCouponIds([]);
                          }}
                        />
                      </th>
                      <th className="p-3 border">Mã Giảm Giá</th>
                      <th className="p-3 border text-right">Giá trị giảm</th>
                      <th className="p-3 border text-center">Trạng thái</th>
                      <th className="p-3 border text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCoupons.map(c => (
                      <tr key={c._id} className={`border-b ${selectedCouponIds.includes(c._id) ? 'bg-blue-50/50' : ''}`}>
                        <td className="p-3 text-center border">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedCouponIds.includes(c._id)}
                            onChange={() => {
                              if (selectedCouponIds.includes(c._id)) setSelectedCouponIds(selectedCouponIds.filter(id => id !== c._id));
                              else setSelectedCouponIds([...selectedCouponIds, c._id]);
                            }}
                          />
                        </td>
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
                {renderPagination(couponPages)}
              </div>
            </div>
          )}

          {/* DEVICES TAB */}
          {activeTab === 'devices' && <DeviceManager />}
              </>
            );
          })()}
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
