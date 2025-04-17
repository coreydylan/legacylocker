-- Enable RLS on the story_samples table
ALTER TABLE story_samples ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow admin users to read all samples
CREATE POLICY "Allow admin users to read all samples"
ON story_samples
FOR SELECT
TO authenticated
USING (true);

-- Create a policy to allow admin users to insert samples
CREATE POLICY "Allow admin users to insert samples"
ON story_samples
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy to allow admin users to update samples
CREATE POLICY "Allow admin users to update samples"
ON story_samples
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create a policy to allow admin users to delete samples
CREATE POLICY "Allow admin users to delete samples"
ON story_samples
FOR DELETE
TO authenticated
USING (true);

-- Enable RLS on the story_series table
ALTER TABLE story_series ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow admin users to read all series
CREATE POLICY "Allow admin users to read all series"
ON story_series
FOR SELECT
TO authenticated
USING (true);

-- Create a policy to allow admin users to insert series
CREATE POLICY "Allow admin users to insert series"
ON story_series
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy to allow admin users to update series
CREATE POLICY "Allow admin users to update series"
ON story_series
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create a policy to allow admin users to delete series
CREATE POLICY "Allow admin users to delete series"
ON story_series
FOR DELETE
TO authenticated
USING (true);

-- Create a policy to allow admin users to upload to the user-uploads bucket
CREATE POLICY "Allow admin users to upload to user-uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads'
);

-- Create a policy to allow admin users to read from the user-uploads bucket
CREATE POLICY "Allow admin users to read from user-uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-uploads'
);

-- Create a policy to allow admin users to upload to the story_samples bucket
CREATE POLICY "Allow admin users to upload to story_samples"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'story_samples'
);

-- Create a policy to allow admin users to read from the story_samples bucket
CREATE POLICY "Allow admin users to read from story_samples"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'story_samples'
); 