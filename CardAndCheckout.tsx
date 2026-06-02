"use client";

import React, { useState } from 'react';

// ==========================================
// 1. DỮ LIỆU GIỎ HÀNG BAN ĐẦU (MOCK CART)
// ==========================================
const initialCartItems = [
  {
    id: "1",
    name: "Má phanh trước xe Camry 2024",
    code: "MP-CAM-2024-01",
    price: 1450000,
    quantity: 1,
    image: "🔧"
  },
  {
    id: "2",
    name: "Lọc dầu động cơ Ford Ranger Wildtrak",
    code: "LD-RAN-WILD-09",
    price: 320000,
    quantity: 2,
    image: "🛢️"
  }
];

export default function CheckoutPage() {
  // Trạng thái giỏ hàng
  const [cartItems, setCartItems] = useState(initialCartItems);
  
  // Trạng thái Phương thức thanh toán: 'cash' (Tiền mặt) hoặc 'transfer' (Chuyển khoản)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  
  // Trạng thái form thông tin khách hàng
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    vinNumber: ''
  });

  // Tăng giảm số lượng sản phẩm
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Tính toán tổng tiền
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Xử lý gửi đơn hàng
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.vinNumber) {
      alert("Vui lòng điền đầy đủ thông tin đặt hàng, đặc biệt là số khung (VIN) để đối chiếu linh kiện!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const methodText = paymentMethod === 'cash' ? 'Thanh toán tiền mặt (COD)' : 'Chuyển khoản ngân hàng';

    alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\nThông tin đơn hàng:\n- Khách hàng: ${formData.fullName}\n- Số khung VIN: ${formData.vinNumber}\n- Tổng tiền: ${totalAmount.toLocaleString('vi-VN')} VND\n- Hình thức: ${methodText}\n\nĐơn hàng đã được chuyển tới quản trị viên (Mến) để duyệt cấp phát phụ tùng.`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>ML Enterprise</h1>
        <p style={styles.subtitle}>Hệ Thống Đặt Hàng & Kiểm Tra Độ Tương Thích Linh Kiện</p>
      </header>

      {/* Main Layout: 2 Cột */}
      <main style={styles.main}>
        <div style={styles.checkoutGrid}>
          
          {/* CỘT TRÁI: GIỎ HÀNG */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>1. Giỏ hàng của bạn</h2>
            
            {cartItems.length === 0 ? (
              <div style={styles.emptyCart}>
                <p>Giỏ hàng trống. Vui lòng thêm phụ tùng.</p>
              </div>
            ) : (
              <div>
                {cartItems.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <div style={styles.itemIcon}>{item.image}</div>
                    <div style={styles.itemDetails}>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      <p style={styles.itemCode}>Mã: {item.code}</p>
                      <p style={styles.itemPrice}>{(item.price).toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div style={styles.quantityControl}>
                      <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span style={styles.qtyText}>{item.quantity}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                ))}

                <div style={styles.divider}></div>
                
                <div style={styles.summaryRow}>
                  <span>Tạm tính:</span>
                  <span>{totalAmount.toLocaleString('vi-VN')} VND</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Phí vận chuyển:</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>Miễn phí</span>
                </div>
                <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                  <span>Tổng thanh toán:</span>
                  <span style={styles.finalPrice}>{totalAmount.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: THÔNG TIN ĐẶT HÀNG & PHƯƠNG THỨC THANH TOÁN */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>2. Thông tin giao hàng</h2>
            
            <form onSubmit={handleSubmitOrder} style={styles.form}>
              {/* Trường nhập liệu thông tin */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Họ và tên người nhận *</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Nguyễn Văn A" 
                  style={styles.input}
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại *</label>
                <input 
                  type="tel" 
                  placeholder="Ví dụ: 0912345678" 
                  style={styles.input}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Địa chỉ giao hàng *</label>
                <input 
                  type="text" 
                  placeholder="Số nhà, tên đường, tỉnh/thành phố" 
                  style={styles.input}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số khung xe (VIN) *</label>
                <input 
                  type="text" 
                  placeholder="Nhập chính xác 17 ký tự số khung" 
                  style={{ ...styles.input, ...styles.vinInput }}
                  maxLength={17}
                  value={formData.vinNumber}
                  onChange={e => setFormData({...formData, vinNumber: e.target.value.toUpperCase()})}
                />
                <small style={styles.helpText}>
                  ⚠️ Bắt buộc đối chiếu sơ đồ kỹ thuật để tránh cấp phát sai đời xe.
                </small>
              </div>

              {/* KHU VỰC CHỌN PHƯƠNG THỨC THANH TOÁN */}
              <div style={{ ...styles.formGroup, marginTop: '10px' }}>
                <label style={styles.label}>Phương thức thanh toán *</label>
                
                <div style={styles.paymentSelector}>
                  {/* Option 1: Tiền mặt */}
                  <label style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'cash' ? styles.paymentOptionActive : {})
                  }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'cash'} 
                      onChange={() => setPaymentMethod('cash')}
                      style={styles.radioInput}
                    />
                    <div style={styles.paymentOptionText}>
                      <span style={styles.paymentMethodTitle}>💵 Tiền mặt (COD)</span>
                      <span style={styles.paymentMethodDesc}>Thanh toán trực tiếp khi nhận linh kiện</span>
                    </div>
                  </label>

                  {/* Option 2: Chuyển khoản */}
                  <label style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === 'transfer' ? styles.paymentOptionActive : {})
                  }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'transfer'} 
                      onChange={() => setPaymentMethod('transfer')}
                      style={styles.radioInput}
                    />
                    <div style={styles.paymentOptionText}>
                      <span style={styles.paymentMethodTitle}>🏦 Chuyển khoản Ngân hàng</span>
                      <span style={styles.paymentMethodDesc}>Quét mã QR hoặc chuyển khoản thủ công</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* KHUNG HIỂN THỊ MÃ QR CHUYỂN KHOẢN (Sẽ hiển thị khi chọn 'transfer') */}
              {paymentMethod === 'transfer' && (
                <div style={styles.qrContainer}>
                  <div style={styles.qrPlaceholder}>
                    <span style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</span>
                    <span style={styles.qrTitle}>KHUNG CHÈN MÃ QR CODE</span>
                    <p style={styles.qrSubtitle}>
                      (Sau này bạn chỉ cần thay thế thẻ div này bằng thẻ <code style={{backgroundColor:'#e2e8f0', padding:'2px 4px', borderRadius:'4px'}}>&lt;img src="link_anh_qr.png" /&gt;</code> của ngân hàng bạn vào đây)
                    </p>
                  </div>
                  <div style={styles.transferInfo}>
                    <p style={styles.infoText}><strong>Chủ tài khoản:</strong> ML ENTERPRISE</p>
                    <p style={styles.infoText}><strong>Số tài khoản:</strong> 123456789999</p>
                    <p style={styles.infoText}><strong>Ngân hàng:</strong> Vietcombank (VCB)</p>
                    <p style={styles.infoText}>
                      <strong>Nội dung:</strong> <span style={{color: '#dc2626', fontWeight: '700'}}>ML {formData.phone || 'SỐ ĐIỆN THOẠI'}</span>
                    </p>
                  </div>
                </div>
              )}

              <button type="submit" style={styles.submitButton}>
                {paymentMethod === 'cash' ? 'Xác nhận đặt hàng (COD)' : 'Tôi đã chuyển khoản - Hoàn tất đặt hàng'}
              </button>
            </form>
          </div>

        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2026 ML Enterprise • Hệ thống xử lý kho vận an toàn</p>
      </footer>
    </div>
  );
}

// ==========================================
// 3. HỆ THỐNG MÃ CSS INLINE (STYLING)
// ==========================================
const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    backgroundColor: '#0f172a',
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
    color: '#94a3b8',
  },
  main: {
    flex: 1,
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
    padding: '30px 16px',
    boxSizing: 'border-box' as const,
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 20px 0',
    color: '#1e293b',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '10px',
  },
  emptyCart: {
    padding: '40px 0',
    textAlign: 'center' as const,
    color: '#94a3b8',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  itemIcon: {
    fontSize: '24px',
    marginRight: '12px',
    backgroundColor: '#f8fafc',
    padding: '8px',
    borderRadius: '8px',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  itemCode: {
    margin: '2px 0',
    fontSize: '12px',
    color: '#64748b',
  },
  itemPrice: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '2px',
  },
  qtyBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#64748b',
  },
  qtyText: {
    fontSize: '13px',
    fontWeight: '600',
    width: '16px',
    textAlign: 'center' as const,
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '16px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
  },
  totalRow: {
    color: '#0f172a',
    fontWeight: '700',
    marginTop: '12px',
    fontSize: '16px',
  },
  finalPrice: {
    color: '#dc2626',
    fontSize: '18px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  vinInput: {
    fontFamily: 'monospace',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    borderColor: '#94a3b8',
    backgroundColor: '#f8fafc',
  },
  helpText: {
    fontSize: '11px',
    color: '#94a3b8',
    lineHeight: '1.4',
  },
  paymentSelector: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '4px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
  },
  paymentOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  radioInput: {
    marginTop: '4px',
    marginRight: '12px',
    cursor: 'pointer',
  },
  paymentOptionText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  paymentMethodTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  paymentMethodDesc: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  qrContainer: {
    border: '1px dashed #cbd5e1',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
    animation: 'fadeIn 0.3s ease',
  },
  qrPlaceholder: {
    width: '100%',
    minHeight: '180px',
    border: '2px dashed #94a3b8',
    backgroundColor: '#e2e8f0',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    textAlign: 'center' as const,
    boxSizing: 'border-box' as const,
  },
  qrTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#475569',
    letterSpacing: '0.5px',
  },
  qrSubtitle: {
    fontSize: '11px',
    color: '#64748b',
    margin: '6px 0 0 0',
    lineHeight: '1.4',
    maxWidth: '260px',
  },
  transferInfo: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box' as const,
  },
  infoText: {
    margin: '4px 0',
    fontSize: '13px',
    color: '#334155',
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
  },
  footer: {
    backgroundColor: '#0f172a',
    color: '#64748b',
    textAlign: 'center' as const,
    padding: '16px',
    fontSize: '12px',
    marginTop: 'auto',
  }
};