import Link from "next/link";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/config/constants";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Shared auth page header with logo and branding
 */
export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="inline-flex items-center gap-2 mb-4">
        <Image
          src="/logo.svg"
          alt={`${APP_CONFIG.name} Logo`}
          width={32}
          height={32}
          className="drop-shadow-sm"
        />
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          {APP_CONFIG.name}
        </span>
      </Link>
      <h1 className="text-2xl font-bold text-foreground mt-4">{title}</h1>
      <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}
