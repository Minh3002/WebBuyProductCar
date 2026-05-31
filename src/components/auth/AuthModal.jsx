import React, { useState } from 'react';
import { X } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    identifier: '',
    phone: '',
    full_name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        const res = await axiosClient.post('/auth/login', {
          identifier: formData.identifier,
          password: formData.password
        });
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      } else {
        await axiosClient.post('/auth/register', {
          phone: formData.phone,
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          address: formData.address
        });
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLoginView(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Tài khoản hoặc mật khẩu không đúng');
      } else if (err.response?.status >= 500 || !err.response) {
        setError('Có lỗi xảy ra, vui lòng thử lại');
      } else {
        setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-black">
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-wide">
              {isLoginView ? 'Đăng nhập' : 'Tạo tài khoản'}
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              {isLoginView ? 'Chào mừng bạn quay trở lại Mazlay Parts' : 'Trở thành khách hàng của Mazlay Parts'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100">
              {typeof error === 'string' ? error : error[0]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoginView ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1">Email hoặc SĐT</label>
                  <input required name="identifier" value={formData.identifier} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#FF2F2F] outline-none" placeholder="Nhập email hoặc sđt" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1">Mật khẩu</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#FF2F2F] outline-none" placeholder="••••••••" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1">Họ và tên *</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#FF2F2F] outline-none" placeholder="Nhập họ tên" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-[#111111] mb-1">Số điện thoại *</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} maxLength={11} className="w-full p-3 border rounded-lg focus:border-[#FF2F2F] outline-none" placeholder="09xxxx" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111111] mb-1">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#FF2F2F] outline-none" placeholder="Tùy chọn" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1">Địa chỉ giao hàng *</label>
                  <input required name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#FF2F2F] outline-none" placeholder="Số nhà, đường, phường/xã..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-1">Mật khẩu *</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-[#FF2F2F] outline-none" placeholder="••••••••" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className={`w-full py-4 text-white font-bold uppercase tracking-wider rounded-lg transition-colors mt-2 ${loading ? 'bg-neutral-400' : 'bg-[#111111] hover:bg-[#FF2F2F]'}`}>
              {loading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Đăng ký ngay')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-500">
              {isLoginView ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            </span>
            <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="ml-2 font-bold text-[#111111] hover:text-[#FF2F2F]">
              {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
