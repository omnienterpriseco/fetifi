import Image from "next/image";
import { brand } from "@/lib/brand";

export function BrandLockup({
  className = "",
  priority = false,
  fillWidth = true,
}: {
  className?: string;
  priority?: boolean;
  fillWidth?: boolean;
}) {
  if (fillWidth) {
    return (
      <span className={`relative block aspect-[994/544] w-full ${className}`}>
        <Image
          src={brand.logo}
          alt={`${brand.name}: ${brand.tagline}`}
          fill
          unoptimized
          className="object-contain"
          sizes="(min-width: 768px) 40vw, 90vw"
          priority={priority}
        />
      </span>
    );
  }

  return (
    <Image
      src={brand.logo}
      alt={`${brand.name}: ${brand.tagline}`}
      width={994}
      height={544}
      className={`object-contain ${className}`}
      sizes="240px"
      unoptimized
      priority={priority}
    />
  );
}

export function PastelTagline({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      <span className="text-[#e8a8c4]">Party</span>{" "}
      <span className="text-[#9fc4b8]">in a</span>{" "}
      <span className="text-[#c9b6de]">box</span>
    </span>
  );
}

export function BrandBar({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center">
      <BrandLockup
        fillWidth={false}
        className={compact ? "h-8 w-auto max-w-[168px]" : "h-10 w-auto max-w-[220px]"}
        priority
      />
    </span>
  );
}
