# Fixing Database Connection Error: "role 'ops' does not exist"

## Problem Description

You're experiencing a PostgreSQL error where the database is trying to use a role called "ops" that doesn't exist. This typically happens when the Supabase URL contains query parameters that specify a non-existent database role.

## Quick Fix

### Step 1: Run the Diagnostic Script

First, run the diagnostic script to identify the issue:

```bash
node diagnose-db-connection.js
```

This will show you if your `VITE_SUPABASE_URL` contains problematic parameters.

### Step 2: Update Your Environment Variables

1. Open your `.env` or `.env.local` file
2. Look for the `VITE_SUPABASE_URL` variable
3. If it looks something like this:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co?options=-c%20role%3Dops
   ```
   
4. Remove the query parameters to make it clean:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

### Step 3: Restart Your Development Server

After updating the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## What Was Fixed in the Code

I've updated the following files to automatically clean problematic URL parameters:

1. **`src/lib/supabaseClient.ts`** - Main Supabase client for the app
2. **`supabase/functions/_shared/supabaseClientServiceRole.ts`** - Service role client
3. **`supabase/functions/save-session/index.ts`** - Save session edge function
4. **`supabase/functions/get-session/index.ts`** - Get session edge function

These updates will automatically remove any `?options=` parameters that might contain invalid role specifications.

## If the Problem Persists

If you're still seeing the error after these changes:

### 1. Check Vercel Environment Variables

If you're deployed on Vercel, make sure to update the environment variables there too:
- Go to your Vercel project settings
- Navigate to Environment Variables
- Update `VITE_SUPABASE_URL` to remove any query parameters

### 2. Clear Browser Cache

Sometimes the old configuration might be cached:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
- Or open Developer Tools → Application → Clear Storage

### 3. Check Supabase Dashboard

Ensure your Supabase project is properly configured:
1. Go to your Supabase dashboard
2. Check Settings → API
3. Copy the clean project URL (without any parameters)

### 4. Verify RLS Policies

The error might also occur if Row Level Security policies are misconfigured:
1. Go to Supabase Dashboard → Database → Tables
2. Check that RLS is enabled on your tables
3. Verify that policies allow anonymous access where needed

## Environment Variable Template

Here's what your Supabase environment variables should look like:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_KEY=your-service-key-here  # Optional, only for server-side operations
```

## Need More Help?

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Run `npx supabase status` to verify your local Supabase setup
3. Check the Supabase logs in your dashboard for any database errors

The key is ensuring your `VITE_SUPABASE_URL` is clean without any role parameters that don't exist in your database. 