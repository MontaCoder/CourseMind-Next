"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { appName } from "@/lib/constants";
import { requestPasswordReset } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await requestPasswordReset(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
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
              <Image src="/logo.svg" alt="CourseMind Logo" width={32} height={32} className="drop-shadow-sm" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                {appName}
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mt-4">Reset your password</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-foreground">
                <p className="font-medium mb-1">Check your email</p>
                <p className="text-muted-foreground">
                  If an account exists with that email, we've sent password reset instructions.
                </p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
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
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
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
