# 🗄️ Tài Liệu Thiết Kế Database MongoDB - Dự Án Mazlay Parts

Tài liệu này định nghĩa cấu trúc dữ liệu (Schema) sử dụng hệ quản trị cơ sở dữ liệu MongoDB và thư viện Mongoose (ODM) cho hệ thống website bán phụ tùng ô tô tinh gọn Mazlay Parts.

---

## 1. Kiến Trúc Tổng Quan (Collections)

Hệ thống sử dụng giải pháp **Embedding (Nhúng dữ liệu)** để tối ưu tốc độ đọc, giúp bộ lọc 4 tầng (`Năm` -> `Hãng` -> `Model` -> `Động cơ`) chạy real-time mà không cần dùng lệnh JOIN phức tạp.

Hệ thống gồm 4 Collections chính:
* `products`: Quản lý linh kiện, mã OEM và cấu trúc tương thích xe.
* `customers`: Quản lý thông tin khách hàng (Định danh bằng Số điện thoại).
* `orders`: Quản lý đơn hàng, thông tin số khung (VIN) và trạng thái duyệt.
* `admins`: Quản lý tài khoản quản trị viên và nhân viên.

---

## 2. Định Nghĩa Chi Tiết Schema & Code Mongoose

### 2.1. Collection: Products (Sản phẩm & Tương thích)
* **Mục đích:** Lưu trữ thông tin chi tiết phụ tùng và mảng các đời xe có thể lắp đặt.
* **Mongoose Schema Code:**

```javascript
const mongoose = require('mongoose');

const CompatibilitySchema = new mongoose.Schema({
  year: { type: String, required: true },       // Ví dụ: "2020"
  make: { type: String, required: true },       // Ví dụ: "Toyota"
  model: { type: String, required: true },      // Ví dụ: "Camry"
  engine: { type: String, required: true }      // Ví dụ: "2.5Q"
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  oem_code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  old_price: { type: Number, default: 0 },
  category: { type: String, required: true, enum: ['Bảo dưỡng', 'Gầm', 'Điện', 'Thân vỏ'] },
  image_url: { type: String, default: '' },
  stock_quantity: { type: Number, required: true, default: 0, min: 0 },
  in_stock: { type: Boolean, default: true },
  specifications: {
    origin: { type: String, default: '' },
    warranty: { type: String, default: '' },
    condition: { type: String, default: 'Mới 100%' }
  },
  compatibility: [CompatibilitySchema], // Mảng chứa các dòng xe tương thích
  description: { type: String, default: '' }
}, { timestamps: true });

// LẬP CHỈ MỤC (INDEX) TỐI ƯU BỘ LỌC 4 TẦNG & TÌM KIẾM OEM
ProductSchema.index({ 
  "compatibility.year": 1, 
  "compatibility.make": 1, 
  "compatibility.model": 1, 
  "compatibility.engine": 1 
}, { name: "idx_car_filter" });

ProductSchema.index({ oem_code: "text", title: "text" }, { name: "idx_search_text" });

module.exports = mongoose.model('Product', ProductSchema);