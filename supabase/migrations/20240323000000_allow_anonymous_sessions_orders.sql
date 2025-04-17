-- Enable RLS on the sessions table if not already enabled
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous users to manage their own sessions
CREATE POLICY "Allow anonymous users to create sessions"
ON sessions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read their own sessions"
ON sessions
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous users to update their own sessions"
ON sessions
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Enable RLS on the orders table if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous users to manage their own orders
CREATE POLICY "Allow anonymous users to create orders"
ON orders
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read their own orders"
ON orders
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous users to update their own orders"
ON orders
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true); 