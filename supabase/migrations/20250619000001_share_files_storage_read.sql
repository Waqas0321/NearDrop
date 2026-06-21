-- Allow any authenticated user (guest or registered) to read shared files in storage.
-- Paths are only exposed via share_files rows, which already have SELECT for authenticated users.

CREATE POLICY "Authenticated users read shared storage files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'share-files');
