import React from "react";

export type CapabilityStatus =
  | "available"
  | "in-development"
  | "planned"
  | "illustrative"
  | "editorial-draft";

interface StatusBadgeProps {
  status: CapabilityStatus;
  customLabel?: string;
  darkSurface?: boolean;
}

const statusMap: Record<
  CapabilityStatus,
  {
    label: string;
    dotColor: string;
    lightClasses: string;
    darkClasses: string;
  }
> = {
  available: {
    label: "Internal operating base",
    dotColor: "bg-[#5ad824]",
    lightClasses: "bg-[#f7f6f2] text-black border-[#e4e4e4]",
    darkClasses: "bg-white/10 text-white border-white/20",
  },
  "in-development": {
    label: "In development",
    dotColor: "bg-[#f4a834]",
    lightClasses: "bg-[#fff8eb] text-black border-[#f4a834]/50",
    darkClasses: "bg-[#f4a834]/15 text-white border-[#f4a834]/40",
  },
  planned: {
    label: "Planned · 12-month roadmap",
    dotColor: "bg-[#ff6e14]",
    lightClasses: "bg-[#fff3eb] text-[#c04900] border-[#fcb488]",
    darkClasses: "bg-[#ff6e14]/20 text-[#fcb488] border-[#ff6e14]/40",
  },
  illustrative: {
    label: "Illustrative preview",
    dotColor: "bg-[#40576d]",
    lightClasses: "bg-[#f7f6f2] text-zinc-700 border-[#e4e4e4]",
    darkClasses: "bg-white/10 text-zinc-300 border-white/15",
  },
  "editorial-draft": {
    label: "Editorial draft · Pending final review",
    dotColor: "bg-[#f4a834]",
    lightClasses: "bg-[#fff8eb] text-zinc-900 border-[#f4a834]/50",
    darkClasses: "bg-white/10 text-zinc-200 border-white/20",
  },
};

export function StatusBadge({
  status,
  customLabel,
  darkSurface = false,
}: StatusBadgeProps) {
  const cfg = statusMap[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide ${
        darkSurface ? cfg.darkClasses : cfg.lightClasses
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${cfg.dotColor}`}
        aria-hidden="true"
      />
      <span>{customLabel || cfg.label}</span>
    </span>
  );
}
