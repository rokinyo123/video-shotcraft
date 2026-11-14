import React from 'react';

export type IconName = 'quran' | 'hadith' | 'quill' | 'search' | 'warn' | 'check' | 'cross' | 'question' | 'hourglass' | 'globe' | 'seal' | 'light' | 'fire' | 'clay' | 'people' | 'calendar' | 'scale';

/** Sadə, qızılı xətt ikonları (24×24). */
export const Icon: React.FC<{name: IconName; size?: number; color?: string}> = ({name, size = 40, color = '#d6a84e'}) => {
  const s = {fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const paths: Record<IconName, React.ReactNode> = {
    quran: (
      <>
        <path d="M12 6c-2-1.6-5-2-8-1.5v13c3-.5 6-.1 8 1.5 2-1.6 5-2 8-1.5v-13c-3-.5-6-.1-8 1.5z" {...s} />
        <path d="M12 6v13" {...s} />
        <path d="M15 9.5l1 1.2 1-1.2M7 9.5l1 1.2 1-1.2" {...s} strokeWidth={1.1} />
      </>
    ),
    hadith: (
      <>
        <path d="M6 4h10a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2z" {...s} />
        <path d="M4 6a2 2 0 0 1 2-2M9 9h6M9 12h6M9 15h4" {...s} />
      </>
    ),
    quill: (
      <>
        <path d="M20 4C12 5 7 10 5 19l2-1c1-3 3-5 6-6-2 0-3 0-4 1 2-4 6-7 11-9z" {...s} />
        <path d="M4 20h7" {...s} />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6" {...s} />
        <path d="M15 15l5 5M8 10.5h5M10.5 8v5" {...s} />
      </>
    ),
    warn: (
      <>
        <path d="M12 3l9.5 17h-19z" {...s} />
        <path d="M12 9.5v5M12 17.3v.2" {...s} />
      </>
    ),
    check: <path d="M4 12.5l5 5L20 6.5" {...s} strokeWidth={2} />,
    cross: <path d="M5 5l14 14M19 5L5 19" {...s} strokeWidth={2} />,
    question: (
      <>
        <circle cx="12" cy="12" r="9" {...s} />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 16.6v.2" {...s} />
      </>
    ),
    hourglass: <path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" {...s} />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" {...s} />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" {...s} />
      </>
    ),
    seal: (
      <>
        <circle cx="12" cy="10" r="6" {...s} />
        <path d="M8.5 15l-1.5 6 5-2.5 5 2.5-1.5-6M12 7v6M9 10h6" {...s} />
      </>
    ),
    light: (
      <>
        <circle cx="12" cy="12" r="4" {...s} />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" {...s} />
      </>
    ),
    fire: <path d="M12 21c-4 0-6-3-6-6 0-4 4-6 4-10 3 2 4 4 4 6 1-1 2-2 2-3 2 2 2 4 2 7 0 3-2 6-6 6z" {...s} />,
    clay: (
      <>
        <path d="M5 19c0-4 2-6 7-6s7 2 7 6z" {...s} />
        <circle cx="12" cy="7.5" r="3.5" {...s} />
      </>
    ),
    people: (
      <>
        <circle cx="8" cy="8" r="3" {...s} />
        <circle cx="16.5" cy="9" r="2.5" {...s} />
        <path d="M3 19c0-3 2-5 5-5s5 2 5 5M13.5 18.5c.3-2.5 1.6-4 3-4 2 0 3.5 1.5 3.5 4" {...s} />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="1.5" {...s} />
        <path d="M4 9.5h16M8 3v4M16 3v4" {...s} />
      </>
    ),
    scale: <path d="M12 4v16M8 20h8M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" {...s} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};
