"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { AuthCard } from "@/components/auth/AuthCard";
import { ProfileImagePicker } from "@/components/auth/ProfileImagePicker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { setProfileImage, removeProfileImage } from "@/lib/profile-storage";

export default function RegisterPage() {
  const router = useRouter();
  const [profileImage, setProfileImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("neardrop-auth", "true");

    if (profileImage) {
      setProfileImage(profileImage);
    } else {
      removeProfileImage();
    }

    router.push("/");
  };

  return (
    <AuthCard
      footer={
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <Logo size="lg" link={false} />
        <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-foreground">
          Create account
        </h1>
        <p className="mt-2 text-sm leading-5 text-muted">
          Enter your details to get started with NearDrop.
        </p>
      </div>

      <div className="mb-6">
        <ProfileImagePicker
          value={profileImage}
          onChange={setProfileImagePreview}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Username" placeholder="Enter your name" required />
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
          required
        />

        <Button type="submit" fullWidth className="h-12 tracking-wider">
          SIGN UP
        </Button>
      </form>
    </AuthCard>
  );
}
