import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getMembres } from '../../../services/membreService';

// ==========================================
// CARTE REUTILISABLE JUDCD
// ==========================================

export default function Card({
  children,
  variant = 'default',
  padding = true,
  hover = true,
  animate = true,
  className = '',
  onClick = null,
  ...props
}) {
  const baseClasses = `
    bg-white rounded-xl overflow-hidden
    transition-all duration-300 ease-out
    ${padding ? 'p-6' : ''}
    ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    ${variant === 'bordered' ? 'border border-gray-200' : 'shadow-lg'}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const motionProps = animate ? {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5, ease: 'easeOut' },
    whileHover: hover ? { y: -4 } : {},
  } : {};

  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Carte avec image
export function ImageCard({
  image,
  alt = '',
  title,
  description,
  date,
  category,
  author,
  href = null,
  to = null,
  aspectRatio = 'aspect-[4/3]',
  overlay = false,
  className = '',
  ...props
}) {
  const content = (
    <>
      <div className={`relative overflow-hidden ${aspectRatio}`}>
        {image ? (
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        {category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-[#008751] text-white text-xs font-semibold rounded-full">
            {category}
          </span>
        )}
      </div>
      <div className="p-5">
        {date && (
          <p className="text-xs text-gray-500 mb-2 font-medium">{date}</p>
        )}
        {title && (
          <h3 className="font-heading font-bold text-lg text-[#333333] mb-2 line-clamp-2 group-hover:text-[#008751] transition-colors">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-[#666666] line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
        {author && (
          <p className="text-xs text-gray-500 mt-3 font-medium">Par {author}</p>
        )}
      </div>
    </>
  );

  const cardClasses = `
    group bg-white rounded-xl overflow-hidden shadow-lg
    transition-all duration-300 ease-out
    hover:shadow-xl hover:-translate-y-1
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={cardClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cardClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {content}
    </div>
  );
}

// Carte membre equipe

// 1. COMPOSANT : La carte individuelle (Simple et réutilisable)
export function TeamCard({ member, className = '', ...props }) {
  // Sécurité si aucun membre n'est passé
  if (!member) return null;

  return (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-lg text-center group hover:shadow-xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      {...props}
    >
      {/* Photo ou Initiales */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover rounded-full border-4 border-[#008751]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-[#008751] flex items-center justify-center text-white text-2xl font-bold">
            {member.name?.charAt(0) || '?'}
          </div>
        )}
        <div className="absolute inset-0 rounded-full border-4 border-[#FFD100] opacity-0 group-hover:opacity-100 transition-opacity scale-110" />
      </div>

      {/* Informations textuelles */}
      <h3 className="font-heading font-bold text-lg text-[#002060] mb-1">{member.name}</h3>
      <p className="text-sm font-semibold text-[#008751] mb-3">{member.role}</p>
      
      {member.bio && (
        <p className="text-sm text-[#666666] mb-3 line-clamp-5 leading-relaxed">{member.bio}</p>
      )}
      
      {member.quote && (
        <blockquote className="text-xs italic text-[#666666] border-l-2 border-[#FFD100] pl-3 text-left">
          "{member.quote}"
        </blockquote>
      )}

      {/* Réseaux et Contacts */}
      <div className="flex justify-center gap-3 mt-4">
        {member.email && (
          <a href={`mailto:${member.email}`} className="text-[#008751] hover:text-[#006B41] transition-colors" title="Email">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        )}
        {member.phone && (
          <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="text-[#008751] hover:text-[#006B41] transition-colors" title="Téléphone">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}


// export function TeamCard() {

  

//     const [members, setMembers] = useState([]);
  
//     useEffect(
//       ()=>{
  
//         const fetchMembers = async ()=>{
//           const response = getMembres();
  
//           const rawdata = response && response.data? response.data : [];
  
//           const MappedData = rawdata.map(member => ({
//             id: member.id,
//             name: member.nom_complet, // Transforme nom_complet en name
//             role: member.role,
//             photo: member.photo,
//             phone: member.telephone,  
//             email: member.email,
//             bio: member.infos,        // Transforme infos en bio
//             reseaux: member.reseaux_sociaux || {},
//             quote: member.citation || ""
//           }));
  
//           setMembers(MappedData);
//         }
  
//         fetchMembers();
//       }, []
//     );
  
  
//   return (
//     <motion.div
//       className={`bg-white rounded-xl p-6 shadow-lg text-center group hover:shadow-xl transition-all duration-300 ${className}`}
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.5 }}
//       whileHover={{ y: -4 }}
//       {...props}
//     >
//       {members.map((member, index) => (
//         <div className="relative w-24 h-24 mx-auto mb-4">
//           {member.photo ? (
//             <img
//               src={member.photo}
//               alt={member.name}
//               className="w-full h-full object-cover rounded-full border-4 border-[#008751]"
//               loading="lazy"
//             />
//           ) : (
//             <div className="w-full h-full rounded-full bg-[#008751] flex items-center justify-center text-white text-2xl font-bold">
//               {member.name?.charAt(0) || '?'}
//             </div>
//           )}
//           <div className="absolute inset-0 rounded-full border-4 border-[#FFD100] opacity-0 group-hover:opacity-100 transition-opacity scale-110" />
//         </div>
//       ))}
     
//       {/* <h3 className="font-heading font-bold text-lg text-[#002060] mb-1">{name}</h3>
//       <p className="text-sm font-semibold text-[#008751] mb-3">{role}</p>
//       {bio && (
//         <p className="text-sm text-[#666666] mb-3 line-clamp-5 leading-relaxed">{bio}</p>
//       )}
//       {quote && (
//         <blockquote className="text-xs italic text-[#666666] border-l-2 border-[#FFD100] pl-3 text-left">
//           "{quote}"
//         </blockquote>
//       )}
//       <div className="flex justify-center gap-3 mt-4">
//         {email && (
//           <a href={`mailto:${email}`} className="text-[#008751] hover:text-[#006B41] transition-colors" title="Email">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//           </a>
//         )}
//         {phone && (
//           <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-[#008751] hover:text-[#006B41] transition-colors" title="Telephone">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//             </svg>
//           </a>
//         )}
//       </div> */}
//     </motion.div>
//   );
// }

// Carte statistique
export function StatCard({
  value,
  suffix = '',
  label,
  icon = null,
  color = '#008751',
  className = '',
  ...props
}) {
  return (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-lg text-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {icon && (
        <div className="text-3xl mb-3" style={{ color }}>
          {icon}
        </div>
      )}
      <div className="text-4xl font-extrabold font-heading mb-1" style={{ color }}>
        {value}{suffix}
      </div>
      <p className="text-sm text-[#666666] font-medium">{label}</p>
    </motion.div>
  );
}