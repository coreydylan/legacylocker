# Admin Setup for Legacy Locker

This document provides instructions for setting up admin access to the Legacy Locker application.

## Prerequisites

- Node.js installed
- Access to your Supabase project
- Supabase service key (not the anon key)

## Setup Steps

### 1. Update Environment Variables

Add the following to your `.env` file:

```
VITE_ADMIN_PASSWORD=legacylocker2024
VITE_SUPABASE_SERVICE_KEY=your_service_key_here
```

The service key can be found in your Supabase dashboard under Project Settings > API.

### 2. Apply RLS Policies

Run the following command to apply the RLS policies:

```bash
node apply-rls-policies.js
```

This script will:
- Apply the RLS policies to your Supabase project
- Create an admin user with the email `admin@legacylockerco.com`

### 3. Manual Setup (Alternative)

If the script doesn't work, you can manually apply the RLS policies:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/20240320000000_admin_rls.sql`
5. Run the query

### 4. Create Admin User (Manual)

If you need to create the admin user manually:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter the following details:
   - Email: admin@legacylockerco.com
   - Password: legacylocker2024
5. Click "Create User"

## Troubleshooting

If you encounter issues with authentication:

1. Check that the RLS policies are applied correctly
2. Verify that the admin user exists and has the correct password
3. Check the browser console for any errors
4. Try logging out and logging back in

## Security Notes

- The admin password should be changed after initial setup
- The service key should be kept secure and not committed to version control
- Consider implementing more robust authentication in the future 