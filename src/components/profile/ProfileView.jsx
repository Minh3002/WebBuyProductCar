import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { User, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';

export default function ProfileView({ user, setUser, onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    full_name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get('/customers/profile');
        setFormData({
          name: response.name || '',
          full_name: response.full_name || '',
          phone: response.phone || '',
          email: response.email || '',
          address: response.address || ''
        });
      } catch (error) {
        console.error('Lỗi khi tải thông tin:', error);
        setMessage({ type: 'error', text: 'Không thể tải thông tin cá nhân. Vui lòng thử lại.' });
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosClient.put('/customers/profile', formData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      
      // Update the user context/state in App.jsx and localStorage
      const updatedUser = { ...user, ...response };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      
      // Clear success message after 3s
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      setMessage({ type: 'error', text: Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-[#E5E5E5] shadow-sm overflow-hidden">
      <div className="bg-brand-dark p-6 text-white relative">
        {onBack && (
          <button onClick={onBack} className="absolute top-6 left-6 text-sm text-neutral-400 hover:text-white transition-colors">
            ← Quay lại
          </button>
        )}
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center border-4 border-neutral-700 mb-4">
            <User size={40} className="text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold">{formData.full_name || formData.name || 'Thành viên Mazlay'}</h2>
          <p className="text-neutral-400 text-sm mt-1 flex items-center gap-1">
            <ShieldCheck size={14} className="text-green-500" /> Đã xác thực
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1 flex items-center gap-2">
                <User size={16} className="text-neutral-500" /> Họ và Tên
              </label>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name} 
                onChange={handleChange}
                className="w-full p-2.5 border rounded focus:border-brand-primary outline-none transition-colors" 
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1 flex items-center gap-2">
                <Phone size={16} className="text-neutral-500" /> Số điện thoại (Định danh)
              </label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone} 
                className="w-full p-2.5 border rounded bg-neutral-100 text-neutral-500 font-bold cursor-not-allowed outline-none" 
                disabled
                title="Số điện thoại là ID định danh không thể thay đổi"
              />
              <p className="text-xs text-neutral-500 mt-1">* Liên hệ Hotline nếu bạn bị mất số này</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-dark mb-1 flex items-center gap-2">
              <Mail size={16} className="text-neutral-500" /> Email liên hệ
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              className="w-full p-2.5 border rounded focus:border-brand-primary outline-none transition-colors" 
              placeholder="VD: nguyenvana@gmail.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-dark mb-1 flex items-center gap-2">
              <MapPin size={16} className="text-neutral-500" /> Địa chỉ giao hàng mặc định
            </label>
            <input 
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleChange}
              className="w-full p-2.5 border rounded focus:border-brand-primary outline-none transition-colors" 
              placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" 
            />
          </div>

          <div className="pt-6 border-t mt-6">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 mx-auto transition-colors ${isLoading ? 'bg-neutral-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-[#cc2525]'}`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <><Save size={20} /> Lưu Thay Đổi</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
