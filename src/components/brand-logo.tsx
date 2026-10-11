import React from "react";

export type LogoVariant = "primary" | "orange-white" | "white" | "icon";

interface BrandLogoProps {
  /**
   * - "primary": Original Plethora Logo (Orange mark + Black wordmark) — use on white or light backgrounds.
   * - "orange-white": Plethora Orange and White Logo (Orange mark + White wordmark) — use on black/dark backgrounds.
   * - "white": Plethora White Logo (White mark + White wordmark) — use on black backgrounds where monochrome is desired.
   * - "icon": Plethora Official Favicon mark (compact square icon).
   */
  variant?: LogoVariant;
  className?: string;
  height?: number;
}

const variantConfig: Record<
  LogoVariant,
  { src: string; aspectRatio: number; alt: string }
> = {
  primary: {
    src: "/brand/logo-primary.svg",
    aspectRatio: 994 / 162,
    alt: "Plethora",
  },
  "orange-white": {
    src: "/brand/logo-orange-white.svg",
    aspectRatio: 994 / 162,
    alt: "Plethora",
  },
  white: {
    src: "/brand/logo-white.svg",
    aspectRatio: 994 / 162,
    alt: "Plethora",
  },
  icon: {
    src: "/brand/favicon.svg",
    aspectRatio: 1,
    alt: "Plethora mark",
  },
};

export function BrandLogo({
  variant = "primary",
  className = "",
  height = 28,
}: BrandLogoProps) {
  const config = variantConfig[variant];
  const width = Math.round(height * config.aspectRatio);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={config.src}
      alt={config.alt}
      width={width}
      height={height}
      style={{ height: `${height}px`, width: `${width}px` }}
      className={`block select-none object-contain ${className}`}
      decoding="async"
    />
  );
}
