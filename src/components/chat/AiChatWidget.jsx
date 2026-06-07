import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function AiChatWidget() {
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/ai/chat', {
        message: userMsg,
        history: messages
      });
      setMessages([...newMessages, { role: 'model', text: response.response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'model', text: 'Xin lỗi, hiện tại hệ thống AI đang quá tải. Vui lòng thử lại sau!' }]);
    } finally {
      setIsLoading(false);
    }
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
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white border text-neutral-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
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
