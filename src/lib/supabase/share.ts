import type { SupabaseClient } from "@supabase/supabase-js";
import { SHARE_FILES_BUCKET } from "@/lib/auth/constants";
import type { Database, ShareFile, ShareSession } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export interface SaveSharePayload {
  text: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  files: File[];
}

export async function upsertShareSession(
  supabase: Client,
  userId: string,
  payload: SaveSharePayload
): Promise<ShareSession> {
  const { data: session, error: sessionError } = await supabase
    .from("share_sessions")
    .upsert(
      {
        user_id: userId,
        text_content: payload.text,
        latitude: payload.latitude,
        longitude: payload.longitude,
        radius_km: payload.radiusKm,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();

  if (sessionError) throw sessionError;

  await supabase.from("share_files").delete().eq("session_id", session.id);

  if (payload.files.length > 0) {
    const rows: Database["public"]["Tables"]["share_files"]["Insert"][] = [];

    for (const file of payload.files) {
      const storagePath = `${userId}/${session.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(SHARE_FILES_BUCKET)
        .upload(storagePath, file, {
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) throw uploadError;

      rows.push({
        session_id: session.id,
        user_id: userId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type || null,
        storage_path: storagePath,
      });
    }

    const { error: filesError } = await supabase.from("share_files").insert(rows);
    if (filesError) throw filesError;
  }

  return session;
}

export async function fetchActiveShareSessions(
  supabase: Client
): Promise<ShareSession[]> {
  const { data, error } = await supabase
    .from("share_sessions")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchProfilesByIds(
  supabase: Client,
  userIds: string[]
): Promise<Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "display_name" | "avatar_url">[]> {
  if (userIds.length === 0) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", userIds);

  if (error) throw error;
  return data ?? [];
}

export async function fetchShareFilesForSession(
  supabase: Client,
  sessionId: string
): Promise<ShareFile[]> {
  const { data, error } = await supabase
    .from("share_files")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getShareFileDownloadUrl(
  supabase: Client,
  storagePath: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(SHARE_FILES_BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

export async function deactivateShareSession(supabase: Client, userId: string) {
  const { data: session, error: fetchError } = await supabase
    .from("share_sessions")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (session) {
    const { error: filesError } = await supabase
      .from("share_files")
      .delete()
      .eq("session_id", session.id);
    if (filesError) throw filesError;
  }

  const { error } = await supabase
    .from("share_sessions")
    .update({
      is_active: false,
      text_content: "",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) throw error;
}
