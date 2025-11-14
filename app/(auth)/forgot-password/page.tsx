"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/auth/auth-header";
import { FormError } from "@/components/auth/form-error";
import { FormInput } from "@/components/form/form-input";
import { SubmitButton } from "@/components/form/submit-button";
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
    <AuthLayout>
      <AuthHeader
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link"
      />

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
          <FormError message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              required
              disabled={isLoading}
            />

            <SubmitButton
              isLoading={isLoading}
              loadingText="Sending reset link..."
              className="w-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
            >
              Send reset link
            </SubmitButton>
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

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="underline hover:text-foreground">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
