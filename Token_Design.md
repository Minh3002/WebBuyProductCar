# Xray Design Token - Dự án Website Phụ Tùng Ô Tô (Style: Mazlay)

Tài liệu này định nghĩa hệ thống Design Tokens (màu sắc, kiểu chữ, khoảng cách, bo góc) dựa trên giao diện mẫu Mazlay Car Accessories Shop, phục vụ cho việc phát triển đồng bộ giao diện Web một trang (Search-Centric Dashboard) tối ưu UX.

---

## 1. Color Tokens (Hệ thống màu sắc)

Hệ thống màu lấy cảm hứng từ phong cách thể thao, cơ khí mạnh mẽ của Mazlay: Nền sáng thanh lịch, màu nhấn Đỏ Đô kích thích hành động, màu Zalo tích hợp đồng bộ.

### 1.1. Brand Colors (Màu thương hiệu & Điểm nhấn)
| Token Name | Hex Value | Kiểu áp dụng (Usage) |
| :--- | :--- | :--- |
| `color-brand-primary` | `#FF2F2F` | Màu Đỏ Đô chủ đạo của Mazlay. Dùng cho nút "MUA NGAY", giá tiền, trạng thái active, icon nổi bật. |
| `color-brand-secondary` | `#0068FF` | Màu Xanh dương thương hiệu Zalo. Dùng riêng cho nút "TƯ VẤN ZALO". |
| `color-brand-dark` | `#111111` | Màu đen sâu. Dùng cho Header chính, chữ tiêu đề lớn, nền bộ lọc (nếu chọn Dark mode). |

### 1.2. Neutral Colors (Màu trung tính - Chữ & Nền)
| Token Name | Hex Value | Kiểu áp dụng (Usage) |
| :--- | :--- | :--- |
| `color-text-main` | `#222222` | Màu chữ chính (Tên sản phẩm, văn bản rõ ràng). |
| `color-text-muted` | `#777777` | Màu chữ phụ (Mã OEM/Part Number, Thương hiệu phụ, ngày tháng). |
| `color-bg-main` | `#FFFFFF` | Nền trắng tinh cho toàn bộ website và các Card sản phẩm. |
| `color-bg-surface` | `#F8F9FA` | Nền xám rất nhẹ cho Hộp lọc thông minh (Hero Filter) hoặc các khoảng đệm phân tách khối. |
| `color-border` | `#E5E5E5` | Màu đường kẻ viền (Border) của ô input bộ lọc, đường chia cắt card. |

---

## 2. Typography Tokens (Hệ thống kiểu chữ)

Ưu tiên các font chữ không chân (Sans-serif) dày dặn, bo tròn nhẹ góc cạnh để hiện đại và dễ đọc thông số kỹ thuật.
*   **Font Family chính:** `font-family-sans`: `'Inter', 'Roboto', sans-serif;`

| Token Name | Font Size | Font Weight | Line Height | Kiểu áp dụng (Usage) |
| :--- | :--- | :--- | :--- | :--- |
| `typography-h1` | `32px` | `700` (Bold) | `1.2` | Tiêu đề lớn trên Banner / Hộp lọc |
| `typography-h2` | `24px` | `600` (SemiBold)| `1.3` | Tiêu đề khối (Ví dụ: "DANH MỤC SẢN PHẨM") |
| `typography-product-title`| `16px` | `500` (Medium)  | `1.4` | Tên sản phẩm trên Card |
| `typography-product-price`| `18px` | `700` (Bold)    | `1.2` | Giá tiền sản phẩm (Màu đỏ) |
| `typography-body` | `14px` | `400` (Regular) | `1.5` | Văn bản thường, mã OEM, mô tả chi tiết |
| `typography-button` | `15px` | `600` (SemiBold)| `1.0` | Chữ trong nút bấm (MUA NGAY, TÌM KIẾM) |

---

## 3. Spacing & Layout Tokens (Khoảng cách & Bố cục)

Mazlay sử dụng khoảng cách vừa phải để hiển thị tối đa thông tin sản phẩm nhưng không bị rối mắt.

| Token Name | Value | Kiểu áp dụng (Usage) |
| :--- | :--- | :--- |
| `spacing-xs` | `8px` | Khoảng cách giữa mã OEM và Tên sản phẩm bên trong Card. |
| `spacing-sm` | `16px` | Khoảng cách giữa các thành phần trong Card; padding trong ô Input bộ lọc. |
| `spacing-md` | `24px` | Khoảng cách (Gap) giữa các Card sản phẩm với nhau (Lưới Grid). |
| `spacing-lg` | `40px` | Khoảng cách trên/dưới giữa Hộp lọc và Danh sách sản phẩm. |
| `layout-max-width`| `1200px` | Chiều rộng tối đa của nội dung trang web khi hiển thị trên PC. |

---

## 4. Component Design Tokens (Cấu trúc chi tiết khối)

Định nghĩa trực quan cho cấu trúc "Trang gộp" và "Card sản phẩm" theo đúng đặc trưng Mazlay.

### 4.1. Hero Filter Box (Hộp lọc thông minh 4 bước)
*   **Background:** `color-bg-surface` (`#F8F9FA`)
*   **Border Radius:** `8px` (Bo góc nhẹ công nghệ)
*   **Box Shadow:** `0px 4px 20px rgba(0, 0, 0, 0.05)` (Đổ bóng mờ nhẹ để nổi bật trên nền web)
*   **Dropdown Select Item:** Nền trắng, viền `color-border`, khi click hiện danh sách chọn mượt mà bằng Ajax.

### 4.2. Product Card (Ô hiển thị sản phẩm)
*   **Background:** `color-bg-main` (`#FFFFFF`)
*   **Border Radius:** `6px`
*   **Border:** `1px solid color-border` (`#E5E5E5`)
*   **Hover Effect (Hiệu ứng di chuột):** 
    *   Box Shadow tăng từ mờ lên rõ hơn: `0px 8px 24px rgba(0, 0, 0, 0.1)`
    *   Nút bấm chuyển đổi trạng thái nhẹ (Transition `0.3s ease-in-out`).
*   **Layout inside Card (Bố cục trong ô):**
    *   Phía trên: Ảnh sản phẩm (tỷ lệ vuông 1:1).
    *   Giữa: Thương hiệu $\rightarrow$ Tên sản phẩm $\rightarrow$ Mã OEM $\rightarrow$ Giá tiền đỏ.
    *   Dưới cùng: 2 nút bấm song song chia theo tỷ lệ chiều ngang `70%` cho nút "MUA NGAY" và `30%` cho nút "ZALO" (hoặc hiển thị full width xếp chồng trên mobile).

### 4.3. Buttons (Nút hành động)
*   **Button Primary (MUA NGAY / TÌM PHỤ TÙNG):** 
    *   Background: `color-brand-primary` (`#FF2F2F`)
    *   Text Color: `#FFFFFF`
    *   Hover: Giảm tone đỏ hoặc đổi sang màu đen `color-brand-dark`.
*   **Button Zalo (TƯ VẤN ZALO):**
    *   Background: `color-brand-secondary` (`#0068FF`)
    *   Text Color: `#FFFFFF`