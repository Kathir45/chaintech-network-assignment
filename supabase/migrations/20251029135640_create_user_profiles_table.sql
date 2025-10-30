/*
  # User Profiles Management System

  ## Overview
  Creates a comprehensive user profiles table to store additional user information
  beyond the default auth.users table provided by Supabase.

  ## New Tables
  1. `user_profiles`
    - `id` (uuid, primary key) - Links to auth.users.id
    - `email` (text, not null) - User's email address
    - `full_name` (text) - User's full name
    - `phone` (text) - User's phone number
    - `bio` (text) - User biography or description
    - `avatar_url` (text) - URL to user's avatar image
    - `created_at` (timestamptz) - Account creation timestamp
    - `updated_at` (timestamptz) - Last profile update timestamp

  ## Security
  - Enables Row Level Security (RLS) on user_profiles table
  - Adds policy for users to view their own profile data
  - Adds policy for users to insert their own profile during registration
  - Adds policy for users to update their own profile information
  - All policies require authentication and validate user ownership

  ## Important Notes
  1. The id field references auth.users(id) with CASCADE delete
  2. Email is synchronized with auth.users for consistency
  3. Updated_at timestamp automatically updates on row modification
  4. All personal data is protected by RLS policies
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
