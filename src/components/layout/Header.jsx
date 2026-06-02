import React from 'react';
import { ShoppingCart, User, LogOut, ClipboardList } from 'lucide-react';

export default function Header({ navigateTo, cartCount, searchKeyword, onSearchChange, user, onLoginClick, onLogout }) {
  return (
    <>
      <header className="bg-brand-dark text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div 
            onClick={() => navigateTo(user?.role === 'admin' ? 'admin' : 'home')}
            className="text-2xl font-bold tracking-wider text-brand-primary cursor-pointer select-none flex-shrink-0"
          >
            MAZLAY <span className="text-white text-base font-light">PARTS</span>
          </div>
          
          <div className="w-full sm:w-1/2 relative">
            <input 
              type="text" 
              value={searchKeyword || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Nhập nhanh mã phụ tùng OEM hoặc tên bộ phận..." 
              className="w-full px-4 py-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:outline-none focus:border-brand-primary text-sm"
            />
          </div>
          
          <div className="flex items-center gap-6 text-sm font-semibold">
            <span className="hidden sm:inline">Hotline: <span className="text-brand-primary">0901.XXX.XXX</span></span>
            
            {user ? (
              <div className="flex items-center gap-3 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
                <div className="flex items-center gap-2 cursor-pointer hover:text-brand-primary transition-colors">
                  <User size={16} className="text-brand-primary" />
                  <span className="text-xs font-bold truncate max-w-[100px]">Chào, {(user.name || user.full_name)?.split(' ').pop() || user.name || user.full_name}</span>
                </div>
                {user.role === 'admin' && (
                  <>
                    <div className="w-px h-4 bg-neutral-600"></div>
                    <button onClick={() => navigateTo('admin')} className="text-[#FF2F2F] hover:text-white transition-colors flex items-center gap-1 font-bold" title="Trang Quản trị">
                      <span className="text-xs uppercase">Quản trị</span>
                    </button>
                  </>
                )}
                <div className="w-px h-4 bg-neutral-600"></div>
                <button onClick={() => navigateTo('history')} className="text-neutral-400 hover:text-brand-primary transition-colors flex items-center gap-1" title="Lịch sử mua hàng">
                  <ClipboardList size={16} /> <span className="hidden sm:inline text-[10px] uppercase">Lịch sử</span>
                </button>
                <div className="w-px h-4 bg-neutral-600"></div>
                <button onClick={onLogout} className="text-neutral-400 hover:text-[#FF2F2F] transition-colors" title="Đăng xuất">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="hover:text-brand-primary transition-colors flex items-center gap-1 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700"
              >
                <User size={16} /> <span className="text-xs">Đăng nhập</span>
              </button>
            )}

            <button 
              onClick={() => navigateTo('checkout')}
              className="relative flex items-center gap-2 hover:text-brand-primary transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-brand-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-brand-dark">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="bg-brand-primary text-white text-center py-2 text-xs sm:text-sm font-medium tracking-wide">
        ⚡ CAM KẾT CHÍNH HÃNG & OEM — BAO LẮP VỪA THEO SỐ KHUNG (VIN) — ĐỔI TRẢ MIỄN PHÍ 7 NGÀY
      </div>
    </>
  );
}
