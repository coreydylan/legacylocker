#!/usr/bin/env node

/**
 * Diagnostic script to identify and fix database connection issues
 * Run with: node diagnose-db-connection.js
 */

require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

console.log('=== Database Connection Diagnostics ===\n');

// Check Supabase URL
const supabaseUrl = process.env.VITE_SUPABASE_URL;
console.log('1. Checking VITE_SUPABASE_URL:');
if (supabaseUrl) {
  console.log(`   ✓ Found: ${supabaseUrl}`);
  
  // Check if URL contains problematic parameters
  if (supabaseUrl.includes('?')) {
    console.log('   ⚠️  URL contains query parameters');
    
    try {
      const url = new URL(supabaseUrl);
      const params = new URLSearchParams(url.search);
      
      if (params.has('options')) {
        console.log(`   ❌ Found 'options' parameter: ${params.get('options')}`);
        
        // Check if it contains the ops role
        const optionsValue = params.get('options');
        if (optionsValue && optionsValue.includes('role')) {
          console.log('   ❌ The options parameter contains a role setting!');
          console.log('      This is likely causing the "role ops does not exist" error.\n');
          
          // Show the clean URL
          params.delete('options');
          url.search = params.toString();
          console.log('   ✅ Clean URL should be:');
          console.log(`      ${url.toString()}\n`);
          
          console.log('   📝 To fix this issue:');
          console.log('      1. Update your .env or .env.local file');
          console.log('      2. Replace the current VITE_SUPABASE_URL with the clean URL above');
          console.log('      3. Remove any ?options=-c%20role%3Dops or similar parameters\n');
        }
      } else {
        console.log('   ✅ No problematic options parameter found');
      }
    } catch (error) {
      console.log(`   ❌ Invalid URL format: ${error.message}`);
    }
  } else {
    console.log('   ✅ URL appears clean (no query parameters)');
  }
} else {
  console.log('   ❌ Not found! Please set VITE_SUPABASE_URL in your .env file');
}

console.log('\n2. Checking VITE_SUPABASE_ANON_KEY:');
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (anonKey) {
  console.log(`   ✓ Found (length: ${anonKey.length} characters)`);
} else {
  console.log('   ❌ Not found! Please set VITE_SUPABASE_ANON_KEY in your .env file');
}

console.log('\n3. Checking other relevant environment variables:');
const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
if (serviceKey) {
  console.log(`   ✓ VITE_SUPABASE_SERVICE_KEY found (length: ${serviceKey.length} characters)`);
} else {
  console.log('   ℹ️  VITE_SUPABASE_SERVICE_KEY not found (optional for client-side)');
}

// Check for common misconfigurations
console.log('\n4. Checking for common issues:');

// Check if URL ends with /rest/v1 or similar
if (supabaseUrl && (supabaseUrl.includes('/rest/') || supabaseUrl.includes('/auth/'))) {
  console.log('   ⚠️  URL contains API endpoint paths (/rest/ or /auth/)');
  console.log('      The URL should be just the base Supabase project URL');
  console.log('      Example: https://your-project.supabase.co');
}

// Check for localhost URLs in production
if (supabaseUrl && supabaseUrl.includes('localhost')) {
  console.log('   ⚠️  URL contains localhost - make sure this is intentional');
}

console.log('\n=== Summary ===');
if (supabaseUrl && !supabaseUrl.includes('role') && anonKey) {
  console.log('✅ Basic configuration appears correct');
  console.log('   If you\'re still seeing errors, try:');
  console.log('   1. Restart your development server');
  console.log('   2. Clear your browser cache');
  console.log('   3. Check the Supabase dashboard for any RLS policy issues');
} else {
  console.log('❌ Configuration issues detected - please fix the issues above');
}

console.log('\n=== Additional Debugging ===');
console.log('To see all environment variables starting with VITE_SUPABASE:');
Object.keys(process.env).forEach(key => {
  if (key.startsWith('VITE_SUPABASE')) {
    const value = process.env[key];
    const displayValue = key.includes('KEY') 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}` 
      : value;
    console.log(`   ${key}: ${displayValue}`);
  }
}); 