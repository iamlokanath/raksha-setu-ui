"use client";

const STATUS_COLOR: Record<string, string> = { green: "#098855", yellow: "#f58020", red: "#d64246", unknown: "#8aa0b5" };

export function statusColor(status: string) {
  return STATUS_COLOR[status] ?? STATUS_COLOR.unknown;
}

export function Donut({ value, label, sub }: { value: number; label: string; sub: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const angle = pct * 3.6;
  return (
    <div className="flex flex-col items-center">
      <div
        className="grid h-36 w-36 place-items-center rounded-full"
        style={{ background: `conic-gradient(#1b52a4 ${angle}deg, #d7e8ff ${angle}deg)` }}
      >
        <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
          <div>
            <p className="text-2xl font-bold text-brand">{Math.round(pct)}%</p>
            <p className="text-[11px] text-ink-muted">{label}</p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-ink-muted">{sub}</p>
    </div>
  );
}

export function Meter({ label, value, color, caption }: { label: string; value: number | null; color: string; caption: string }) {
  const width = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-semibold" style={{ color }}>{value === null ? "—" : `${Math.round(value)}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#e7eef6]">
        <div className="h-full rounded-full" style={{ width: `${width}%`, background: color }} />
      </div>
      <p className="mt-1 text-xs text-ink-muted">{caption}</p>
    </div>
  );
}

type Pin = { id: string; name: string; status: string; latitude: number | null; longitude: number | null };

export function StatusMap({ pins, onSelect }: { pins: Pin[]; onSelect: (id: string) => void }) {
  const placed = pins.filter((pin) => pin.latitude !== null && pin.longitude !== null);
  return (
    <div className="relative h-[320px] overflow-hidden rounded-xl bg-[#d7ebf8]">
      <svg viewBox="0 0 640 420" className="h-full w-full">
        <rect width="640" height="420" fill="#d7ebf8" />
        <path d="M40 40c40 20 70 10 90 40 30-20 80-10 100 30 20-30 70-20 110 10 30-24 90-10 120 24 10-20 40-16 70 8 20 40 10 80-10 110-30 10-20 50-60 60-40 20-90 8-120 36-20 16-70 8-100-10-30 18-80 6-110-16-20 20-60 10-90-8V40z" fill="#f6f1e6" stroke="#e4d8c4" />
        <path d="M120 120c40 10 30 40 70 36M200 210c50-8 40 30 90 20M300 150c30 20 70 8 90 28" fill="none" stroke="#ead9b4" strokeWidth="6" strokeLinecap="round" />
        <circle cx="180" cy="160" r="4" fill="#1b52a4" />
        <circle cx="250" cy="230" r="4" fill="#1b52a4" />
        <circle cx="340" cy="180" r="4" fill="#1b52a4" />
      </svg>
      {placed.map((pin) => {
        const x = ((pin.longitude as number) - 81.2) / (87.6 - 81.2) * 78 + 8;
        const y = (22.7 - (pin.latitude as number)) / (22.7 - 17.6) * 78 + 8;
        return (
          <button
            key={pin.id}
            type="button"
            title={pin.name}
            onClick={() => onSelect(pin.id)}
            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{ left: `${x}%`, top: `${y}%`, background: statusColor(pin.status) }}
          />
        );
      })}
      <div className="absolute bottom-3 left-3 flex gap-3 rounded-lg bg-white/95 px-3 py-2 text-xs">
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-stable" /> Stable</span>
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-amber" /> Attention</span>
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-alert" /> Urgent</span>
      </div>
    </div>
  );
}

export function formatWhen(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
