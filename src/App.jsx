import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import FilterBox from './components/dashboard/FilterBox';
import ProductCard from './components/dashboard/ProductCard';
import ProductView from './components/product/ProductView';
import CheckoutView from './components/checkout/CheckoutView';
import AuthModal from './components/auth/AuthModal';
import PurchaseHistory from './components/history/PurchaseHistory';
import ProfileView from './components/profile/ProfileView';
import AdminDashboard from './components/admin/AdminDashboard';
import AiChatWidget from './components/chat/AiChatWidget';
import SkeletonCard from './components/common/SkeletonCard';
import RecentPurchaseToast from './components/notifications/RecentPurchaseToast';
import axiosClient from './api/axiosClient';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Helper for Fuzzy Search
const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
};

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'detail', 'checkout'
  const [activeProductId, setActiveProductId] = useState(null);
  
  const [cartItems, setCartItems] = useState([]);
  
  const [filters, setFilters] = useState({ year: '', make: '', model: '', engine: '' });
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Khôi phục user từ LocalStorage khi load web
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'admin') {
          setCurrentView('admin');
        }
      } catch (e) {
        console.error('Lỗi phân tích user từ localstorage');
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  // 1. Fetch TẤT CẢ sản phẩm 1 lần khi load app để làm data cho bộ lọc
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get('/products');
        setAllProducts(Array.isArray(response) ? response : (response.data || []));
      } catch (err) {
        setError('Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
        console.error("Fetch products error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // 2. Gom tuỳ chọn động cho FilterBox (dựa vào danh sách allProducts và filters hiện tại)
  const filterOptions = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return { years: [], makes: [], models: [], engines: [] };

    const getCompatibilities = (product) => {
      return Array.isArray(product.compatibility) ? product.compatibility : [];
    };

    // Năm (Lấy tất cả năm có trong data)
    const years = [...new Set(allProducts.flatMap(p => getCompatibilities(p).map(c => c.year)))].filter(Boolean).sort();
    
    // Hãng (Lọc theo Năm nếu có chọn)
    const makes = [...new Set(allProducts.flatMap(p => 
      getCompatibilities(p).filter(c => !filters.year || c.year === filters.year).map(c => c.make)
    ))].filter(Boolean).sort();

    // Model (Lọc theo Năm và Hãng)
    const models = [...new Set(allProducts.flatMap(p => 
      getCompatibilities(p).filter(c => 
        (!filters.year || c.year === filters.year) &&
        (!filters.make || c.make === filters.make)
      ).map(c => c.model)
    ))].filter(Boolean).sort();

    // Động cơ (Lọc theo Năm, Hãng, Model)
    const engines = [...new Set(allProducts.flatMap(p => 
      getCompatibilities(p).filter(c => 
        (!filters.year || c.year === filters.year) &&
        (!filters.make || c.make === filters.make) &&
        (!filters.model || c.model === filters.model)
      ).map(c => c.engine)
    ))].filter(Boolean).sort();

    return { years, makes, models, engines };
  }, [allProducts, filters]);

  // 3. Lọc danh sách sản phẩm (Theo 4 tầng dropdown + Category + Fuzzy Search)
  const displayedProducts = useMemo(() => {
    let result = allProducts;

    // Lọc theo Category
    if (selectedCategory && selectedCategory !== 'Tất cả') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Lọc theo 4 tầng Dropdown (Quét mảng compatibility)
    if (filters.year || filters.make || filters.model || filters.engine) {
      result = result.filter(product => {
        const compats = Array.isArray(product.compatibility) ? product.compatibility : [];
        return compats.some(c => 
          (!filters.year || c.year === filters.year) &&
          (!filters.make || c.make === filters.make) &&
          (!filters.model || c.model === filters.model) &&
          (!filters.engine || c.engine === filters.engine)
        );
      });
    }

    // Lọc Fuzzy Search
    if (searchKeyword) {
      const keyword = normalizeString(searchKeyword);
      result = result.filter(product => {
        const titleMatches = normalizeString(product.title).includes(keyword);
        const oemMatches = normalizeString(product.oem_code || product.oem).includes(keyword);
        const brandMatches = normalizeString(product.brand).includes(keyword);
        
        // Quét tìm trong mảng compatibility (tìm theo model hoặc make)
        const compats = Array.isArray(product.compatibility) ? product.compatibility : [];
        const compatMatches = compats.some(c => 
          normalizeString(c.model).includes(keyword) || 
          normalizeString(c.make).includes(keyword)
        );

        return titleMatches || oemMatches || brandMatches || compatMatches;
      });
    }

    // Sắp xếp
    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allProducts, filters, selectedCategory, searchKeyword, sortOrder]);

  const handleResetFilters = () => setFilters({ year: '', make: '', model: '', engine: '' });

  const navigateTo = (view, productId = null) => {
    setCurrentView(view);
    if (productId) setActiveProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickBuy = (product) => {
    setCartItems(prev => {
      // Helper function to safely get ID
      const getProductId = (p) => p._id || p.id;
      const targetId = getProductId(product);

      const existing = prev.find(item => getProductId(item) === targetId);
      if (existing) {
        return prev.map(item => getProductId(item) === targetId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`Đã thêm ${product.title} vào giỏ hàng!`);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      navigateTo('admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#222222] font-sans pb-12 transition-colors duration-300 dark:bg-[#0B0F14] dark:text-neutral-100">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
      <Header 
        navigateTo={navigateTo} 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />
      
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {currentView === 'home' && (
          <>
            <FilterBox 
              filters={filters} 
              setFilters={setFilters} 
              onReset={handleResetFilters} 
              filterOptions={filterOptions}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <div className="flex flex-col md:flex-row gap-8">
              <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              
              <section className="w-full md:w-3/4">
                <div className="mb-4">
                  <h3 className="text-base font-bold uppercase tracking-tight text-[#111111] dark:text-neutral-100">
                    Sản phẩm phù hợp ({displayedProducts.length})
                  </h3>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SkeletonCard key={n} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-white p-12 text-center rounded-lg border border-red-300 shadow-sm dark:bg-[#111827] dark:border-red-900/70">
                    <p className="text-red-500 font-medium text-sm">{error}</p>
                  </div>
                ) : displayedProducts.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-lg border border-[#E5E5E5] shadow-sm dark:bg-[#111827] dark:border-neutral-800">
                    <p className="text-[#111111] font-bold text-lg mb-2 dark:text-neutral-100">
                      Không tìm thấy phụ tùng phù hợp với xe của bạn.
                    </p>
                    <p className="text-[#777777] font-medium text-sm mb-6 dark:text-neutral-400">
                      Vui lòng liên hệ Kỹ thuật viên qua Zalo để tra cứu trực tiếp!
                    </p>
                    <a 
                      href="https://zalo.me" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0068FF] hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                    >
                      💬 Chat Zalo Kỹ Thuật Viên
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {displayedProducts.map(product => (
                      <ProductCard 
                        key={product._id || product.id} 
                        product={product} 
                        onSelect={(id) => navigateTo('detail', id)}
                        onQuickBuy={handleQuickBuy}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        {currentView === 'detail' && (
          <ProductView 
            productId={activeProductId} 
            onBack={() => navigateTo('home')}
            onAddToCart={(product) => { handleQuickBuy(product); navigateTo('checkout'); }}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView 
            cartItems={cartItems}
            setCartItems={setCartItems}
            onBack={() => navigateTo('home')}
            user={user}
            onOrderSuccess={() => {
              setCartItems([]);
              navigateTo('home');
            }}
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard 
            user={user} 
            onBack={() => navigateTo('home')} 
            handleLogout={handleLogout}
          />
        )}

        {currentView === 'history' && (
          <PurchaseHistory 
            user={user} 
            onBack={() => navigateTo('home')} 
            handleLogout={handleLogout} 
          />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            user={user} 
            setUser={setUser}
            onBack={() => navigateTo('home')} 
          />
        )}
      </main>
      
      <AiChatWidget />
      <RecentPurchaseToast />
    </div>
  );
}
