"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { AuthCard } from "@/components/auth/AuthCard";
import { ProfileImagePicker } from "@/components/auth/ProfileImagePicker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, uploadAvatar } from "@/lib/supabase/profile";
import { REGISTERED_DEFAULT_RADIUS_KM } from "@/lib/auth/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      let userId = currentUser?.id;

      if (currentUser?.is_anonymous) {
        const { data, error: updateError } = await supabase.auth.updateUser({
          email,
          password,
          data: { display_name: username },
        });
        if (updateError) throw updateError;
        userId = data.user?.id;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: username },
          },
        });
        if (signUpError) throw signUpError;
        userId = data.user?.id;
      }

      if (!userId) throw new Error("Registration did not return a user.");

      let avatarUrl: string | null = null;
      if (profileImageFile) {
        avatarUrl = await uploadAvatar(supabase, userId, profileImageFile);
      }

      await updateProfile(supabase, userId, {
        display_name: username,
        avatar_url: avatarUrl,
        visibility_radius_km: REGISTERED_DEFAULT_RADIUS_KM,
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
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
          Upgrade from guest mode to unlock full sharing radius.
        </p>
      </div>

      <div className="mb-6">
        <ProfileImagePicker
          value={profileImage}
          onChange={(preview, file) => {
            setProfileImagePreview(preview);
            setProfileImageFile(file ?? null);
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Username"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          {loading ? "Creating account..." : "SIGN UP"}
        </Button>
      </form>
    </AuthCard>
  );
}
