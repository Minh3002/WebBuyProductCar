export const CATEGORIES = ["Tất cả", "Bảo dưỡng", "Hệ thống gầm", "Điện - Điều hòa", "Thân vỏ"];

export const FILTER_OPTIONS = {
  years: ["2019", "2020", "2021", "2022"],
  makes: ["Toyota", "Ford", "Hyundai", "Honda"],
  models: ["Camry", "Ranger", "SantaFe", "CRV"],
  engines: ["2.5Q", "2.0 Bi-Turbo", "2.2 Dầu", "1.5 Turbo"]
};

export const MOCK_PRODUCTS = [
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
    origin: "Ý (Italy)",
    warranty: "6 tháng hoặc 10.000 km",
    condition: "Mới 100% nguyên hộp",
    description: "Má phanh trước hiệu Brembo cao cấp dành cho Toyota Camry. Sản phẩm có độ bền cao, chịu nhiệt tốt, không gây tiếng ồn rít khó chịu khi phanh và giảm thiểu tối đa bụi phanh bám vào mâm xe.",
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
    description: "Lọc nhớt động cơ chính hãng Ford Motor, giúp giữ lại các tạp chất, cặn bẩn, mạt kim loại sinh ra trong quá trình động cơ vận hành. Bảo vệ hệ thống trục khuỷu, piston khỏi mài mòn sớm.",
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
    description: "Phuộc nhún (Giảm xóc) trước bên phải do Mando Hàn Quốc sản xuất (nhà cung ứng linh kiện gốc cho Hyundai). Giúp xe vận hành êm ái, dập tắt các dao động từ mặt đường nhanh chóng.",
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
    warranty: "3 tháng",
    condition: "Mới 100% nguyên kiện",
    description: "Lốc lạnh (máy nén khí điều hòa) thương hiệu Denso cao cấp. Khả năng làm lạnh nhanh sâu, hoạt động êm ái, tiết kiệm công suất động cơ.",
    specifications: [
      { label: "Loại Gas sử dụng", value: "R134a" },
      { label: "Điện áp ly hợp", value: "12V" },
      { label: "Số rãnh puly", value: "6 rãnh (6PK)" }
    ]
  },
  {
    id: 5,
    title: "Gương chiếu hậu trái tích hợp xi nhan Mazda CX-5",
    oem: "KB8B-69-181A",
    brand: "Mazda Genuine",
    price: 3200000,
    oldPrice: 3500000,
    image: "https://images.unsplash.com/photo-1503376712351-1f9f2510b656?q=80&w=600&auto=format&fit=crop",
    inStock: true,
    category: "Thân vỏ",
    compatibility: { year: "2021", make: "Mazda", model: "CX-5", engine: "2.0L" },
    origin: "Thái Lan",
    warranty: "12 tháng",
    condition: "Mới 100% nguyên hộp",
    description: "Cụm gương chiếu hậu bên trái (tài xế) chính hãng Mazda, tích hợp đèn báo rẽ xi nhan LED. Gập điện tự động, sấy gương chống bám nước.",
    specifications: [
      { label: "Tính năng", value: "Chỉnh điện, gập điện, sấy gương" },
      { label: "Bóng xi nhan", value: "Full LED" },
      { label: "Màu sơn ốp", value: "Mộc (chưa sơn)" }
    ]
  }
];
