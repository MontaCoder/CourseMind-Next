import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Shared auth page layout with background decorations
 * Used by login, signup, and forgot-password pages
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_55%)]" />
      <div className="absolute inset-y-0 right-[10%] w-[42rem] rounded-full bg-primary/10 blur-[140px] opacity-40" />

      {/* Content */}
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:bg-card/85">
          {children}
        </div>
      </div>
    </div>
  );
}
