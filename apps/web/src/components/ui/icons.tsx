import React from 'react';

// Brand icon set — keys match ServiceSummary.icon values + common UI needs.
// Stroke icons, 24 viewBox. Use: <Icon name="id" className="h-5 w-5" />

const paths: Record<string, React.ReactNode> = {
  id: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M13 9.5h4M13 13h4M7 15.5c.5-1.2 1.2-1.8 2-1.8s1.5.6 2 1.8" /></>,
  passport: <><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M9 16.5c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5" /></>,
  doc: <><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h4M9 13h6M9 16.5h6" /></>,
  bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13L13 2z" />,
  water: <path d="M12 3c3.5 4.2 6 7.3 6 10a6 6 0 0 1-12 0c0-2.7 2.5-5.8 6-10z" />,
  health: <><path d="M12 21C7 17 3 13.5 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5c0 4-4 7.5-9 11.5z" /><path d="M6 12h3l1.5-2.5L13 15l1.5-3H18" /></>,
  education: <><path d="m3 9 9-4.5L21 9l-9 4.5L3 9z" /><path d="M7 11.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5M21 9v5" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M16 15h2" /><circle cx="16.5" cy="15" r=".5" /></>,
  building: <><rect x="4" y="4" width="16" height="17" rx="1" /><path d="M9 21v-4h6v4M8 8h2m4 0h2M8 12h2m4 0h2" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3z" /><path d="m9 12 2 2 4-4" /></>,
  court: <><path d="M12 4v3M6 21h12M8 21v-8h8v8M4 9h16M7 9l5-5 5 5" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" /><circle cx="17" cy="9" r="2.2" /><path d="M15.5 14.8c2.3.2 4.2 1.5 5 4" /></>,
  briefcase: <><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  truck: <><rect x="2" y="7" width="12" height="9" rx="1" /><path d="M14 10h4l3.5 3.5V16H14z" /><circle cx="6.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>,
  signal: <><path d="M4 20v-4M9 20v-7M14 20V10M19 20V6" /></>,
  bell: <><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" /><path d="M10 19a2.2 2.2 0 0 0 4 0" /></>,
  check: <path d="m4.5 12.5 5 5L19.5 7" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  map: <><path d="M9 4 3.5 6.5v13L9 17l6 2.5 5.5-2.5v-13L15 6.5 9 4z" /><path d="M9 4v13M15 6.5v13" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  home: <><path d="m3.5 10.5 8.5-7 8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6H4.5a1 1 0 0 1-1-1v-9.5z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  fuel: <><rect x="4" y="4" width="9" height="17" rx="1.5" /><path d="M13 9h3a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 0 3 0V9.5L18 6M7 9h3" /></>,
  trash: <><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6m4-6v6" /></>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 17.5h2" /></>,
  qr: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h3v3h-3zM20 14v2m0 4h-6v-2" /></>,
  cap: <><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M8 11V7.5A2.5 2.5 0 0 1 10.5 5h3A2.5 2.5 0 0 1 16 7.5V11" /></>,
  send: <path d="m4 11 16-6-6 16-2.5-7L4 11z" />,
  warn: <><path d="M12 4 2.8 19.5h18.4L12 4z" /><path d="M12 10v4m0 3v.01" /></>,
};

export function Icon({
  name,
  className = 'h-5 w-5',
  strokeWidth = 1.7,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name] ?? paths.doc}
    </svg>
  );
}
