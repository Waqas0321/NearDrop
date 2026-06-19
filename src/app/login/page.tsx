"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { AuthCard } from "@/components/auth/AuthCard";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("neardrop-auth", "true");
    router.push("/");
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
          Enter your details to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          labelAction={
            <Link
              href="#"
              className="text-xs font-medium text-primary hover:text-primary-hover"
            >
              Forgot password?
            </Link>
          }
          required
        />

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
          />
          <span className="text-sm text-muted">
            Remember this device for 30 days
          </span>
        </label>

        <Button type="submit" fullWidth className="h-12 tracking-wider">
          SIGN IN
        </Button>
      </form>

      <SocialLogin />
    </AuthCard>
  );
}
