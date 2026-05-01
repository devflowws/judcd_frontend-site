// ==========================================
// DRAPEAU ROYAUME-UNI SVG
// ==========================================

export default function FlagUK({ className = "w-6 h-4" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 60 30" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 L30,30 M0,15 L60,15" stroke="#FFFFFF" strokeWidth="10"/>
      <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  );
}
