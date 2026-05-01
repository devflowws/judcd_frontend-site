import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// CARROUSEL / SLIDER JUDCD
// ==========================================

export default function Carousel({
  slides = [],
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  effect = 'fade',
  height = 'h-[500px] md:h-[600px] lg:h-screen',
  className = '',
  ...props
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = slides.length;

  // Navigation
  const goTo = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const previous = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered || totalSlides <= 1) return;

    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, next, totalSlides]);

  // Variants pour animation fade
  const fadeVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
    }),
  };

  // Variants pour animation slide
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 1,
    }),
  };

  const variants = effect === 'slide' ? slideVariants : fadeVariants;

  if (totalSlides === 0) {
    return (
      <div className={`${height} bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Aucune image a afficher</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${height} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* Overlay degrade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Fleches de navigation */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={previous}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-all group"
            aria-label="Precedent"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-all group"
            aria-label="Suivant"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicateurs (dots) */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`transition-all duration-300 rounded-full ${
                index === current
                  ? 'w-8 h-3 bg-[#FFD100]'
                  : 'w-3 h-3 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Slide simple avec image de fond
export function CarouselSlide({
  image,
  alt = '',
  children,
  className = '',
}) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {image && (
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      <div className="relative z-10 h-full flex items-center">
        {children}
      </div>
    </div>
  );
}