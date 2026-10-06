import type { ReactNode } from "react";

export function LogoMark({ className = "h-10 w-10", light = false }: { className?: string; light?: boolean }) {
  const outer = light ? "#ffffff" : "#1b52a4";
  const inner = light ? "#d7efff" : "#00a2e5";
  const mark = light ? "#1b52a4" : "#ffffff";
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 2.5 43 11.2v13.4c0 11.4-7.8 19.2-19 22.4C12.8 43.8 5 36 5 24.6V11.2L24 2.5z" fill={outer} />
      <path d="M24 9.2 36.2 14.6v9.6c0 7.4-4.8 12.6-12.2 14.8-7.4-2.2-12.2-7.4-12.2-14.8v-9.6L24 9.2z" fill={inner} />
      <path d="M24 17.2v12.2M18 23.3h12" stroke={mark} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    dashboard: <path {...common} d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    shelter: <path {...common} d="M3 10.5 12 4l9 6.5V20H3zM9 20v-5h6v5" />,
    report: <path {...common} d="M7 3h8l4 4v14H7zM9 11h6M9 15h6" />,
    alert: <path {...common} d="M12 3 2.5 20h19L12 3zM12 9v5M12 17h.01" />,
    resource: <path {...common} d="M4 8h16v11H4zM8 8V5h8v3M8 13h8" />,
    action: <path {...common} d="M4 12h10M10 8l4 4-4 4M14 6h6v12" />,
    users: <path {...common} d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19a5.5 5.5 0 0 1 11 0M16 8.5a2.5 2.5 0 1 0 0-5M16.5 19a5 5 0 0 0-2-3.8" />,
    settings: <path {...common} d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 3v2.2M12 18.8V21M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3 12h2.2M18.8 12H21M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" />,
    monitor: <path {...common} d="M3 5h18v11H3zM8 20h8M12 16v4" />,
    offline: <path {...common} d="M8 7a8 8 0 0 1 10 2M6 11a6 6 0 0 1 8-2M12 17h.01M5 19l14-14" />,
    bell: <path {...common} d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2H4.5zM10 19a2 2 0 0 0 4 0" />,
    boxes: <path {...common} d="M3 8 12 4l9 4-9 4zM3 8v8l9 4 9-4V8" />,
    language: <path {...common} d="M4 6h10M9 6c0 6-3 9-6 10M6.5 10c.8 2 2.4 3.6 5.5 4.5M13 19l4-9 4 9M14.5 16h5" />,
    shield: <path {...common} d="M12 3 20 6.5v6c0 5-3.2 8.2-8 9.5-4.8-1.3-8-4.5-8-9.5v-6z" />,
    lock: <path {...common} d="M8 11V8a4 4 0 0 1 8 0v3M6 11h12v9H6z" />,
    building: <path {...common} d="M4 20V6l8-3 8 3v14M9 20v-5h6v5M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01" />,
    check: <path {...common} d="M5 12.5 9 16l10-9" />,
    mail: <path {...common} d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    eye: <path {...common} d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[name] ?? paths.shield}
    </svg>
  );
}
