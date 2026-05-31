'use client';

import { useState } from 'react';

// ─── 1. DỮ LIỆU GIẢ LẬP (MOCK DATA) ĐƯỢC TÍCH HỢP TRỰC TIẾP ───
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Má phanh trước Toyota Camry 2019-2022",
    oem: "04465-06120",
    brand: "Brembo",
    price: 1250000,
    oldPrice: 1500000,
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=400&auto=format&fit=crop",
    inStock: true,
    compatibility: { year: "2020", make: "Toyota", model: "Camry", engine: "2.5Q" },
    category: "Bảo dưỡng"
  },
  {
    id: 2,
    title: "Lọc dầu động cơ Ford Ranger Wildtrak",
    oem: "JU2Z-6731-A",
    brand: "Ford Genuine",
    price: 250000,
    oldPrice: 0,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop",
    inStock: true,
    compatibility: { year: "2021", make: "Ford", model: "Ranger", engine: "2.0 Bi-Turbo" },
    category: "Bảo dưỡng"
  },
  {
    id: 3,
    title: "Giảm xóc trước phải Hyundai SantaFe 2018-2021",
    oem: "54661-A9000",
    brand: "Mando",
    price: 2100000,
    oldPrice: 2400000,
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=400&auto=format&fit=crop",
    inStock: true,
    compatibility: { year: "2020", make: "Hyundai", model: "SantaFe", engine: "2.2 Dầu" },
    category: "Hệ thống gầm"
  },
  {
    id: 4,
    title: "Lốc điều hòa (Máy nén) Honda CRV 2017-2021",
    oem: "38810-5AA-A01",
    brand: "Denso",
    price: 5800000,
    oldPrice: 6500000,
    image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=400&auto=format&fit=crop",
    inStock: false, // Trạng thái hết hàng để test giao diện khóa nút mua
    compatibility: { year: "2019", make: "Honda", model: "CRV", engine: "1.5 Turbo" },
    category: "Điện - Điều hòa"
  }
];

const CATEGORIES = ["Tất cả", "Bảo dưỡng", "Hệ thống gầm", "Điện - Điều hòa", "Thân vỏ"];

const FILTER_OPTIONS = {
  years: ["2019", "2020", "2021", "2022"],
  makes: ["Toyota", "Ford", "Hyundai", "Honda"],
  models: ["Camry", "Ranger", "SantaFe", "CRV"],
  engines: ["2.5Q", "2.0 Bi-Turbo", "2.2 Dầu", "1.5 Turbo"]
};

// ─── 2. GIAO DIỆN CHÍNH CỦA TRANG WEB ───
export default function Homepage() {
  // Quản lý trạng thái bộ lọc xe
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  // Quản lý trạng thái danh mục sản phẩm bên trái
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Logic tự động lọc dữ liệu bằng React khi người dùng tương tác
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchYear = selectedYear ? product.compatibility.year === selectedYear : true;
    const matchMake = selectedMake ? product.compatibility.make === selectedMake : true;
    const matchModel = selectedModel ? product.compatibility.model === selectedModel : true;
    const matchEngine = selectedEngine ? product.compatibility.engine === selectedEngine : true;
    const matchCategory = selectedCategory === 'Tất cả' ? true : product.category === selectedCategory;
    
    return matchYear && matchMake && matchModel && matchEngine && matchCategory;
  });

  // Hàm xóa nhanh các tiêu chí bộ lọc xe đưa về mặc định
  const handleResetFilter = () => {
    setSelectedYear('');
    setSelectedMake('');
    setSelectedModel('');
    setSelectedEngine('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#222222] font-sans">
      
      {/* HEADER CHUẨN STYLE MAZLAY */}
      <header className="bg-[#111111] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold tracking-wider text-[#FF2F2F]">
            MAZLAY <span className="text-white text-base font-light">PARTS</span>
          </div>
          <div className="w-full sm:w-1/2 relative">
            <input 
              type="text" 
              placeholder="Nhập nhanh mã phụ tùng OEM hoặc tên bộ phận cần tìm..." 
              className="w-full px-4 py-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:outline-none focus:border-[#FF2F2F] text-sm"
            />
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span>Hotline: <span className="text-[#FF2F2F]">0901.XXX.XXX</span></span>
          </div>
        </div>
      </header>

      {/* Thanh cam kết chất lượng tạo độ tin tưởng */}
      <div className="bg-[#FF2F2F] text-white text-center py-2 text-xs sm:text-sm font-medium tracking-wide">
        ⚡ CAM KẾT CHÍNH HÃNG & OEM — BAO LẮP VỪA THEO SỐ KHUNG (VIN) — ĐỔI TRẢ MIỄN PHÍ 7 NGÀY
      </div>

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        
        {/* KHỐI 1: BỘ LỌC TÌM KIẾM THÔNG MINH (4 BƯỚC) */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E5E5] mb-8">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#111111] uppercase tracking-tight">
              Tìm Đúng Chính Xác Phụ Tùng Cho Xe Của Bạn
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] mt-1">Chọn thông tin xe bên dưới để hệ thống tự động lọc linh kiện tương thích</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#777777] uppercase mb-1">1. Năm sản xuất</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer"
              >
                <option value="">-- Tất cả các năm --</option>
                {FILTER_OPTIONS.years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#777777] uppercase mb-1">2. Hãng xe</label>
              <select 
                value={selectedMake} 
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer"
              >
                <option value="">-- Tất cả các hãng --</option>
                {FILTER_OPTIONS.makes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#777777] uppercase mb-1">3. Dòng xe (Model)</label>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer"
              >
                <option value="">-- Tất cả các dòng --</option>
                {FILTER_OPTIONS.models.map(md => <option key={md} value={md}>{md}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#777777] uppercase mb-1">4. Động cơ / Phiên bản</label>
              <select 
                value={selectedEngine} 
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer"
              >
                <option value="">-- Tất cả động cơ --</option>
                {FILTER_OPTIONS.engines.map(eg => <option key={eg} value={eg}>{eg}</option>)}
              </select>
            </div>
          </div>

          {/* Hiện nút xóa nhanh bộ lọc xe nếu người dùng đang chọn ít nhất 1 mục */}
          {(selectedYear || selectedMake || selectedModel || selectedEngine) && (
            <div className="mt-4 text-right">
              <button 
                onClick={handleResetFilter} 
                className="text-xs text-[#FF2F2F] font-semibold hover:underline"
              >
                ✕ Xóa bộ lọc xe, hiển thị lại tất cả phụ tùng
              </button>
            </div>
          )}
        </section>

        {/* KHỐI 2: THÂN TRANG (DANH MỤC TRÁI & GRID SẢN PHẨM PHẢI) */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* CỘT TRÁI: Thanh Danh mục phụ tùng dọc */}
          <aside className="w-full md:w-1/4 shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E5E5E5]">
              <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wide border-b border-[#E5E5E5] pb-3 mb-3">
                Nhóm Phụ Tùng Chính
              </h2>
              <div className="flex flex-wrap md:flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 ${
                      selectedCategory === cat 
                        ? 'bg-[#111111] text-white font-semibold' 
                        : 'bg-[#F8F9FA] hover:bg-[#E5E5E5] text-[#222222]'
                    }`}
                  >
                    {cat === "Tất cả" ? "📦 " : "🛠️ "} {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CỘT PHẢI: Hiển thị danh sách các Card sản phẩm phụ tùng */}
          <section className="w-full md:w-3/4">
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                Sản phẩm phù hợp ({filteredProducts.length} mặt hàng)
              </h3>
            </div>

            {/* Trường hợp bộ lọc tìm kiếm không ra kết quả nào */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-lg border border-[#E5E5E5]">
                <p className="text-[#777777] font-medium text-sm">Không tìm thấy phụ tùng phù hợp với đời xe bạn đã chọn.</p>
                <p className="text-xs text-[#777777] mt-1">Bạn vui lòng điều chỉnh lại bộ lọc xe hoặc bấm nút chat Zalo bên dưới để được kỹ thuật viên hỗ trợ.</p>
              </div>
            ) : (
              // Lưới hiển thị Card: Tự động chia 2 cột trên Mobile và 3 cột trên máy tính PC
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300 group"
                  >
                    {/* Ảnh sản phẩm vuông tỉ lệ 1:1 */}
                    <div className="w-full aspect-square relative bg-neutral-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Nhãn hiển thị trạng thái kho */}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider ${
                        product.inStock ? 'bg-emerald-600' : 'bg-neutral-500'
                      }`}>
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </div>

                    {/* Khối nội dung chi tiết sản phẩm phụ tùng */}
                    <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Hiển thị Mã OEM và Hãng sản xuất linh kiện */}
                        <div className="text-[11px] text-[#777777] font-medium mb-1 truncate">
                          Mã OEM: <span className="font-bold text-[#222222]">{product.oem}</span> | Hãng: {product.brand}
                        </div>
                        {/* Tên sản phẩm hiển thị tối đa 2 dòng */}
                        <h4 className="text-xs sm:text-sm font-semibold text-[#222222] line-clamp-2 min-h-[36px] sm:min-h-[40px] mb-2 leading-snug">
                          {product.title}
                        </h4>
                      </div>

                      {/* Khu vực giá bán linh kiện */}
                      <div className="mb-4">
                        <div className="text-sm sm:text-base font-bold text-[#FF2F2F]">
                          {product.price.toLocaleString('vi-VN')} đ
                        </div>
                        {product.oldPrice > 0 && (
                          <div className="text-[11px] text-[#777777] line-through">
                            {product.oldPrice.toLocaleString('vi-VN')} đ
                          </div>
                        )}
                      </div>

                      {/* Bộ đôi nút hành động nhanh ở đáy mỗi Card sản phẩm */}
                      <div className="flex gap-2">
                        <button 
                          disabled={!product.inStock}
                          onClick={() => alert(`[Form Đặt Hàng Nhanh] Đã lưu thông tin sản phẩm: ${product.title}. Vui lòng điền Tên và SĐT nhận hàng!`)}
                          className={`flex-grow text-[11px] sm:text-xs font-bold uppercase py-2 rounded text-center transition-colors duration-200 ${
                            product.inStock 
                              ? 'bg-[#FF2F2F] hover:bg-[#111111] text-white' 
                              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          }`}
                        >
                          {product.inStock ? 'Mua ngay' : 'Hết hàng'}
                        </button>
                        <a 
                          href="https://zalo.me"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 bg-[#0068FF] hover:bg-blue-700 text-white flex items-center justify-center rounded transition-colors duration-200 text-sm"
                          title="Tư vấn kỹ thuật qua Zalo"
                        >
                          💬
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}