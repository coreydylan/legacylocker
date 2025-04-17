const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service key. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
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
    console.log('You can now log in with:');
    console.log('Email: admin@legacylockerco.com');
    console.log('Password:', process.env.VITE_ADMIN_PASSWORD || 'legacylocker2024');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser(); 