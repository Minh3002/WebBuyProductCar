'use client';

import { useState } from 'react';

// ─── 1. DỮ LIỆU GIẢ LẬP ĐẦY ĐỦ (BỔ SUNG THÊM THÔNG SỐ CHI TIẾT) ───
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Má phanh trước Toyota Camry 2019-2022",
    oem: "04465-06120",
    brand: "Brembo",
    price: 1250000,
    oldPrice: 1500000,
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop",
    inStock: true,
    category: "Bảo dưỡng",
    compatibility: { year: "2020", make: "Toyota", model: "Camry", engine: "2.5Q" },
    // Dữ liệu mở rộng cho trang chi tiết:
    origin: "Ý (Italy)",
    warranty: "6 tháng hoặc 10.000 km",
    condition: "Mới 100% nguyên hộp",
    description: "Má phanh trước hiệu Brembo cao cấp dành cho Toyota Camry. Sản phẩm có độ bền cao, chịu nhiệt tốt, không gây tiếng ồn rít khó chịu khi phanh và giảm thiểu tối đa bụi phanh bám vào mâm xe. Đạt tiêu chuẩn an toàn nghiêm ngặt của châu Âu.",
    specifications: [
      { label: "Vị trí lắp đặt", value: "Bánh trước (Trái / Phải)" },
      { label: "Chất liệu cấu tạo", value: "Gốm cao cấp (Ceramic)" },
      { label: "Độ dày tiêu chuẩn", value: "17.5 mm" },
      { label: "Chiều dài mặt phanh", value: "142 mm" }
    ]
  },
  {
    id: 2,
    title: "Lọc dầu động cơ Ford Ranger Wildtrak",
    oem: "JU2Z-6731-A",
    brand: "Ford Genuine",
    price: 250000,
    oldPrice: 0,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop",
    inStock: true,
    category: "Bảo dưỡng",
    compatibility: { year: "2021", make: "Ford", model: "Ranger", engine: "2.0 Bi-Turbo" },
    origin: "Thái Lan",
    warranty: "Đổi mới nếu phát hiện lỗi lắp ráp",
    condition: "Mới 100% chính hãng",
    description: "Lọc nhớt động cơ chính hãng Ford Motor, giúp giữ lại các tạp chất, cặn bẩn, mạt kim loại sinh ra trong quá trình động cơ vận hành. Bảo vệ hệ thống trục khuỷu, piston khỏi mài mòn sớm, duy trì độ sạch của dầu máy.",
    specifications: [
      { label: "Loại lọc", value: "Lọc giấy / Giấy lọc cao cấp" },
      { label: "Chu kỳ thay thế", value: "Mỗi 5.000 - 8.000 km" },
      { label: "Đường kính ron", value: "62 mm" }
    ]
  },
  {
    id: 3,
    title: "Giảm xóc trước phải Hyundai SantaFe 2018-2021",
    oem: "54661-A9000",
    brand: "Mando",
    price: 2100000,
    oldPrice: 2400000,
    image: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=600&auto=format&fit=crop",
    inStock: true,
    category: "Hệ thống gầm",
    compatibility: { year: "2020", make: "Hyundai", model: "SantaFe", engine: "2.2 Dầu" },
    origin: "Hàn Quốc",
    warranty: "12 tháng",
    condition: "Mới 100% theo tiêu chuẩn OES",
    description: "Phuộc nhún (Giảm xóc) trước bên phải do Mando Hàn Quốc sản xuất (nhà cung ứng linh kiện gốc cho Hyundai). Giúp xe vận hành êm ái, dập tắt các dao động từ mặt đường nhanh chóng, đảm bảo độ bám đường tốt khi vào cua.",
    specifications: [
      { label: "Loại giảm xóc", value: "Giảm xóc giảm chấn áp suất ga" },
      { label: "Hệ thống treo", value: "McPherson" },
      { label: "Trọng lượng", value: "4.8 kg" }
    ]
  },
  {
    id: 4,
    title: "Lốc điều hòa (Máy nén) Honda CRV 2017-2021",
    oem: "38810-5AA-A01",
    brand: "Denso",
    price: 5800000,
    oldPrice: 6500000,
    image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop",
    inStock: false,
    category: "Điện - Điều hòa",
    compatibility: { year: "2019", make: "Honda", model: "CRV", engine: "1.5 Turbo" },
    origin: "Nhật Bản",
    warranty: "3 tháng (Bảo hành lỗi lốc kêu, không bảo hành chết biên do bẩn hệ thống)",
    condition: "Mới 100% nguyên kiện",
    description: "Lốc lạnh (máy nén khí điều hòa) thương hiệu Denso cao cấp. Khả năng làm lạnh nhanh sâu, hoạt động êm ái, tiết kiệm công suất động cơ. Lưu ý kỹ thuật: Cần súc rửa toàn bộ hệ thống đường ống và thay phin lọc gas khi thay lốc mới.",
    specifications: [
      { label: "Loại Gas sử dụng", value: "R134a" },
      { label: "Điện áp ly hợp", value: "12V" },
      { label: "Số rãnh puly", value: "6 rãnh (6PK)" }
    ]
  }
];

const CATEGORIES = ["Tất cả", "Bảo dưỡng", "Hệ thống gầm", "Điện - Điều hòa", "Thân vỏ"];

const FILTER_OPTIONS = {
  years: ["2019", "2020", "2021", "2022"],
  makes: ["Toyota", "Ford", "Hyundai", "Honda"],
  models: ["Camry", "Ranger", "SantaFe", "CRV"],
  engines: ["2.5Q", "2.0 Bi-Turbo", "2.2 Dầu", "1.5 Turbo"]
};

export default function App() {
  // ─── ĐIỀU HƯỚNG GIẢ LẬP (ROUTING) ───
  // currentPage: 'home' hoặc 'detail'
  const [currentPage, setCurrentPage] = useState('home');
  // Lưu ID của sản phẩm đang được bấm vào xem chi tiết
  const [activeProductId, setActiveProductId] = useState(null);

  // ─── TRẠNG THÁI BỘ LỌC Ở TRANG CHỦ ───
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Hàm chuyển sang xem chi tiết sản phẩm
  const navigateToDetail = (id) => {
    setActiveProductId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang
  };

  // Hàm quay lại trang chủ
  const navigateToHome = () => {
    setCurrentPage('home');
  };

  // Tìm đối tượng sản phẩm hiện tại để truyền vào trang chi tiết
  const currentProduct = MOCK_PRODUCTS.find(p => p.id === activeProductId);

  // Lọc sản phẩm ở trang chủ
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchYear = selectedYear ? product.compatibility.year === selectedYear : true;
    const matchMake = selectedMake ? product.compatibility.make === selectedMake : true;
    const matchModel = selectedModel ? product.compatibility.model === selectedModel : true;
    const matchEngine = selectedEngine ? product.compatibility.engine === selectedEngine : true;
    const matchCategory = selectedCategory === 'Tất cả' ? true : product.category === selectedCategory;
    return matchYear && matchMake && matchModel && matchEngine && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#222222] font-sans">
      
      {/* ─── HEADER DÙNG CHUNG ─── */}
      <header className="bg-[#111111] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div 
            onClick={navigateToHome}
            className="text-2xl font-bold tracking-wider text-[#FF2F2F] cursor-pointer select-none"
          >
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
            <button onClick={navigateToHome} className="hover:text-[#FF2F2F] transition-colors">Trang chủ</button>
            <span>Hotline: <span className="text-[#FF2F2F]">0901.XXX.XXX</span></span>
          </div>
        </div>
      </header>

      <div className="bg-[#FF2F2F] text-white text-center py-2 text-xs sm:text-sm font-medium tracking-wide">
        ⚡ CAM KẾT CHÍNH HÃNG & OEM — BAO LẮP VỪA THEO SỐ KHUNG (VIN) — ĐỔI TRẢ MIỄN PHÍ 7 NGÀY
      </div>

      {/* ─── GIAO DIỆN THAY ĐỔI THEO TRANG VÀO ĐÂY ─── */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        
        {currentPage === 'home' ? (
          /* ========================================================
             GIAO DIỆN TRANG CHỦ (HOME PAGE)
             ======================================================== */
          <>
            {/* Bộ lọc tìm kiếm thông minh */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E5E5] mb-8">
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-[#111111] uppercase tracking-tight">
                  Tìm Đúng Chính Xác Phụ Tùng Cho Xe Của Bạn
                </h1>
                <p className="text-xs sm:text-sm text-[#777777] mt-1">Chọn dòng xe của bạn để hệ thống tự lọc phụ tùng chuẩn xác nhất</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#777777] uppercase mb-1">1. Năm sản xuất</label>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer">
                    <option value="">-- Tất cả các năm --</option>
                    {FILTER_OPTIONS.years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#777777] uppercase mb-1">2. Hãng xe</label>
                  <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer">
                    <option value="">-- Tất cả các hãng --</option>
                    {FILTER_OPTIONS.makes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#777777] uppercase mb-1">3. Dòng xe (Model)</label>
                  <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer">
                    <option value="">-- Tất cả các dòng --</option>
                    {FILTER_OPTIONS.models.map(md => <option key={md} value={md}>{md}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#777777] uppercase mb-1">4. Động cơ / Phiên bản</label>
                  <select value={selectedEngine} onChange={(e) => setSelectedEngine(e.target.value)} className="w-full p-2.5 bg-[#F8F9FA] border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#FF2F2F] cursor-pointer">
                    <option value="">-- Tất cả động cơ --</option>
                    {FILTER_OPTIONS.engines.map(eg => <option key={eg} value={eg}>{eg}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Layout thân trang chủ */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Danh mục bên trái */}
              <aside className="w-full md:w-1/4 shrink-0">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E5E5E5]">
                  <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wide border-b border-[#E5E5E5] pb-3 mb-3">Nhóm Phụ Tùng Chính</h2>
                  <div className="flex flex-wrap md:flex-col gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 ${selectedCategory === cat ? 'bg-[#111111] text-white font-semibold' : 'bg-[#F8F9FA] hover:bg-[#E5E5E5] text-[#222222]'}`}>
                        🛠️ {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Lưới sản phẩm bên phải */}
              <section className="w-full md:w-3/4">
                <div className="mb-4">
                  <h3 className="text-base font-bold uppercase tracking-tight text-[#111111]">Sản phẩm phù hợp ({filteredProducts.length})</h3>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-lg border border-[#E5E5E5]">
                    <p className="text-[#777777] font-medium text-sm">Không tìm thấy phụ tùng phù hợp.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300 group">
                        
                        {/* Ảnh - Bấm vào ảnh để xem chi tiết */}
                        <div onClick={() => navigateToDetail(product.id)} className="w-full aspect-square relative bg-neutral-100 overflow-hidden cursor-pointer">
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider ${product.inStock ? 'bg-emerald-600' : 'bg-neutral-500'}`}>
                            {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                          </span>
                        </div>

                        {/* Nội dung Card */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] text-[#777777] mb-1">Mã OEM: <span className="font-bold text-[#222222]">{product.oem}</span></div>
                            {/* Tiêu đề - Bấm vào tiêu đề để xem chi tiết */}
                            <h4 onClick={() => navigateToDetail(product.id)} className="text-sm font-semibold text-[#222222] hover:text-[#FF2F2F] cursor-pointer line-clamp-2 min-h-[40px] mb-2 transition-colors">
                              {product.title}
                            </h4>
                          </div>

                          <div className="mb-4">
                            <div className="text-base font-bold text-[#FF2F2F]">{product.price.toLocaleString('vi-VN')} đ</div>
                            {product.oldPrice > 0 && <div className="text-xs text-[#777777] line-through">{product.oldPrice.toLocaleString('vi-VN')} đ</div>}
                          </div>

                          <div className="flex gap-2">
                            <button onClick={() => navigateToDetail(product.id)} className="flex-grow text-xs font-bold uppercase py-2 rounded text-center bg-neutral-100 hover:bg-[#111111] hover:text-white text-[#111111] transition-all border border-[#E5E5E5]">
                              Xem Chi Tiết
                            </button>
                            <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="w-10 bg-[#0068FF] text-white flex items-center justify-center rounded text-sm">💬</a>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
          /* ========================================================
             GIAO DIỆN TRANG CHI TIẾT SẢN PHẨM (PRODUCT DETAIL PAGE)
             ======================================================== */
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-4 sm:p-8 shadow-sm">
            
            {/* Nút quay lại tiện lợi */}
            <button 
              onClick={navigateToHome}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#777777] hover:text-[#FF2F2F] transition-colors"
            >
              ⬅ Quay lại danh sách sản phẩm
            </button>

            {/* Khối chính: Ảnh bên trái - Thông tin đặt hàng bên phải */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              
              {/* Cột Trái: Ảnh lớn thực tế của phụ tùng */}
              <div className="w-full aspect-square bg-neutral-50 rounded-lg overflow-hidden border border-[#E5E5E5]">
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Cột Phải: Panel thông tin & Nút mua ngay */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-700">
                      Thương hiệu: {currentProduct.brand}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold text-white ${currentProduct.inStock ? 'bg-emerald-600' : 'bg-neutral-500'}`}>
                      {currentProduct.inStock ? 'Còn hàng tại kho' : 'Hết hàng tạm thời'}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-[#111111] leading-tight mb-4">
                    {currentProduct.title}
                  </h1>

                  {/* Vùng hiển thị mã phụ tùng cực kỳ nổi bật */}
                  <div className="bg-[#F8F9FA] p-3 rounded border border-[#E5E5E5] mb-4">
                    <div className="text-xs text-[#777777] font-medium uppercase tracking-wider">Mã phụ tùng chuẩn (OEM / Part Number):</div>
                    <div className="text-lg font-mono font-bold text-[#111111] mt-0.5 select-all">{currentProduct.oem}</div>
                  </div>

                  {/* Khối hiển thị giá */}
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl sm:text-3xl font-black text-[#FF2F2F]">
                      {currentProduct.price.toLocaleString('vi-VN')} đ
                    </span>
                    {currentProduct.oldPrice > 0 && (
                      <span className="text-sm text-[#777777] line-through">
                        {currentProduct.oldPrice.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>

                  {/* Tóm tắt nhanh thông số xuất xứ */}
                  <div className="grid grid-cols-2 gap-y-2 text-sm border-t border-b border-[#E5E5E5] py-3 mb-6">
                    <div><span className="text-[#777777]">Xuất xứ:</span> <span className="font-semibold">{currentProduct.origin}</span></div>
                    <div><span className="text-[#777777]">Tình trạng:</span> <span className="font-semibold text-emerald-600">{currentProduct.condition}</span></div>
                    <div className="col-span-2"><span className="text-[#777777]">Bảo hành:</span> <span className="font-semibold text-[#111111]">{currentProduct.warranty}</span></div>
                  </div>
                </div>

                {/* HÀNH ĐỘNG MUA HÀNG VÀ TƯ VẤN THIẾT KẾ TO, RÕ RÀNG */}
                <div className="space-y-3">
                  <button 
                    disabled={!currentProduct.inStock}
                    onClick={() => alert(`📦 [ĐẶT HÀNG THÀNH CÔNG]\n\nBạn đã chọn mua: ${currentProduct.title}\nMã OEM: ${currentProduct.oem}\n\nKỹ thuật viên MAZLAY sẽ gọi điện cho bạn ngay để xin số khung (VIN) xe trước khi gửi hàng nhằm đảm bảo chính xác 100%.`)}
                    className={`w-full py-4 rounded-lg font-bold text-center uppercase tracking-wide text-sm sm:text-base shadow transition-all ${
                      currentProduct.inStock 
                        ? 'bg-[#FF2F2F] text-white hover:bg-[#111111]' 
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    {currentProduct.inStock ? '🛒 Mua Ngay - Giao Hàng Toàn Quốc' : '❌ Hết hàng - Đăng ký nhận tin khi có hàng'}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href="https://zalo.me" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="border border-[#0068FF] text-[#0068FF] bg-blue-50/50 hover:bg-blue-50 py-3 rounded-lg text-center font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      💬 Chat Tư Vấn Zalo
                    </a>
                    <a 
                      href="tel:0901000000" 
                      className="border border-[#111111] bg-white text-[#111111] hover:bg-neutral-50 py-3 rounded-lg text-center font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      📞 Gọi Hotline Kỹ Thuật
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Khối dưới: Chi tiết thông số kỹ thuật & Mô tả sản phẩm */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#E5E5E5] pt-8">
              
              {/* Bảng thông số kỹ thuật chi tiết */}
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#111111] mb-3">
                  Thông số kỹ thuật
                </h3>
                <div className="border border-[#E5E5E5] rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {currentProduct.specifications.map((spec, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-white'}>
                          <td className="px-3 py-2.5 text-[#777777] font-medium">{spec.label}</td>
                          <td className="px-3 py-2.5 font-semibold text-[#222222] text-right">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Check độ tương thích */}
                <div className="mt-4 p-4 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  📌 <strong>Khuyên dùng:</strong> Hãy gửi <strong>Số khung xe (17 ký tự VIN)</strong> in trên kính chắn gió hoặc đăng kiểm cho Mazlay qua Zalo, đội ngũ kỹ thuật sẽ tra cứu chính xác tuyệt đối sơ đồ lắp ráp của nhà máy cho bạn.
                </div>
              </div>

              {/* Bài viết mô tả chi tiết linh kiện */}
              <div className="md:col-span-2 space-y-4 text-sm text-[#444444] leading-relaxed">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#111111]">
                  Mô tả chi tiết sản phẩm
                </h3>
                <p className="font-medium text-[#222222]">
                  {currentProduct.description}
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg space-y-2 border border-[#E5E5E5]">
                  <h4 className="font-bold text-[#111111] text-xs uppercase tracking-wide text-[#FF2F2F]">
                    ✓ Quyền lợi khi mua hàng tại Mazlay Parts:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-neutral-700">
                    <li>Hoàn tiền 100% nếu sản phẩm giao đến không đúng với mã OEM đã thỏa thuận.</li>
                    <li>Hỗ trợ ship COD kiểm tra hàng chuẩn chỉnh mới cần thanh toán tiền.</li>
                    <li>Sản phẩm đi kèm tem chống hàng giả và phiếu bảo hành chính thức.</li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}