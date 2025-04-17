-- Create a policy to allow anonymous users to read from the story_series table
CREATE POLICY "Allow anonymous users to read story series"
ON story_series
FOR SELECT
TO anon
USING (true); 