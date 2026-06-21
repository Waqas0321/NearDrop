import Image from "next/image";
import Link from "next/link";
import { figma } from "@/lib/figma-tokens";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  link?: boolean;
}

const sizes = {
  sm: { height: 24, text: "text-[15px]" },
  md: { height: 32, text: "text-lg" },
  lg: { height: 40, text: "text-xl" },
};

function logoWidth(height: number) {
  return Math.round(height / figma.logo.aspectRatio);
}

export function AirDropIcon({ size = 32 }: { size?: number }) {
  const height = size;
  const width = logoWidth(size);

  return (
    <Image
      src="/logo.svg"
      alt="NearDrop"
      width={width}
      height={height}
      className="shrink-0"
      style={{ width: "auto", height }}
      priority
    />
  );
}

export function Logo({
  showText = true,
  size = "md",
  href = "/",
  link = true,
}: LogoProps) {
  const { height, text } = sizes[size];

  const content = (
    <div className="flex items-center gap-2">
      <AirDropIcon size={height} />
      {showText && (
        <span className={`${text} font-bold tracking-[-0.02em] text-primary`}>
          NearDrop
        </span>
      )}
    </div>
  );

  if (link && href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
