/*
  # Add Admin Role to User Profiles

  ## Changes
  1. Add is_admin column to user_profiles table
  2. Create policy for admins to view all profiles
  3. Create policy for admins to update any profile
  4. Create policy for admins to delete profiles
  
  ## Admin Setup
  To make a user an admin, run:
  UPDATE user_profiles SET is_admin = true WHERE email = 'admin@example.com';
*/

-- Add is_admin column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy: Admins can delete any profile
CREATE POLICY "Admins can delete any profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
