import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShieldAlert, CreditCard, Banknote } from 'lucide-react';

import GuideWiki from './GuideWiki';
import axiosClient from '../../api/axiosClient';

export default function CheckoutView({ cartItems, setCartItems, onBack, onOrderSuccess, user }) {
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: user?.identifier || user?.phone || '',
    address: user?.address || '',
    vin: '',
    paymentMethod: 'cod'
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCouponApplying, setIsCouponApplying] = useState(false);

  // Tự động cập nhật nếu user thay đổi (đăng nhập sau khi vào giỏ hàng)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        phone: user.identifier || user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const [vinError, setVinError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Xử lý Validate số VIN Real-time
  const handleVinChange = (e) => {
    let value = e.target.value.toUpperCase();

    // Chặn nhập I, O, Q
    value = value.replace(/[IOQ]/g, '');

    // Giới hạn 17 ký tự
    if (value.length > 17) value = value.slice(0, 17);

    setFormData(prev => ({ ...prev, vin: value }));

    if (value.length > 0 && value.length < 17) {
      setVinError('Số VIN phải đủ 17 ký tự.');
    } else {
      setVinError('');
    }
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsCouponApplying(true);
    setCouponMessage('');
    try {
      const res = await axiosClient.post('/coupons/validate', { code: couponCode });
      setDiscountValue(res.discount_value);
      setCouponMessage('Áp dụng mã thành công!');
    } catch (err) {
      setDiscountValue(0);
      setCouponMessage(err.response?.data?.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setIsCouponApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setDiscountValue(0);
    setCouponMessage('');
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.vin.length !== 17) {
      setVinError('Vui lòng nhập đủ 17 ký tự số khung.');
      return;
    }
    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_phone: formData.phone,
        customer_name: formData.name,
        shipping_address: formData.address,
        vin_number: formData.vin,
        payment_method: formData.paymentMethod === 'cod' ? 'COD' : 'TRANSFER',
        total_amount: totalAmount - discountValue,
        items: cartItems.map(item => ({
          product_id: item._id || item.id,
          title: item.title,
          oem_code: item.oem_code || item.oem,
          price_at_purchase: item.price,
          quantity: item.quantity
        }))
      };

      await axiosClient.post('/orders', orderPayload);
      alert('Đặt hàng thành công! Đơn hàng của bạn đã được chuyển tới Admin (Mến) để duyệt.');
      if (onOrderSuccess) onOrderSuccess();
    } catch (error) {
      console.error('Submit order error:', error);
      const errorMsg = error.response?.data?.message;
      alert('Lỗi: ' + (Array.isArray(errorMsg) ? errorMsg.join(', ') : (errorMsg || 'Không thể gửi đơn hàng. Vui lòng thử lại.')));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-12 text-center shadow-sm">
        <h2 className="text-xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <button onClick={onBack} className="bg-brand-primary text-white px-6 py-2 rounded-lg font-bold">
          Quay lại mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* CỘT TRÁI: THÔNG TIN ĐƠN HÀNG */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 shadow-sm">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#777777] hover:text-brand-primary">
          <ArrowLeft size={16} /> Tiếp tục mua sắm
        </button>

        <h2 className="text-xl font-bold border-b pb-4 mb-4">Sản phẩm đã chọn ({cartItems.length})</h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {cartItems.map(item => (
            <div key={item.id || item._id} className="flex gap-4 border border-[#E5E5E5] p-3 rounded-lg">
              <img src={item.image_url || item.image || 'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=400&auto=format&fit=crop'} alt={item.title} className="w-20 h-20 object-cover rounded bg-neutral-100" />
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-brand-dark line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-[#777777] mt-1">Mã: {item.oem}</p>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-brand-primary">{item.price.toLocaleString('vi-VN')} đ</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200">-</button>
                      <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-[#FF2F2F] hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4">
          <div className="flex justify-between text-lg font-bold mb-2">
            <span>Tạm tính:</span>
            <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
          </div>
          {discountValue > 0 && (
            <div className="flex justify-between text-lg font-bold text-green-600 mb-2">
              <span>Giảm giá:</span>
              <span>- {discountValue.toLocaleString('vi-VN')} đ</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Tổng cộng:</span>
            <span className="text-brand-primary text-2xl">{(totalAmount - discountValue).toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: FORM THANH TOÁN */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 shadow-sm">
        <h2 className="text-xl font-bold border-b pb-4 mb-6">Thông tin nhận hàng</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-1">Họ và tên *</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border rounded focus:border-brand-primary outline-none" placeholder="Nhập họ tên" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Số điện thoại *</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} maxLength={11} className="w-full p-2.5 border rounded focus:border-brand-primary outline-none" placeholder="09xxxx" />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Số khung xe (VIN) *</label>
              <input
                required
                type="text"
                value={formData.vin}
                onChange={handleVinChange}
                maxLength={17}
                className={`w-full p-2.5 border rounded outline-none font-mono font-bold tracking-wider uppercase ${vinError ? 'border-brand-primary bg-red-50' : 'focus:border-brand-primary'}`}
                placeholder="Gồm 17 ký tự"
              />
              {vinError && <p className="text-xs text-brand-primary mt-1 font-semibold">{vinError}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-dark mb-1">Địa chỉ giao hàng *</label>
            <input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2.5 border rounded focus:border-brand-primary outline-none" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-bold mb-3">Phương thức thanh toán</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="payment" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })} className="accent-brand-primary w-4 h-4" />
                <Banknote size={20} className="text-emerald-600" />
                <span className="font-semibold">Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="payment" checked={formData.paymentMethod === 'transfer'} onChange={() => setFormData({ ...formData, paymentMethod: 'transfer' })} className="accent-brand-primary w-4 h-4" />
                <CreditCard size={20} className="text-blue-600" />
                <span className="font-semibold">Chuyển khoản ngân hàng</span>
              </label>
            </div>

            {formData.paymentMethod === 'transfer' && (
              <div className="mt-4 p-4 bg-neutral-50 border rounded-lg flex flex-col items-center text-center">
                <img
                  src={`https://img.vietqr.io/image/VPBank-286957358-compact.png?amount=${totalAmount - discountValue}&addInfo=Thanh%20toan%20don%20hang%20SĐT%20${formData.phone}&accountName=NGUYEN%20TIEN%20MINH`}
                  alt="QR Code Thanh Toán"
                  className="w-48 h-48 mb-3 rounded-lg shadow-sm"
                />
                <p className="font-bold text-brand-dark">Ngân hàng VPBank</p>
                <p className="font-mono text-lg font-bold text-brand-primary tracking-widest mt-1">286957358</p>
                <p className="text-sm">Chủ TK: TRƯƠNG GIA MINH</p>
                <p className="text-xs text-gray-500 mt-2">Quét mã QR để thanh toán chính xác số tiền</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-bold mb-3">Mã giảm giá</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={discountValue > 0}
                placeholder="Nhập mã giảm giá..."
                className="flex-grow p-2.5 border rounded focus:border-brand-primary outline-none uppercase"
              />
              {discountValue > 0 ? (
                <button type="button" onClick={handleRemoveCoupon} className="px-4 py-2 bg-neutral-200 text-neutral-700 font-bold rounded hover:bg-neutral-300">
                  Hủy mã
                </button>
              ) : (
                <button type="button" onClick={handleApplyCoupon} disabled={!couponCode || isCouponApplying} className="px-4 py-2 bg-brand-dark text-white font-bold rounded hover:bg-black disabled:bg-neutral-400">
                  {isCouponApplying ? 'Đang kiểm tra...' : 'Áp dụng'}
                </button>
              )}
            </div>
            {couponMessage && (
              <p className={`text-xs mt-2 font-semibold ${discountValue > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {couponMessage}
              </p>
            )}
          </div>

          <GuideWiki />

          <button
            type="submit"
            disabled={isSubmitting || formData.vin.length !== 17}
            className={`w-full text-white font-bold py-4 rounded-lg uppercase tracking-wider transition-colors shadow-md mt-6 ${(isSubmitting || formData.vin.length !== 17) ? 'bg-neutral-400 cursor-not-allowed' : 'bg-[#FF2F2F] hover:bg-[#111111]'}`}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
        </form>
      </div>
    </div>
  );
}
