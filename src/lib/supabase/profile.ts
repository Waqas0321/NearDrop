import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AVATARS_BUCKET,
  GUEST_MAX_RADIUS_KM,
  REGISTERED_DEFAULT_RADIUS_KM,
} from "@/lib/auth/constants";
import type { Database, Profile } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export async function fetchProfile(
  supabase: Client,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function ensureProfile(
  supabase: Client,
  userId: string,
  isGuest: boolean,
  displayName = "Guest"
): Promise<Profile> {
  const existing = await fetchProfile(supabase, userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      display_name: displayName,
      visibility_radius_km: isGuest
        ? GUEST_MAX_RADIUS_KM
        : REGISTERED_DEFAULT_RADIUS_KM,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: Client,
  userId: string,
  updates: Partial<Pick<Profile, "display_name" | "avatar_url" | "visibility_radius_km">>
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAvatar(
  supabase: Client,
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function deleteAccountData(supabase: Client, userId: string) {
  await supabase.from("share_files").delete().eq("user_id", userId);
  await supabase.from("share_sessions").delete().eq("user_id", userId);
  await supabase.from("profiles").delete().eq("id", userId);
  await supabase.storage.from(AVATARS_BUCKET).remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);
}
