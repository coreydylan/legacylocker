// This script applies the RLS policies to your Supabase project
// Run with: node apply-rls-policies.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service key. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client with service key
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyRLSPolicies() {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'supabase', 'migrations', '20240320000000_admin_rls.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Applying RLS policies...');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error applying RLS policies:', error);
      return;
    }
    
    console.log('RLS policies applied successfully!');
    
    // Create admin user if it doesn't exist
    console.log('Creating admin user...');
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@legacylockerco.com',
      password: process.env.VITE_ADMIN_PASSWORD || 'legacylocker2024',
      email_confirm: true,
    });
    
    if (adminError) {
      console.error('Error creating admin user:', adminError);
      return;
    }
    
    console.log('Admin user created successfully!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

applyRLSPolicies(); 