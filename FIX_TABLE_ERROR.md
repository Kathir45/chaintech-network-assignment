# 🔧 URGENT: Fix "Table Not Found" Error

## Problem
```
Could not find the table 'public.user_profiles' in the schema cache
```

This means the database table hasn't been created yet in your Supabase project.

## 🚀 Quick Fix (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (the one matching your URL: `ndxakgdvwompdskdjkxb.supabase.co`)

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### Step 3: Run the Setup Script
1. Open the file: `supabase/COMPLETE_SETUP.sql` (I just created it)
2. **Copy ALL the contents** of that file
3. **Paste** it into the Supabase SQL Editor
4. Click **"Run"** or press `Ctrl+Enter`

### Step 4: Verify Success
You should see output showing:
- Table created ✅
- Columns listed ✅
- Policies created ✅

### Step 5: Test Your App
1. Go back to your application
2. Try to register a new user
3. The error should be gone!

---

## 📋 Alternative: Manual Step-by-Step

If you prefer to run commands one at a time:

### 1. Create the Table
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 2. Enable Row Level Security
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### 3. Create User Policies
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### 4. Create Admin Policies
```sql
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can delete any profile
CREATE POLICY "Admins can delete any profile"
  ON user_profiles FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### 5. Create Auto-Update Trigger
```sql
-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## ✅ Verification

Run this to confirm everything is set up:

```sql
-- Should return your table
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'user_profiles';

-- Should return 9 columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles';

-- Should return 6 policies
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'user_profiles';
```

---

## 🎯 After Setup

1. **Register a new user** through your app
2. **Make them an admin** (if needed):
   ```sql
   UPDATE user_profiles 
   SET is_admin = true 
   WHERE email = 'your-email@example.com';
   ```

3. **Test everything:**
   - Registration ✅
   - Login ✅
   - Profile edit ✅
   - Theme toggle ✅
   - Admin dashboard (if admin) ✅

---

## 🆘 Still Having Issues?

### Error: "relation already exists"
- The table is already created, skip to Step 3 (policies)

### Error: "permission denied"
- Make sure you're the project owner
- Check you're in the correct Supabase project

### Error: "syntax error"
- Make sure you copied the entire SQL script
- Don't miss any semicolons

### Can't see the table
- Refresh the Supabase dashboard
- Check you're looking at the "public" schema
- Try: `SELECT * FROM public.user_profiles;`

---

## 📍 Quick Reference

**Your Supabase Project:** `ndxakgdvwompdskdjkxb.supabase.co`

**File to Run:** `supabase/COMPLETE_SETUP.sql`

**Expected Result:** Table created with 9 columns and 6 RLS policies

---

**Once you run the setup script, your app will work! 🎉**
