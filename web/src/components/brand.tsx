import Image from "next/image";
import { brand } from "@/lib/brand";

export function BrandMark({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={brand.icon}
      alt=""
      width={size}
      height={size}
      className={`rounded-[22%] ${className}`}
      priority
    />
  );
}

export function BrandLockup({ className = "" }: { className?: string }) {
  return (
    <Image
      src={brand.logo}
      alt={`${brand.name} — ${brand.tagline}`}
      width={973}
      height={427}
      className={`h-auto w-full ${className}`}
      priority
    />
  );
}
