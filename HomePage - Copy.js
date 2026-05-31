'use client';

import { useState } from 'react';

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Má phanh trước Toyota Camry 2019-2022',
    oem: '04465-06120',
    brand: 'Brembo',
    price: 1250000,
    oldPrice: 1500000,
    image:
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=400&auto=format&fit=crop',
    inStock: true,
    compatibility: {
      year: '2020',
      make: 'Toyota',
      model: 'Camry',
      engine: '2.5Q',
    },
    category: 'Bảo dưỡng',
  },
  {
    id: 2,
    title: 'Lọc dầu động cơ Ford Ranger Wildtrak',
    oem: 'JU2Z-6731-A',
    brand: 'Ford Genuine',
    price: 250000,
    oldPrice: 0,
    image:
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop',
    inStock: true,
    compatibility: {
      year: '2021',
      make: 'Ford',
      model: 'Ranger',
      engine: '2.0 Bi-Turbo',
    },
    category: 'Bảo dưỡng',
  },
  {
    id: 3,
    title: 'Giảm xóc trước phải Hyundai SantaFe 2018-2021',
    oem: '54661-A9000',
    brand: 'Mando',
    price: 2100000,
    oldPrice: 2400000,
    image:
      'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=400&auto=format&fit=crop',
    inStock: true,
    compatibility: {
      year: '2020',
      make: 'Hyundai',
      model: 'SantaFe',
      engine: '2.2 Dầu',
    },
    category: 'Hệ thống gầm',
  },
];

const CATEGORIES = ['Tất cả', 'Bảo dưỡng', 'Hệ thống gầm', 'Điện - Điều hòa'];

const FILTER_OPTIONS = {
  years: ['2019', '2020', '2021', '2022'],
  makes: ['Toyota', 'Ford', 'Hyundai', 'Honda'],
  models: ['Camry', 'Ranger', 'SantaFe', 'CRV'],
  engines: ['2.5Q', '2.0 Bi-Turbo', '2.2 Dầu', '1.5 Turbo'],
};

export default function Homepage() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    const matchSearch = cleanQuery
      ? product.title.toLowerCase().includes(cleanQuery) ||
        product.oem.toLowerCase().includes(cleanQuery)
      : true;

    const matchYear = selectedYear
      ? product.compatibility.year === selectedYear
      : true;
    const matchMake = selectedMake
      ? product.compatibility.make === selectedMake
      : true;
    const matchModel = selectedModel
      ? product.compatibility.model === selectedModel
      : true;
    const matchEngine = selectedEngine
      ? product.compatibility.engine === selectedEngine
      : true;
    const matchCategory =
      selectedCategory === 'Tất cả'
        ? true
        : product.category === selectedCategory;

    return (
      matchSearch &&
      matchYear &&
      matchMake &&
      matchModel &&
      matchEngine &&
      matchCategory
    );
  });

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#121212' : '#F8F9FA',
        color: darkMode ? '#E0E0E0' : '#222222',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
      }}
    >
      <style>{`
        .custom-card { 
          background-color: ${darkMode ? '#1E1E1E' : '#FFFFFF'} !important; 
          border-color: ${darkMode ? '#2D2D2D' : '#E5E5E5'} !important; 
        }
        .custom-input { 
          background-color: ${darkMode ? '#2A2A2A' : '#F8F9FA'} !important; 
          color: ${darkMode ? '#FFFFFF' : '#222222'} !important; 
          border-color: ${darkMode ? '#444444' : '#E5E5E5'} !important; 
        }
        .custom-text-title {
          color: ${darkMode ? '#FFFFFF' : '#111111'} !important;
        }
      `}</style>

      <header
        style={{ backgroundColor: darkMode ? '#1A1A1A' : '#111111' }}
        className="text-white sticky top-0 z-50 shadow-md border-b border-neutral-800 transition-colors"
      >
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold tracking-wider text-[#FF2F2F]">
            MAZLAY{' '}
            <span className="text-white text-base font-light">PARTS</span>
          </div>

          <div className="w-full sm:w-1/3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập mã OEM hoặc tên phụ tùng..."
              className="w-full px-4 py-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:outline-none focus:border-[#FF2F2F] text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 border border-neutral-700 text-white"
            >
              {darkMode ? '☀️ Đêm' : '🌙 Ngày'}
            </button>
            <span>
              Hotline: <span className="text-[#FF2F2F]">0901.XXX.XXX</span>
            </span>
          </div>
        </div>
      </header>

      <div className="bg-[#FF2F2F] text-white text-center py-2 text-xs sm:text-sm font-medium tracking-wide">
        ⚡ CAM KẾT CHÍNH HÃNG & OEM — ĐỔI TRẢ MIỄN PHÍ 7 NGÀY
      </div>

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <section className="custom-card p-6 rounded-lg shadow-sm border mb-8 transition-colors">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight custom-text-title">
              Tìm Đúng Chính Xác Phụ Tùng Cho Xe Của Bạn
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] mt-1">
              Chọn thông tin xe bên dưới hoặc gõ trực tiếp vào ô tìm kiếm ở trên
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: '1. Năm sản xuất',
                val: selectedYear,
                set: setSelectedYear,
                opts: FILTER_OPTIONS.years,
                def: '-- Tất cả các năm --',
              },
              {
                label: '2. Hãng xe',
                val: selectedMake,
                set: setSelectedMake,
                opts: FILTER_OPTIONS.makes,
                def: '-- Tất cả các hãng --',
              },
              {
                label: '3. Dòng xe (Model)',
                val: selectedModel,
                set: setSelectedModel,
                opts: FILTER_OPTIONS.models,
                def: '-- Tất cả các dòng --',
              },
              {
                label: '4. Động cơ / Phiên bản',
                val: selectedEngine,
                set: setSelectedEngine,
                opts: FILTER_OPTIONS.engines,
                def: '-- Tất cả động cơ --',
              },
            ].map((filter, idx) => (
              <div key={idx}>
                <label className="block text-xs font-bold text-[#777777] uppercase mb-1">
                  {filter.label}
                </label>
                <select
                  value={filter.val}
                  onChange={(e) => filter.set(e.target.value)}
                  className="custom-input w-full p-2.5 rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer"
                >
                  <option value="">{filter.def}</option>
                  {filter.opts.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 shrink-0">
            <div className="custom-card p-4 rounded-lg shadow-sm border transition-colors">
              <h2 className="text-sm font-bold uppercase tracking-wide border-b border-[#E5E5E5] pb-3 mb-3 custom-text-title">
                Nhóm Phụ Tùng Chính
              </h2>
              <div className="flex flex-wrap md:flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-[#FF2F2F] text-white font-semibold'
                        : 'bg-[#F8F9FA] dark:bg-[#2A2A2A] text-inherit hover:bg-[#E5E5E5]'
                    }`}
                  >
                    🛠️ {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="w-full md:w-3/4">
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase tracking-tight custom-text-title">
                Sản phẩm phù hợp ({filteredProducts.length} mặt hàng)
              </h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="custom-card rounded-lg border overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="w-full aspect-square relative bg-neutral-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-[#777777] font-medium mb-1 truncate">
                        Mã OEM:{' '}
                        <span className="font-bold custom-text-title">
                          {product.oem}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold line-clamp-2 min-h-[36px] sm:min-h-[40px] mb-2 leading-snug custom-text-title">
                        {product.title}
                      </h4>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm sm:text-base font-bold text-[#FF2F2F]">
                        {product.price.toLocaleString('vi-VN')} đ
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert(`Đặt hàng: ${product.title}`)}
                        className="flex-grow text-[11px] sm:text-xs font-bold uppercase py-2 rounded text-center bg-[#FF2F2F] text-white"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
