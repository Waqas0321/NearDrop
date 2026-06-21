-- NearDrop initial schema: profiles, share sessions, storage

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Guest',
  avatar_url TEXT,
  visibility_radius_km NUMERIC NOT NULL DEFAULT 1
    CHECK (visibility_radius_km >= 0 AND visibility_radius_km <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.is_anonymous_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false)
    OR COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_guest')::boolean, false);
$$;

CREATE OR REPLACE FUNCTION public.enforce_profile_radius_cap()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF public.is_anonymous_user() AND NEW.visibility_radius_km > 1 THEN
    NEW.visibility_radius_km := 1;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_radius_cap
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_radius_cap();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, visibility_radius_km)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Guest'),
    CASE
      WHEN NEW.is_anonymous
        OR COALESCE((NEW.raw_user_meta_data ->> 'is_guest')::boolean, false)
      THEN 1
      ELSE 50
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Share sessions (clipboard + location)
-- ---------------------------------------------------------------------------
CREATE TABLE public.share_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  text_content TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  radius_km NUMERIC NOT NULL DEFAULT 1
    CHECK (radius_km >= 0 AND radius_km <= 500),
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX share_sessions_active_idx ON public.share_sessions (is_active, updated_at DESC);

ALTER TABLE public.share_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own share session"
  ON public.share_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users read active share sessions"
  ON public.share_sessions FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE OR REPLACE FUNCTION public.enforce_share_radius_cap()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF public.is_anonymous_user() THEN
    NEW.radius_km := LEAST(COALESCE(NEW.radius_km, 1), 1);
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER share_sessions_radius_cap
  BEFORE INSERT OR UPDATE ON public.share_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_share_radius_cap();

-- ---------------------------------------------------------------------------
-- Share files metadata
-- ---------------------------------------------------------------------------
CREATE TABLE public.share_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.share_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX share_files_session_idx ON public.share_files (session_id);

ALTER TABLE public.share_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own share files"
  ON public.share_files FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users read share files"
  ON public.share_files FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.share_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.share_files;

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('share-files', 'share-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users read own share files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'share-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users upload own share files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'share-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own share files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'share-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
