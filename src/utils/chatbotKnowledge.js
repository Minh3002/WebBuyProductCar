export const cleanText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')
    .trim();
};

export const chatbotKnowledge = [
  {
    category: "Chào hỏi",
    keywords: ["chao", "hi", "hello", "alo", "shop oi", "co ai khong", "ten la gi", "admin"],
    responses: [
      "Chào bạn! Mình là trợ lý AI của Mazlay Parts. Mình có thể giúp gì cho bạn hôm nay?",
      "Dạ Mazlay Parts xin chào! Bạn cần tìm phụ tùng hay hỗ trợ gì ạ?",
      "Hello bạn! Cần tư vấn gì cứ nhắn tin cho mình nhé."
    ]
  },
  {
    category: "Hỏi thăm / Tán gẫu",
    keywords: ["khoe khong", "dang lam gi", "bao nhieu tuoi", "biet noi gi", "bot", "ai"],
    responses: [
      "Dạ mình là bot phục vụ 24/7 nên lúc nào cũng khỏe ạ! Bạn cần mua gì không?",
      "Mình đang túc trực để hỗ trợ bạn đây! Bạn đang tìm phụ tùng cho dòng xe nào?",
      "Mình là trợ lý ảo, lúc nào cũng sẵn sàng phục vụ. Mong được bạn ủng hộ nha!"
    ]
  },
  {
    category: "Tư vấn mua hàng",
    keywords: ["mua hang", "dat hang", "cach mua", "con hang", "het hang", "kiem tra", "muon mua"],
    responses: [
      "Để mua hàng, bạn có thể gõ tên phụ tùng muốn tìm vào đây. Nếu thấy ưng ý, cứ bấm 'Mua ngay' nhé!",
      "Bạn chỉ cần gõ tên món đồ cần tìm, mình sẽ kiểm tra kho và báo giá ngay cho bạn ạ.",
      "Bạn cần tìm phụ tùng gì thì cứ nhập từ khóa, mình sẽ check kho giúp bạn ngay!"
    ]
  },
  {
    category: "Giá cả",
    keywords: ["gia", "bao nhieu", "mac", "re", "chiem khau", "voucher", "giam gia", "fix", "bot khong"],
    responses: [
      "Giá của các phụ tùng tại Mazlay Parts luôn được niêm yết rõ ràng và cạnh tranh nhất thị trường ạ.",
      "Dạ thi thoảng shop có mã giảm giá (voucher) ở trên đầu trang đó ạ. Bạn để ý lưu lại nhé!",
      "Bên mình bán đúng giá niêm yết, cam kết chính hãng nên bạn yên tâm về chất lượng nha."
    ]
  },
  {
    category: "Địa chỉ / Liên hệ",
    keywords: ["dia chi", "o dau", "cua hang", "hotline", "zalo", "so dien thoai", "sdt", "lien he"],
    responses: [
      "Tổng kho của Mazlay Parts đặt tại TP.HCM. Bạn có thể liên hệ Zalo 082.909.2882 để được hỗ trợ trực tiếp ạ.",
      "Cửa hàng bên mình ở TP.HCM ạ. Có gì gấp bạn cứ gọi hoặc add Zalo 082.909.2882 nha.",
      "Dạ bạn có thể liên hệ Zalo của shop ở dưới chân trang web hoặc số 082.909.2882 ạ."
    ]
  },
  {
    category: "Vận chuyển",
    keywords: ["ship", "van chuyen", "giao hang", "bao lau", "cod", "phi ship", "mien phi giao hang"],
    responses: [
      "Bên mình có ship COD toàn quốc. Nội thành TP.HCM nhận hàng trong 1-2 ngày, tỉnh lẻ khoảng 3-5 ngày ạ.",
      "Phí ship sẽ được tính tự động khi bạn nhập địa chỉ ở trang Thanh toán nhé. Thời gian giao khoảng 2-5 ngày tùy khu vực.",
      "Dạ shop gửi hàng qua các đối tác giao hàng nhanh, kiểm tra hàng thoải mái trước khi thanh toán ạ."
    ]
  },
  {
    category: "Bảo hành",
    keywords: ["bao hanh", "doi tra", "loi", "hong", "hu", "doi hang", "tra hang", "cam ket"],
    responses: [
      "Các phụ tùng chính hãng bên mình bảo hành từ 3-12 tháng tùy loại, lỗi 1 đổi 1 trong 7 ngày đầu ạ.",
      "Bạn yên tâm nhé, nếu sản phẩm có lỗi từ nhà sản xuất, shop hỗ trợ đổi trả miễn phí trong vòng 7 ngày.",
      "Dạ chính sách bảo hành cực kỳ rõ ràng, phụ tùng mua về nếu không lắp vừa do lỗi tư vấn cũng được hỗ trợ đổi ạ."
    ]
  },
  {
    category: "Phản hồi",
    keywords: ["dep", "thong minh", "tot", "kem", "chan", "te", "gio", "tuyet", "ok", "dung roi"],
    responses: [
      "Cảm ơn bạn đã phản hồi! Mazlay Parts luôn cố gắng hoàn thiện mỗi ngày để phục vụ bạn tốt hơn.",
      "Dạ shop ghi nhận ý kiến của bạn. Cần hỗ trợ thêm gì bạn cứ báo mình nha!",
      "Aww, cảm ơn bạn rất nhiều! Chúc bạn một ngày tốt lành ạ."
    ]
  },
  {
    category: "Thả thính",
    keywords: ["nguoi yeu", "yeu", "dep trai", "xinh", "tan", "tha thinh", "thich"],
    responses: [
      "Mình chỉ là một con bot yêu nghề bán phụ tùng thôi ạ 🫣 Mua ủng hộ mình nha!",
      "Trái tim mình chỉ dành cho những vị khách chốt đơn lẹ tay thôi! Haha",
      "Bạn nói thế làm mình ngại quá... Chọn mua món gì đi mình đóng gói cho cẩn thận nè!"
    ]
  },
  {
    category: "Tạm biệt",
    keywords: ["tam biet", "bye", "ngu ngon", "di", "buh bye", "pp", "chao tam biet"],
    responses: [
      "Chào bạn nhé! Chúc bạn vạn dặm bình an, lái xe an toàn ạ.",
      "Dạ tạm biệt bạn. Cần gì lần sau lại ghé Mazlay Parts nha!",
      "Chúc bạn ngủ ngon! Hệ thống vẫn mở 24/7 để nhận đơn của bạn đó."
    ]
  }
];

export const getChatbotResponse = (userMessage, productList = []) => {
  const cleanedMsg = cleanText(userMessage);
  
  // 1. Quét Knowledge Base (Quy tắc logic trước)
  for (const knowledge of chatbotKnowledge) {
    if (knowledge.keywords.some(kw => cleanedMsg.includes(cleanText(kw)))) {
      const randomIndex = Math.floor(Math.random() * knowledge.responses.length);
      return { response: knowledge.responses[randomIndex], products: [] };
    }
  }

  // 2. Nếu không khớp quy tắc, tiến hành tìm kiếm sản phẩm
  const searchKeywords = cleanedMsg.split(' ').filter(w => w.length > 1);
  if (searchKeywords.length > 0 && productList.length > 0) {
    // Lọc các sản phẩm mà tên, oem_code, category khớp với một trong các từ khóa
    const matchedProducts = productList.filter(p => {
      const title = cleanText(p.title);
      const category = cleanText(p.category);
      const oem = cleanText(p.oem_code);
      return searchKeywords.some(kw => title.includes(kw) || category.includes(kw) || oem.includes(kw));
    });

    if (matchedProducts.length > 0) {
      // Sort by best match (optional, just return the list)
      return {
        response: `Dạ mình tìm thấy ${matchedProducts.length} sản phẩm phù hợp với yêu cầu của bạn. Bạn tham khảo nhé!`,
        products: matchedProducts
      };
    }
  }

  // 3. Fallback
  return {
    response: "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn có thể nói rõ hơn hoặc nhập tên phụ tùng (ví dụ: 'má phanh', 'lọc gió') để mình tìm kiếm giúp bạn nhé!",
    products: []
  };
};
