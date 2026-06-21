"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { AuthCard } from "@/components/auth/AuthCard";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/supabase/profile";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      footer={
        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Create account
          </Link>
        </p>
      }
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo size="lg" link={false} />
        <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-5 text-muted">
          Sign in to unlock full radius and profile settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          className="h-12 tracking-wider"
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </Button>
      </form>

      <SocialLogin />
    </AuthCard>
  );
}
