"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/auth/auth-header";
import { FormError } from "@/components/auth/form-error";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { AuthFooter } from "@/components/auth/auth-footer";
import { FormInput } from "@/components/form/form-input";
import { SubmitButton } from "@/components/form/submit-button";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your account to continue"
      />

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

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          required
          disabled={isLoading}
          labelAction={
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          }
        />

        <SubmitButton
          isLoading={isLoading}
          loadingText="Signing in..."
          className="w-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
        >
          Sign in
        </SubmitButton>
      </form>

      <GoogleSignInButton disabled={isLoading} onClick={handleGoogleSignIn} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>

      <AuthFooter />
    </AuthLayout>
  );
}
