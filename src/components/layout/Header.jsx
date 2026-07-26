import React, { useEffect, useState } from 'react';
import { ClipboardList, LogOut, Menu, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';

export default function Header({
  navigateTo,
  cartCount,
  searchKeyword,
  onSearchChange,
  user,
  onLoginClick,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const compact = window.scrollY > 120;
      setIsCompact(compact);
      if (compact) setIsMenuOpen(false);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (view) => {
    navigateTo(view);
    setIsMenuOpen(false);
  };

  const displayName = (user?.name || user?.full_name || '').split(' ').filter(Boolean).pop();

  return (
    <>
      <header className={`bg-brand-dark text-white sticky top-0 z-50 shadow-md transition-all duration-300 ${isCompact ? 'shadow-lg' : ''}`}>
        <div className={`max-w-[1200px] mx-auto px-4 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 sm:gap-4 transition-all duration-300 ${isCompact ? 'py-2' : 'py-3 sm:py-4'}`}>
          <div className="flex items-center justify-between w-full sm:w-auto">
            <button
              type="button"
              onClick={() => goTo(user?.role === 'admin' ? 'admin' : 'home')}
              className={`font-bold tracking-wider text-brand-primary cursor-pointer select-none flex-shrink-0 transition-all duration-300 ${isCompact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}
            >
              MAZLAY <span className={`text-white font-light transition-all duration-300 ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>PARTS</span>
            </button>

            <div className="flex items-center gap-4 sm:hidden">
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="text-white hover:text-brand-primary transition-colors"
                title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                type="button"
                onClick={() => goTo('checkout')}
                className="relative flex items-center gap-2 hover:text-brand-primary transition-colors"
                title="Giỏ hàng"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-brand-dark">
                    {cartCount}
                  </span>
                )}
              </button>

              {!isCompact && (
                <button type="button" onClick={() => setIsMenuOpen((value) => !value)} className="text-white hover:text-brand-primary">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>
          </div>

          <div className={`w-full sm:flex-1 sm:max-w-xl mx-0 sm:mx-6 relative order-last sm:order-none overflow-hidden transition-all duration-300 ${
            isCompact ? 'max-h-0 opacity-0 pointer-events-none mt-0 sm:max-w-0 sm:mx-0' : 'max-h-12 opacity-100 mt-2 sm:mt-0'
          }`}>
            <input
              type="text"
              value={searchKeyword || ''}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Nhập mã phụ tùng OEM hoặc tên bộ phận..."
              className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:outline-none focus:border-brand-primary text-sm transition-colors"
            />
          </div>

          <div className={`hidden sm:flex items-center ml-auto shrink-0 text-sm font-semibold transition-all duration-300 ${isCompact ? 'gap-3' : 'gap-4'}`}>
            {!isCompact && <span>Hotline: <span className="text-brand-primary">0901.XXX.XXX</span></span>}

            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center"
              title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user ? (
              <div className={`flex items-center gap-3 bg-neutral-800 rounded-full border border-neutral-700 transition-all duration-300 ${isCompact ? 'px-2 py-1.5' : 'px-3 py-1.5'}`}>
                <button
                  type="button"
                  onClick={() => goTo('profile')}
                  className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                  title="Hồ sơ cá nhân"
                >
                  <User size={16} className="text-brand-primary" />
                  {!isCompact && <span className="text-xs font-bold truncate max-w-[100px]">Chào, {displayName || 'bạn'}</span>}
                </button>

                {user.role === 'admin' && !isCompact && (
                  <>
                    <div className="w-px h-4 bg-neutral-600"></div>
                    <button type="button" onClick={() => goTo('admin')} className="text-[#FF2F2F] hover:text-white transition-colors flex items-center gap-1 font-bold" title="Trang quản trị">
                      <span className="text-xs uppercase">Quản trị</span>
                    </button>
                  </>
                )}

                <div className="w-px h-4 bg-neutral-600"></div>
                <button type="button" onClick={() => goTo('history')} className="text-neutral-400 hover:text-brand-primary transition-colors flex items-center gap-1" title="Lịch sử mua hàng">
                  <ClipboardList size={16} />
                  {!isCompact && <span className="hidden sm:inline text-[10px] uppercase">Lịch sử</span>}
                </button>

                <div className="w-px h-4 bg-neutral-600"></div>
                <button type="button" onClick={onLogout} className="text-neutral-400 hover:text-[#FF2F2F] transition-colors" title="Đăng xuất">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="hover:text-brand-primary transition-colors flex items-center gap-1 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700"
              >
                <User size={16} />
                {!isCompact && <span className="text-xs">Đăng nhập</span>}
              </button>
            )}

            <button
              type="button"
              onClick={() => goTo('checkout')}
              className="relative flex items-center gap-2 hover:text-brand-primary transition-colors"
              title="Giỏ hàng"
            >
              <ShoppingCart size={20} />
              {!isCompact && <span>Giỏ hàng</span>}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-brand-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-brand-dark">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && !isCompact && (
          <div className="sm:hidden border-t border-neutral-700 bg-neutral-900 px-4 py-3 flex flex-col gap-3">
            <div className="text-sm font-semibold">Hotline: <span className="text-brand-primary">0901.XXX.XXX</span></div>
            <button type="button" onClick={onToggleDarkMode} className="flex items-center gap-2 text-neutral-300 text-sm hover:text-brand-primary">
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            </button>

            {user ? (
              <>
                <button type="button" onClick={() => goTo('profile')} className="flex items-center gap-2 text-sm text-brand-primary hover:text-white font-bold w-full text-left">
                  <User size={16} /> Chào, {user.name || user.full_name} (Hồ sơ)
                </button>
                {user.role === 'admin' && (
                  <button type="button" onClick={() => goTo('admin')} className="flex items-center gap-2 text-[#FF2F2F] text-sm font-bold">
                    Quản trị hệ thống
                  </button>
                )}
                <button type="button" onClick={() => goTo('history')} className="flex items-center gap-2 text-neutral-300 text-sm hover:text-brand-primary">
                  <ClipboardList size={16} /> Lịch sử mua hàng
                </button>
                <button type="button" onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-neutral-300 text-sm hover:text-[#FF2F2F]">
                  <LogOut size={16} /> Đăng xuất
                </button>
              </>
            ) : (
              <button type="button" onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-white text-sm hover:text-brand-primary">
                <User size={16} /> Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        )}
      </header>

      {!isCompact && (
        <div className="bg-brand-primary text-white text-center py-1.5 sm:py-2 text-[10px] sm:text-sm font-medium tracking-wide">
          Cam kết chính hãng & OEM - Bao lắp vừa theo số khung (VIN) - Đổi trả miễn phí 7 ngày
        </div>
      )}
    </>
  );
}
