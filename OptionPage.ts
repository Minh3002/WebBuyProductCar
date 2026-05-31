"use client";

import React, { useState } from 'react';

// ==========================================
// DỮ LIỆU BÀI VIẾT HƯỚNG DẪN (MOCK WIKI DATA)
// ==========================================
const guidesData = {
  vin: {
    title: "🔍 Cách tìm Số Khung (VIN) chính xác trên xe",
    description: "Số khung (VIN) gồm 17 ký tự (cả chữ và số). Kỹ thuật viên của ML Enterprise cần số này để tra cứu chính xác 100% sơ đồ phụ tùng của đời xe bạn.",
    steps: [
      { title: "Góc kính chắn gió phía người lái", content: "Nhìn từ bên ngoài xe qua kính chắn gió, số VIN thường được dập trên một miếng thẻ kim loại nhỏ nằm sát góc dưới bên trái." },
      { title: "Khung cửa bên cạnh ghế lái", content: "Mở cửa xe phía người lái và quan sát phần chốt cửa hoặc cột B. Bạn sẽ thấy một nhãn dán màu đen hoặc bạc chứa đầy đủ thông tin số VIN, áp suất lốp." },
      { title: "Trên lốc máy (Dưới nắp capo)", content: "Mở nắp capo, số VIN có thể được dập trực tiếp trên khối động cơ hoặc vách ngăn giữa khoang máy và cabin." },
      { title: "Kiểm tra giấy tờ xe (Nhanh nhất)", content: "Nếu không muốn ra xe tra cứu, số VIN được ghi rõ ràng trên Giấy đăng ký xe (Cà vẹt) hoặc Giấy chứng nhận đăng kiểm." }
    ],
    tips: "⚠️ Lưu ý: Trong dãy 17 ký tự của số VIN tiêu chuẩn quốc tế sẽ KHÔNG bao giờ chứa các chữ cái I (i ngắn), O (o) và Q (q) nhằm tránh nhầm lẫn với số 1 và số 0."
  },
  wiper: {
    title: "🌧️ Hướng dẫn tự thay Gạt Mưa kính lái",
    description: "Cần gạt mưa nên được thay thế mỗi 6-12 tháng để đảm bảo tầm nhìn. Bạn hoàn toàn có thể tự thay tại nhà trong 5 phút.",
    steps: [
      { title: "Nâng cần gạt mưa", content: "Kéo cần gạt mưa lên theo hướng vuông góc với kính chắn gió. (Mẹo: Nên đặt một tấm khăn dày lên mặt kính dưới thanh gạt để đề phòng cần gạt bất ngờ đập xuống làm nứt kính)." },
      { title: "Tháo lưỡi gạt cũ", content: "Tìm chốt khóa (thường là một lẫy nhựa nhỏ hoặc nút bấm ở khớp nối), ấn giữ chốt và trượt lưỡi gạt cũ dọc theo thanh gạt xuống phía dưới để tháo ra." },
      { title: "Lắp lưỡi gạt mới", content: "Lấy gạt mưa mới (đúng kích thước xe), trượt thanh gạt vào khớp nối cho đến khi nghe thấy tiếng 'tạch' hoặc chốt nhựa đóng chặt lại." },
      { title: "Kiểm tra và hạ xuống", content: "Nhẹ nhàng hạ cần gạt về vị trí cũ trên mặt kính và bật thử chế độ phun nước rửa kính để kiểm tra độ êm." }
    ],
    tips: "💡 Mẹo nhỏ: Kích thước gạt mưa bên lái và bên phụ thường lệch nhau (Ví dụ: bên lái 24 inch, bên phụ 16 inch). Hãy kiểm tra kỹ thông số khi đặt hàng!"
  },
  filter: {
    title: "💨 Hướng dẫn tự thay Lọc Gió Động Cơ",
    description: "Lọc gió động cơ được ví như 'lá phổi' của xe. Lọc gió quá bẩn sẽ làm xe tốn xăng và yếu đi. Thay thế cực kỳ đơn giản không cần đồ nghề phức tạp.",
    steps: [
      { title: "Xác định hộp chứa lọc gió", content: "Mở nắp capo, tìm một hộp nhựa màu đen lớn có các đường ống dẫn khí lớn nối vào (thường nằm bên trái hoặc bên phải khoang máy)." },
      { title: "Mở các chốt cài", content: "Dùng tay bật từ 2 đến 4 cái lẫy kim loại hoặc lẫy nhựa xung quanh nắp hộp. Một số dòng xe hiếm hoi có thể cần dùng tuốc-nơ-vít để nới lỏng vít." },
      { title: "Nhấc lọc gió cũ ra ngoài", content: "Nhấc nắp hộp lên và lấy tấm lọc gió cũ ra. Hãy chú ý hướng quay của các nếp gấp giấy để lát nữa đặt tấm mới vào đúng chiều." },
      { title: "Vệ sinh hộp và đặt lọc mới", content: "Dùng khăn sạch lau sạch bụi bẩn bên trong lòng hộp. Đặt tấm lọc gió mới vào đúng khay, đóng nắp và gài chặt các lẫy khóa lại." }
    ],
    tips: "🛠️ Tần suất: Nên kiểm tra và xịt bụi lọc gió sau mỗi 5,000 km và thay mới hoàn toàn sau mỗi 20,000 km tùy điều kiện đường sá bụi bặm."
  }
};

export default function GuidePage() {
  // Quản lý tab đang chọn: 'vin' | 'wiper' | 'filter'
  const [activeTab, setActiveTab] = useState<'vin' | 'wiper' | 'filter'>('vin');

  const currentGuide = guidesData[activeTab];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>ML Enterprise</h1>
        <p style={styles.subtitle}>Trung Tâm Hỗ Trợ Kỹ Thuật & Tra Cứu Vật Tư</p>
      </header>

      {/* Main Content Layout */}
      <main style={styles.main}>
        {/* Thanh điều hướng giữa các Tab (Navigation Tabs) */}
        <div style={styles.tabBar}>
          <button 
            style={{ ...styles.tabButton, ...(activeTab === 'vin' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('vin')}
          >
            🔍 Tìm Số Khung (VIN)
          </button>
          <button 
            style={{ ...styles.tabButton, ...(activeTab === 'wiper' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('wiper')}
          >
            🌧️ Tự Thay Gạt Mưa
          </button>
          <button 
            style={{ ...styles.tabButton, ...(activeTab === 'filter' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('filter')}
          >
            💨 Thay Lọc Gió Động Cơ
          </button>
        </div>

        {/* Khu vực hiển thị nội dung bài hướng dẫn */}
        <div style={styles.contentCard}>
          <h2 style={styles.guideTitle}>{currentGuide.title}</h2>
          <p style={styles.guideDesc}>{currentGuide.description}</p>
          
          <div style={styles.stepContainer}>
            {currentGuide.steps.map((step, index) => (
              <div key={index} style={styles.stepRow}>
                <div style={styles.stepBadge}>Bước {index + 1}</div>
                <div style={styles.stepContent}>
                  <h4 style={styles.stepTitle}>{step.title}</h4>
                  <p style={styles.stepText}>{step.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Khung Lưu ý/Mẹo kỹ thuật */}
          <div style={styles.tipsBox}>
            <p style={styles.tipsText}>{currentGuide.tips}</p>
          </div>

          {/* Nút hành động quay lại hệ thống */}
          <div style={styles.actionZone}>
            <button style={styles.primaryBtn} onClick={() => alert("Hệ thống sẽ chuyển hướng bạn quay lại trang Danh sách sản phẩm để chọn mua đúng phụ tùng!")}>
              Đã hiểu, quay lại đặt hàng ngay
            </button>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2026 ML Enterprise • Cẩm nang kỹ thuật nội bộ</p>
      </footer>
    </div>
  );
}

// ==========================================
// HỆ THỐNG MÃ CSS INLINE (STYLING)
// ==========================================
const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '24px 20px',
    textAlign: 'center' as const,
  },
  logo: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '800',
  },
  subtitle: {
    margin: '6px 0 0 0',
    fontSize: '13px',
    color: '#cbd5e1',
  },
  main: {
    flex: 1,
    maxWidth: '850px',
    width: '100%',
    margin: '0 auto',
    padding: '30px 16px',
    boxSizing: 'border-box' as const,
  },
  tabBar: {
    display: 'flex',
    backgroundColor: '#e2e8f0',
    padding: '6px',
    borderRadius: '10px',
    gap: '4px',
    marginBottom: '20px',
    overflowX: 'auto' as const,
  },
  tabButton: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
  },
  tabActive: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    boxShadow: '0 2px 4px rgb(0 0 0 / 0.06)',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 1px 3px rgb(0 0 0 / 0.05)',
    border: '1px solid #e2e8f0',
  },
  guideTitle: {
    margin: '0 0 12px 0',
    fontSize: '22px',
    fontWeight: '700',
    color: '#1e293b',
  },
  guideDesc: {
    margin: '0 0 24px 0',
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6',
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    marginBottom: '24px',
  },
  stepRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  stepBadge: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '20px',
    whiteSpace: 'nowrap' as const,
    border: '1px solid #bfdbfe',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  stepText: {
    margin: 0,
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.5',
  },
  tipsBox: {
    backgroundColor: '#fffbeb',
    borderLeft: '4px solid #f59e0b',
    padding: '16px',
    borderRadius: '0 8px 8px 0',
    marginBottom: '30px',
  },
  tipsText: {
    margin: 0,
    fontSize: '13.5px',
    color: '#b45309',
    lineHeight: '1.5',
  },
  actionZone: {
    textAlign: 'center' as const,
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footer: {
    backgroundColor: '#1e293b',
    color: '#64748b',
    textAlign: 'center' as const,
    padding: '16px',
    fontSize: '12px',
    marginTop: 'auto',
  }
};