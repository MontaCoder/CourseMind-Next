import Link from "next/link";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/config/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  size?: "small" | "medium" | "large";
  showImage?: boolean;
  showText?: boolean;
  className?: string;
}

/**
 * Shared Logo component used across all layouts
 * Ensures consistent branding throughout the application
 */
export function Logo({
  href = "/",
  size = "medium",
  showImage = true,
  showText = true,
  className,
}: LogoProps) {
  const sizeClasses = {
    small: {
      image: { width: 24, height: 24 },
      text: "text-lg",
    },
    medium: {
      image: { width: 32, height: 32 },
      text: "text-xl md:text-2xl",
    },
    large: {
      image: { width: 40, height: 40 },
      text: "text-2xl md:text-3xl",
    },
  };

  const config = sizeClasses[size];

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2 transition-opacity hover:opacity-80",
        className
      )}
    >
      {showImage && (
        <Image
          src="/logo.svg"
          alt={`${APP_CONFIG.name} Logo`}
          width={config.image.width}
          height={config.image.height}
          className="drop-shadow-sm transition-transform group-hover:scale-105"
        />
      )}
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text",
            config.text
          )}
        >
          {APP_CONFIG.name}
        </span>
      )}
    </Link>
  );
}
