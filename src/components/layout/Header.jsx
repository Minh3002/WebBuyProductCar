import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, ClipboardList, Menu, X } from 'lucide-react';

export default function Header({ navigateTo, cartCount, searchKeyword, onSearchChange, user, onLoginClick, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-brand-dark text-white sticky top-0 z-50 shadow-md transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-4 py-3 sm:py-4 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 sm:gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div 
              onClick={() => navigateTo(user?.role === 'admin' ? 'admin' : 'home')}
              className="text-xl sm:text-2xl font-bold tracking-wider text-brand-primary cursor-pointer select-none flex-shrink-0"
            >
              MAZLAY <span className="text-white text-sm sm:text-base font-light">PARTS</span>
            </div>

            <div className="flex items-center gap-4 sm:hidden">
              <button 
                onClick={() => navigateTo('checkout')}
                className="relative flex items-center gap-2 hover:text-brand-primary transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-brand-dark">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-brand-primary">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="w-full sm:flex-1 sm:max-w-xl mx-0 sm:mx-6 relative order-last sm:order-none mt-2 sm:mt-0">
            <input 
              type="text" 
              value={searchKeyword || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Nhập mã phụ tùng OEM hoặc tên bộ phận..." 
              className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:outline-none focus:border-brand-primary text-sm transition-colors"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4 ml-auto shrink-0 text-sm font-semibold">
            <span>Hotline: <span className="text-brand-primary">0901.XXX.XXX</span></span>
            
            {user ? (
              <div className="flex items-center gap-3 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
                <div className="flex items-center gap-2 hover:text-brand-primary transition-colors cursor-pointer">
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
              <span>Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-brand-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-brand-dark">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-neutral-700 bg-neutral-900 px-4 py-3 flex flex-col gap-3">
            <div className="text-sm font-semibold">Hotline: <span className="text-brand-primary">0901.XXX.XXX</span></div>
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-brand-primary" />
                  <span className="font-bold">Chào, {user.name || user.full_name}</span>
                </div>
                {user.role === 'admin' && (
                  <button onClick={() => { navigateTo('admin'); setIsMenuOpen(false); }} className="flex items-center gap-2 text-[#FF2F2F] text-sm font-bold">
                    Quản trị hệ thống
                  </button>
                )}
                <button onClick={() => { navigateTo('history'); setIsMenuOpen(false); }} className="flex items-center gap-2 text-neutral-300 text-sm hover:text-brand-primary">
                  <ClipboardList size={16} /> Lịch sử mua hàng
                </button>
                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-neutral-300 text-sm hover:text-[#FF2F2F]">
                  <LogOut size={16} /> Đăng xuất
                </button>
              </>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 text-white text-sm hover:text-brand-primary"
              >
                <User size={16} /> Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        )}
      </header>

      <div className="bg-brand-primary text-white text-center py-1.5 sm:py-2 text-[10px] sm:text-sm font-medium tracking-wide">
        ⚡ CAM KẾT CHÍNH HÃNG & OEM — BAO LẮP VỪA THEO SỐ KHUNG (VIN) — ĐỔI TRẢ MIỄN PHÍ 7 NGÀY
      </div>
    </>
  );
}
