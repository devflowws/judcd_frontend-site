import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ==========================================
// EFFETS PARALLAXE JUDCD
// ==========================================

// Section avec effet parallaxe au scroll
export default function ParallaxSection({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? ['15%', '-15%'] : ['-15%', '15%']
  );

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
      <motion.div style={{ y, opacity }} className="relative">
        {children}
      </motion.div>
    </div>
  );
}

// Fond avec effet parallaxe
export function ParallaxBackground({
  image,
  overlay = 'from-black/60 to-black/30',
  speed = 0.3,
  height = 'h-screen',
  children,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const [imageError, setImageError] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Vérifier si l'image existe
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => setImageError(false);
      img.onerror = () => setImageError(true);
      img.src = image;
    }
  }, [image]);

  return (
    <div ref={ref} className={`relative ${height} overflow-hidden ${className}`} {...props}>
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: image && !imageError ? `url(${image})` : 'none',
          backgroundColor: imageError ? '#008751' : 'transparent',
          y,
          scale,
        }}
      />
      {overlay && (
        <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}

// Parallaxe au mouvement de souris
export function MouseParallax({
  children,
  intensity = 20,
  className = '',
  ...props
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePosition({ x, y });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`} {...props}>
      <motion.div
        animate={{
          x: mousePosition.x * intensity,
          y: mousePosition.y * intensity,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Parallaxe multi-couches
export function MultiLayerParallax({
  layers = [],
  height = 'h-screen',
  className = '',
  children,
  ...props
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  return (
    <div ref={ref} className={`relative ${height} overflow-hidden ${className}`} {...props}>
      {layers.map((layer, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [`0%`, `${layer.speed * 50}%`]
        );

        return (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: layer.image ? `url(${layer.image})` : 'none',
              y,
              zIndex: layer.zIndex || index,
              opacity: layer.opacity || 1,
            }}
          />
        );
      })}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}

// Effet de defilement horizontal
export function HorizontalScroll({
  children,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} {...props}>
      <motion.div style={{ x }} className="inline-flex">
        {children}
      </motion.div>
    </div>
  );
}

// Effet de revelation avec rotation 3D
export function TiltReveal({
  children,
  className = '',
  ...props
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    setRotation({ x: x * 10, y: y * 10 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}