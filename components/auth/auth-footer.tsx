import Link from "next/link";

/**
 * Shared auth page footer with terms and privacy links
 */
export function AuthFooter() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      By continuing, you agree to our{" "}
      <Link href="/terms" className="underline hover:text-foreground">
        Terms
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="underline hover:text-foreground">
        Privacy Policy
      </Link>
    </p>
  );
}
