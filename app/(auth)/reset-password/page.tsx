"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Lock, CheckCircle } from "lucide-react";
import { appName } from "@/lib/constants";
import { resetPassword } from "@/actions/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!token) {
      setError("Invalid or missing reset token");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_55%)]" />
      <div className="absolute inset-y-0 right-[10%] w-[42rem] rounded-full bg-primary/10 blur-[140px] opacity-40" />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:bg-card/85">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                {appName}
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mt-4">Set new password</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Password reset successful!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to login...
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  Go to login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      minLength={6}
                      disabled={isLoading || !token}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      minLength={6}
                      disabled={isLoading || !token}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="underline hover:text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
