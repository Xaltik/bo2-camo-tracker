// Icônes vectorielles stylisées (silhouettes génériques, pas de reproduction d'assets du jeu)
// pour représenter chaque catégorie d'armes sur les cartes.

const ICONS = {
  assault_rifles: (
    <>
      <rect x="4" y="18" width="16" height="6" rx="1" />
      <rect x="18" y="15" width="34" height="10" rx="1" />
      <rect x="52" y="18" width="38" height="4" rx="1" />
      <rect x="60" y="10" width="16" height="3" rx="1" />
      <rect x="30" y="25" width="6" height="14" rx="1" transform="rotate(12 33 25)" />
      <rect x="22" y="25" width="6" height="10" rx="1" />
    </>
  ),
  smg: (
    <>
      <polygon points="4,18 16,15 16,25 4,22" />
      <rect x="16" y="14" width="26" height="10" rx="1" />
      <rect x="42" y="17" width="18" height="4" rx="1" />
      <rect x="26" y="24" width="6" height="16" rx="1" />
      <rect x="18" y="24" width="6" height="9" rx="1" />
    </>
  ),
  lmg: (
    <>
      <rect x="4" y="16" width="18" height="8" rx="1" />
      <rect x="22" y="13" width="30" height="11" rx="1" />
      <rect x="52" y="16" width="36" height="5" rx="1" />
      <circle cx="40" cy="32" r="9" />
      <rect x="24" y="24" width="6" height="9" rx="1" />
      <line x1="80" y1="21" x2="88" y2="30" stroke="currentColor" strokeWidth="2" />
      <line x1="80" y1="21" x2="88" y2="14" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  sniper: (
    <>
      <rect x="4" y="19" width="14" height="5" rx="1" />
      <rect x="18" y="16" width="24" height="9" rx="1" />
      <rect x="42" y="19" width="46" height="3" rx="1" />
      <rect x="30" y="8" width="20" height="5" rx="1" />
      <circle cx="30" cy="10.5" r="3" />
      <circle cx="50" cy="10.5" r="3" />
      <rect x="22" y="25" width="5" height="10" rx="1" />
      <line x1="80" y1="22" x2="86" y2="32" stroke="currentColor" strokeWidth="2" />
      <line x1="80" y1="22" x2="86" y2="14" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  shotgun: (
    <>
      <rect x="4" y="19" width="16" height="6" rx="1" />
      <rect x="20" y="16" width="26" height="9" rx="1" />
      <rect x="46" y="18" width="40" height="5" rx="1" />
      <rect x="58" y="22" width="16" height="6" rx="2" />
      <rect x="26" y="25" width="6" height="10" rx="1" />
    </>
  ),
  pistol: (
    <>
      <rect x="20" y="16" width="30" height="10" rx="2" />
      <rect x="50" y="19" width="14" height="4" rx="1" />
      <rect x="24" y="26" width="9" height="16" rx="2" transform="rotate(8 28 26)" />
    </>
  ),
  launcher: (
    <>
      <rect x="10" y="17" width="55" height="12" rx="2" />
      <polygon points="65,15 80,10 80,34 65,29" />
      <polygon points="4,17 10,15 10,29 4,27" />
      <rect x="30" y="29" width="8" height="10" rx="1" />
    </>
  ),
  special: (
    <>
      <path d="M50 3 L75 11 L75 29 Q75 41 50 47 Q25 41 25 29 L25 11 Z" fillOpacity="0.35" />
      <path
        d="M50 3 L75 11 L75 29 Q75 41 50 47 Q25 41 25 29 L25 11 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <line x1="34" y1="14" x2="64" y2="38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
}

export default function WeaponIcon({ categorieId, className = 'w-6 h-6' }) {
  const content = ICONS[categorieId] ?? ICONS.assault_rifles
  return (
    <svg viewBox="0 0 100 48" className={className} fill="currentColor" aria-hidden="true">
      {content}
    </svg>
  )
}
