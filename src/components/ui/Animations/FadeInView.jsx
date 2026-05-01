import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// ==========================================
// ANIMATIONS AU SCROLL JUDCD
// ==========================================

// Apparition avec fondu et glissement
export default function FadeInView({
  children,
  direction = 'up',
  duration = 0.6,
  delay = 0,
  distance = 40,
  once = true,
  className = '',
  ...props
}) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const initial = {
    opacity: 0,
    ...directions[direction],
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Apparition avec zoom
export function ScaleInView({
  children,
  duration = 0.5,
  delay = 0,
  once = true,
  className = '',
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Apparition echelonnee pour les enfants
export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  duration = 0.5,
  once = true,
  className = '',
  ...props
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      className={className}
      {...props}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={childVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

// Animation de compteur
export function CountUpAnimation({
  from = 0,
  to = 100,
  duration = 2,
  suffix = '',
  className = '',
  ...props
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <span ref={ref} className={className} {...props}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
      >
        {inView ? (
          <CounterValue from={from} to={to} duration={duration} suffix={suffix} />
        ) : (
          from
        )}
      </motion.span>
    </span>
  );
}

// Valeur du compteur
function CounterValue({ from, to, duration, suffix }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + (to - from) * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  return <>{count}{suffix}</>;
}

// Animation de transition de page
export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animation de revelation au scroll avec ligne
export function RevealSection({
  children,
  className = '',
  withLine = false,
  lineColor = '#008751',
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {withLine && (
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '60px' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-1 rounded-full mb-6"
          style={{ backgroundColor: lineColor }}
        />
      )}
      {children}
    </motion.div>
  );
}

// Effet de flottement
export function FloatAnimation({
  children,
  amplitude = 10,
  duration = 3,
  className = '',
  ...props
}) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Effet de soulignement au survol
export function UnderlineReveal({
  children,
  className = '',
  color = '#008751',
  ...props
}) {
  return (
    <span className={`relative inline-block group ${className}`} {...props}>
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-current"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </span>
  );
}