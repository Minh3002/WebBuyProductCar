const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Không tìm thấy MONGODB_URI trong file .env!");
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  title: String,
  oem_code: String,
  brand: String,
  price: Number,
  old_price: Number,
  in_stock: Boolean,
  stock_quantity: Number,
  compatibility: {
    year: String,
    make: String,
    model: String,
    engine: String,
  },
  category: String,
  image_url: String,
  specifications: [{ key: String, value: String }],
  description: String,
  origin: String,
  warranty: String,
  condition: String,
}, { timestamps: true });

// Tên collection có thể là 'products'
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const SEED_DATA = [
  {
    title: "Má phanh trước Toyota Camry 2019-2022",
    oem_code: "04465-06120",
    brand: "Brembo",
    price: 1250000,
    old_price: 1500000,
    in_stock: true,
    stock_quantity: 50,
    compatibility: { year: "2020", make: "Toyota", model: "Camry", engine: "2.5Q" },
    category: "Bảo dưỡng",
    image_url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=400&auto=format&fit=crop",
    specifications: [
      { key: "Loại xe", value: "Toyota Camry" },
      { key: "Vị trí", value: "Bánh trước" }
    ],
    description: "Má phanh chất lượng cao từ Brembo, đảm bảo an toàn tuyệt đối cho hành trình của bạn.",
    origin: "Nhật Bản",
    warranty: "12 Tháng",
    condition: "Mới 100%"
  },
  {
    title: "Lọc dầu động cơ Ford Ranger Wildtrak",
    oem_code: "JU2Z-6731-A",
    brand: "Ford Genuine",
    price: 250000,
    old_price: 0,
    in_stock: true,
    stock_quantity: 100,
    compatibility: { year: "2021", make: "Ford", model: "Ranger", engine: "2.0 Bi-Turbo" },
    category: "Bảo dưỡng",
    image_url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop",
    specifications: [
      { key: "Khả năng lọc", value: "99%" },
      { key: "Tuổi thọ", value: "10.000 km" }
    ],
    description: "Lọc dầu chính hãng Ford giúp bảo vệ động cơ, kéo dài tuổi thọ nhớt.",
    origin: "Thái Lan",
    warranty: "Không bảo hành",
    condition: "Mới 100%"
  },
  {
    title: "Giảm xóc trước phải Hyundai SantaFe 2018-2021",
    oem_code: "54661-A9000",
    brand: "Mando",
    price: 2100000,
    old_price: 2400000,
    in_stock: true,
    stock_quantity: 15,
    compatibility: { year: "2020", make: "Hyundai", model: "SantaFe", engine: "2.2 Dầu" },
    category: "Hệ thống gầm",
    image_url: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=400&auto=format&fit=crop",
    specifications: [
      { key: "Vị trí", value: "Trước phải" },
      { key: "Loại phuộc", value: "Phuộc dầu" }
    ],
    description: "Giảm xóc Mando chính hãng OEM cho Hyundai, mang lại cảm giác lái êm ái.",
    origin: "Hàn Quốc",
    warranty: "6 Tháng",
    condition: "Mới 100%"
  },
  {
    title: "Lốc điều hòa (Máy nén) Honda CRV 2017-2021",
    oem_code: "38810-5AA-A01",
    brand: "Denso",
    price: 5800000,
    old_price: 6500000,
    in_stock: false,
    stock_quantity: 0,
    compatibility: { year: "2019", make: "Honda", model: "CRV", engine: "1.5 Turbo" },
    category: "Điện - Điều hòa",
    image_url: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=400&auto=format&fit=crop",
    specifications: [
      { key: "Điện áp", value: "12V" },
      { key: "Loại gas", value: "R134a" }
    ],
    description: "Lốc lạnh Denso cao cấp, làm lạnh nhanh và sâu cho Honda CRV.",
    origin: "Nhật Bản",
    warranty: "12 Tháng",
    condition: "Mới 100%"
  },
  {
    title: "Bugi Iridium Toyota Vios 2018+",
    oem_code: "90919-01253",
    brand: "Denso Iridium",
    price: 180000,
    old_price: 220000,
    in_stock: true,
    stock_quantity: 200,
    compatibility: { year: "2019", make: "Toyota", model: "Vios", engine: "1.5L" },
    category: "Bảo dưỡng",
    image_url: "https://images.unsplash.com/photo-1590408544464-92759e663a8e?q=80&w=400&auto=format&fit=crop",
    specifications: [
      { key: "Chất liệu", value: "Iridium" },
      { key: "Đầu đánh lửa", value: "0.4mm" }
    ],
    description: "Bugi đánh lửa cực mạnh, tiết kiệm nhiên liệu, tăng tốc tốt hơn.",
    origin: "Nhật Bản",
    warranty: "30.000 km",
    condition: "Mới 100%"
  }
];

const seedDB = async () => {
  try {
    console.log("Đang kết nối tới MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối thành công! Đang xóa dữ liệu cũ (tuỳ chọn)...");
    
    // Nếu muốn xoá sạch trước khi thêm thì dùng dòng dưới:
    // await Product.deleteMany({});
    
    console.log("Đang thêm dữ liệu seed...");
    await Product.insertMany(SEED_DATA);
    
    console.log("Hoàn thành thêm dữ liệu!");
    process.exit(0);
  } catch (error) {
    console.error("Lỗi khi seed data:", error);
    process.exit(1);
  }
};

seedDB();
