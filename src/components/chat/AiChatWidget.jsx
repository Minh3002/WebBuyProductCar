import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ShoppingBag } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { getProductImage, resolveMediaUrl } from '../../utils/media';

import { getChatbotResponse } from '../../utils/chatbotKnowledge';

export default function AiChatWidget({ onAddToCart, onViewAll, allProducts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Xin chào! Tôi là Trợ lý Kỹ thuật AI của Mazlay Parts. Tôi có thể giúp gì cho bạn về bảo dưỡng, thông số kỹ thuật hay phụ tùng ô tô?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const response = getChatbotResponse(userMsg, allProducts);
        setMessages([...newMessages, { role: 'model', text: response.response, products: response.products }]);
      } catch (error) {
        setMessages([...newMessages, { role: 'model', text: 'Xin lỗi, hiện tại hệ thống AI đang quá tải. Vui lòng thử lại sau!' }]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Giả lập độ trễ nhỏ để trải nghiệm tự nhiên hơn
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Nút Chat Bong bóng */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[9999]"
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Khung Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-neutral-200 z-[9999] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-brand-dark text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center font-bold">AI</div>
              <div>
                <h3 className="font-bold text-sm">Trợ lý AI Mazlay</h3>
                <p className="text-[10px] text-gray-300">Tư vấn phụ tùng 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white border text-neutral-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
                
                {/* Render Products nếu có */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2 w-[85%]">
                    {msg.products.slice(0, 3).map((p, pIdx) => {
                      const isAvailable = Number(p.stock_quantity || 0) > 0;
                      return (
                        <div key={pIdx} className="bg-white border rounded-lg p-2 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                            <img src={resolveMediaUrl(getProductImage(p))} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-brand-dark line-clamp-1">{p.title}</h5>
                              <p className="text-[10px] text-gray-500">Mã OEM: {p.oem_code}</p>
                              <div className="text-brand-primary text-xs font-bold mt-0.5">
                                {p.price?.toLocaleString('vi-VN')} đ
                              </div>
                            </div>
                            <button
                              disabled={!isAvailable}
                              onClick={() => onAddToCart && onAddToCart(p)}
                              className={`mt-1 py-1 px-2 rounded flex items-center justify-center gap-1 text-[10px] font-bold text-white transition-colors ${isAvailable ? 'bg-brand-secondary hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                              <ShoppingBag size={10} />
                              {isAvailable ? 'Mua ngay' : 'Hết hàng'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {msg.products.length > 3 && (
                      <button 
                        onClick={() => onViewAll && onViewAll()}
                        className="text-xs text-brand-primary hover:underline self-center mt-1"
                      >
                        Xem tất cả {msg.products.length} sản phẩm...
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-2 text-sm text-gray-500 shadow-sm flex items-center gap-1">
                  AI đang suy nghĩ<span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer (Input) */}
          <div className="p-3 bg-white border-t flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi kỹ thuật..."
              className="flex-1 resize-none h-10 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-brand-primary bg-gray-50"
              rows="1"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-brand-dark text-white rounded-lg flex items-center justify-center hover:bg-black disabled:bg-gray-300 transition-colors"
            >
              <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
