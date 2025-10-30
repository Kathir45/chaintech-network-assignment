-- Quick Admin Setup Script
-- Run this in your Supabase SQL Editor

-- Step 1: Verify the is_admin column exists
-- If this query fails, you need to run the migration first
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'is_admin';

-- Step 2: View all current users
SELECT id, email, full_name, is_admin, created_at 
FROM user_profiles 
ORDER BY created_at DESC;

-- Step 3: Make a user an admin (UPDATE THE EMAIL)
-- Replace 'your-email@example.com' with the actual admin email
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Step 4: Verify admin users
SELECT email, full_name, is_admin, created_at 
FROM user_profiles 
WHERE is_admin = true;

-- Optional: Create a test admin account
-- First, register this user through your app, then run:
-- UPDATE user_profiles SET is_admin = true WHERE email = 'admin@test.com';

-- Optional: Remove admin privileges from a user
-- UPDATE user_profiles SET is_admin = false WHERE email = 'user@example.com';

-- Optional: View admin count
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_admin = true) as admin_count,
  COUNT(*) FILTER (WHERE is_admin = false) as regular_users
FROM user_profiles;
