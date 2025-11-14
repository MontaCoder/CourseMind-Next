"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/auth/auth-header";
import { FormError } from "@/components/auth/form-error";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { AuthFooter } from "@/components/auth/auth-footer";
import { FormInput } from "@/components/form/form-input";
import { SubmitButton } from "@/components/form/submit-button";
import { signup } from "@/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await signup(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Auto sign-in after successful signup
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

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
        title="Create your account"
        subtitle="Start building amazing courses with AI"
      />

      <FormError message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="name"
          name="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={User}
          required
          disabled={isLoading}
        />

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

        <div className="space-y-2">
          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters
          </p>
        </div>

        <SubmitButton
          isLoading={isLoading}
          loadingText="Creating account..."
          className="w-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
        >
          Create account
        </SubmitButton>
      </form>

      <GoogleSignInButton disabled={isLoading} onClick={handleGoogleSignIn} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>

      <AuthFooter />
    </AuthLayout>
  );
}
