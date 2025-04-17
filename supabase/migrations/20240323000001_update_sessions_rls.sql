-- Drop existing policies for sessions table
DROP POLICY IF EXISTS "Allow anonymous users to create sessions" ON sessions;
DROP POLICY IF EXISTS "Allow anonymous users to read their own sessions" ON sessions;
DROP POLICY IF EXISTS "Allow anonymous users to update their own sessions" ON sessions;

-- Create policies for both anonymous and authenticated users
CREATE POLICY "Allow users to create sessions"
ON sessions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow users to read their own sessions"
ON sessions
FOR SELECT
TO public
USING (
  (auth.role() = 'anon' AND true) OR
  (auth.role() = 'authenticated' AND email = auth.jwt()->>'email')
);

CREATE POLICY "Allow users to update their own sessions"
ON sessions
FOR UPDATE
TO public
USING (
  (auth.role() = 'anon' AND true) OR
  (auth.role() = 'authenticated' AND email = auth.jwt()->>'email')
)
WITH CHECK (
  (auth.role() = 'anon' AND true) OR
  (auth.role() = 'authenticated' AND email = auth.jwt()->>'email')
); 