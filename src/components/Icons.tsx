import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const ArrowRight = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Check = (p: P) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
);
export const Wave = (p: P) => (
  <svg {...base(p)}><path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" /></svg>
);
export const Shield = (p: P) => (
  <svg {...base(p)}><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" /></svg>
);
export const Train = (p: P) => (
  <svg {...base(p)}><rect x="5" y="3" width="14" height="13" rx="3" /><path d="M5 11h14M9 16l-2 4M15 16l2 4" /><circle cx="9" cy="13" r="0.6" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="0.6" fill="currentColor" stroke="none"/></svg>
);
export const Signal = (p: P) => (
  <svg {...base(p)}><path d="M5 18a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0" /><circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none"/></svg>
);
export const Cube = (p: P) => (
  <svg {...base(p)}><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" /><path d="m3 7 9 5 9-5M12 12v10" /></svg>
);
export const Factory = (p: P) => (
  <svg {...base(p)}><path d="M3 21V9l6 4V9l6 4V5l6 3v13H3Z" /><path d="M7 21v-4M12 21v-4M17 21v-4" /></svg>
);
export const Cpu = (p: P) => (
  <svg {...base(p)}><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M9.5 9.5h5v5h-5z" /><path d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2" /></svg>
);
export const Chip = Cpu;
export const Target = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4" /><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" /></svg>
);
export const Gauge = (p: P) => (
  <svg {...base(p)}><path d="M4 18a8 8 0 1 1 16 0" /><path d="m12 14 4-3.5" /><circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" /></svg>
);
export const ShieldCheck = (p: P) => (
  <svg {...base(p)}><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const Wrench = (p: P) => (
  <svg {...base(p)}><path d="M14.5 6a3.5 3.5 0 0 0-4.6 4.3l-6 6a1.5 1.5 0 0 0 2.1 2.1l6-6A3.5 3.5 0 0 0 18 8l-2.3 2.3-2-2L16 6Z" /></svg>
);
export const Microscope = (p: P) => (
  <svg {...base(p)}><path d="M6 21h12M9 21a6 6 0 0 0 6-10" /><path d="m9 6 3-2 3 5-3 2-3-5Z" /><path d="m7.5 12.5 2.5 1.5" /></svg>
);
export const Boxes = (p: P) => (
  <svg {...base(p)}><path d="M12 2 4 6v5l8 4 8-4V6l-8-4Z" /><path d="m4 6 8 4 8-4M12 10v9" /></svg>
);
export const Radar = (p: P) => (
  <svg {...base(p)}><path d="M19.07 4.93a10 10 0 1 0 2.5 4.06" /><path d="M12 12 19 5" /><path d="M12 12a4 4 0 1 0 3.9 3.1" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
);
export const Bolt = (p: P) => (
  <svg {...base(p)}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>
);
export const Satellite = (p: P) => (
  <svg {...base(p)}><path d="m7 11 2-2-4-4-2 2a2.8 2.8 0 0 0 0 4l0 0a2.8 2.8 0 0 0 4 0Z" /><path d="m11 7 6 6M13 5l6 6" /><path d="M14 14a4 4 0 0 1-4 4M18 14a8 8 0 0 1-8 8" /></svg>
);
export const Rocket = (p: P) => (
  <svg {...base(p)}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2a3 3 0 0 0-3-3Z" /><path d="M9 11a12 12 0 0 1 8-8c2 0 3 1 3 3a12 12 0 0 1-8 8l-3 .5-.5-3.5Z" /><circle cx="15" cy="9" r="1.4" /></svg>
);
export const Waveform = (p: P) => (
  <svg {...base(p)}><path d="M2 12h3l2-7 4 16 3-11 2 6h6" /></svg>
);
export const Crosshair = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
);
export const Globe = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></svg>
);
export const Award = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="9" r="6" /><path d="M9 14l-1.5 7L12 18l4.5 3L15 14" /></svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Phone = (p: P) => (
  <svg {...base(p)}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const MapPin = (p: P) => (
  <svg {...base(p)}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const Clock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const FileText = (p: P) => (
  <svg {...base(p)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
);
export const TrendingUp = (p: P) => (
  <svg {...base(p)}><path d="M3 17l6-6 4 4 8-8" /><path d="M16 7h5v5" /></svg>
);
export const Layers = (p: P) => (
  <svg {...base(p)}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5M3 18l9 5 9-5" /></svg>
);
export const Sparkle = (p: P) => (
  <svg {...base(p)}><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" /></svg>
);
export const Menu = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const X = (p: P) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Linkedin = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 17v-7" /></svg>
);
export const Facebook = (p: P) => (
  <svg {...base(p)}><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 0 1 1-1Z" /></svg>
);
export const Youtube = (p: P) => (
  <svg {...base(p)}><rect x="3" y="6" width="18" height="12" rx="3" /><path d="m11 9 4 3-4 3V9Z" fill="currentColor" stroke="none"/></svg>
);

/* ── Commerce ─────────────────────────────────────────────────────────── */

export const Cart = (p: P) => (
  <svg {...base(p)}><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.5-1.2L20 8H6" /><circle cx="9.5" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></svg>
);
export const User = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>
);
export const Heart = (p: P) => (
  <svg {...base(p)}><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" /></svg>
);
export const Package = (p: P) => (
  <svg {...base(p)}><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" /><path d="m3 7 9 5 9-5M12 12v10M7.5 4.5l9 5" /></svg>
);
export const Truck = (p: P) => (
  <svg {...base(p)}><path d="M3 16V6h11v10M14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>
);
export const CreditCard = (p: P) => (
  <svg {...base(p)}><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6 15h3" /></svg>
);
export const Lock = (p: P) => (
  <svg {...base(p)}><rect x="4.5" y="10" width="15" height="10" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></svg>
);
export const LogOut = (p: P) => (
  <svg {...base(p)}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" /></svg>
);
export const Star = (p: P) => (
  <svg {...base(p)}><path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8L12 3.6Z" /></svg>
);
export const Plus = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14" /></svg>
);
export const Trash = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M6.5 7l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12" /></svg>
);
export const Pencil = (p: P) => (
  <svg {...base(p)}><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" /><path d="m14.5 6.5 3 3" /></svg>
);
export const Search = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const ChevronDown = (p: P) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronLeft = (p: P) => (
  <svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>
);
export const ChevronRight = (p: P) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const Dashboard = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="7.5" height="8.5" rx="1.6" /><rect x="13.5" y="3" width="7.5" height="5" rx="1.6" /><rect x="13.5" y="10.5" width="7.5" height="10.5" rx="1.6" /><rect x="3" y="14" width="7.5" height="7" rx="1.6" /></svg>
);
export const Users = (p: P) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.2" /><path d="M3 19a6 6 0 0 1 12 0" /><path d="M16 5.6a3.2 3.2 0 0 1 0 6.3M17.5 19a6 6 0 0 0-2-4.5" /></svg>
);
export const Inbox = (p: P) => (
  <svg {...base(p)}><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><path d="M3 13h5l1.5 2.5h5L16 13h5" /></svg>
);
export const Warning = (p: P) => (
  <svg {...base(p)}><path d="M12 4.5 21 19H3l9-14.5Z" /><path d="M12 10v4M12 16.5v.01" /></svg>
);
export const Spinner = (p: P) => (
  <svg {...base(p)} className={`animate-spin ${p.className ?? ""}`}><path d="M12 3a9 9 0 1 0 9 9" /></svg>
);
