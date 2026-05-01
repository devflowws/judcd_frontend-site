import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ==========================================
// BOUTON REUTILISABLE JUDCD
// ==========================================

const variants = {
  primary: {
    bg: 'bg-[#008751] hover:bg-[#006B41]',
    text: 'text-white',
    shadow: 'shadow-lg shadow-green-500/25 hover:shadow-green-500/40',
  },
  secondary: {
    bg: 'bg-[#002060] hover:bg-[#001540]',
    text: 'text-white',
    shadow: 'shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
  },
  accent: {
    bg: 'bg-[#FFD100] hover:bg-[#FFE44D]',
    text: 'text-[#002060]',
    shadow: 'shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40',
  },
  danger: {
    bg: 'bg-[#D21034] hover:bg-[#B00D2B]',
    text: 'text-white',
    shadow: 'shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
  },
  outline: {
    bg: 'bg-transparent border-2 border-[#008751] hover:bg-[#008751]',
    text: 'text-[#008751] hover:text-white',
    shadow: '',
  },
  ghost: {
    bg: 'bg-transparent hover:bg-gray-100',
    text: 'text-[#333333] hover:text-[#008751]',
    shadow: '',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href = null,
  to = null,
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  animate = true,
  className = '',
  onClick = null,
  ...props
}) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant].bg}
    ${variants[variant].text}
    ${variants[variant].shadow}
    ${sizes[size]}
    ${className}
  `;

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </>
  );

  // Animation
  const motionProps = animate ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  } : {};

  // Lien externe
  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  // Lien interne React Router
  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={baseClasses} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  // Bouton standard
  return (
    <motion.button
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
}

// Variante speciale : bouton de don avec animation pulse
export function DonateButton({ children = 'Faire un don', size = 'md', className = '', ...props }) {
  return (
    <Button
      variant="danger"
      size={size}
      className={`animate-pulse-shadow ${className}`}
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      }
      {...props}
    >
      {children}
    </Button>
  );
}