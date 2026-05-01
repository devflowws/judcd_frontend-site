// ==========================================
// DRAPEAU FRANÇAIS SVG
// ==========================================

export default function FlagFrance({ className = "w-6 h-4" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 6 4" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="2" height="4" fill="#002395"/>
      <rect x="2" width="2" height="4" fill="#FFFFFF"/>
      <rect x="4" width="2" height="4" fill="#ED2939"/>
    </svg>
  );
}
