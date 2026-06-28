import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920',
    title: 'Phụ tùng Ô tô Chính hãng',
    subtitle: 'Đảm bảo hiệu suất và độ an toàn tối đa cho xế yêu của bạn',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&q=80&w=1920',
    title: 'Công nghệ Vượt trội',
    subtitle: 'Cung cấp linh kiện cao cấp từ các thương hiệu hàng đầu thế giới',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1503376712341-ea43100db2c9?auto=format&fit=crop&q=80&w=1920',
    title: 'Dịch vụ Đẳng cấp',
    subtitle: 'Giao hàng nhanh chóng - Hỗ trợ kỹ thuật chuyên sâu',
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Đổi ảnh mỗi 5 giây
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-2xl mb-8 shadow-2xl">
      {/* Animated Background Gradient overlay */}
      <motion.div 
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={slides[currentIndex].image}
          alt={slides[currentIndex].title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-black drop-shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {slides[currentIndex].title}
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-gray-200 shadow-black drop-shadow-md"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {slides[currentIndex].subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-brand-primary' : 'w-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
