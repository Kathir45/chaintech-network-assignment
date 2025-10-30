# Admin Setup Guide

## Setting Up Admin Users in Supabase

This guide will help you set up admin users for your application.

## Prerequisites

- Supabase project set up
- Migrations applied to your database

## Steps to Create an Admin User

### Method 1: Using Supabase SQL Editor

1. **Log in to your Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Admin Setup SQL**
   
   To make an existing user an admin, run this query:
   ```sql
   UPDATE user_profiles 
   SET is_admin = true 
   WHERE email = 'your-admin-email@example.com';
   ```
   
   Replace `your-admin-email@example.com` with the actual email address of the user you want to make an admin.

4. **Verify the Change**
   ```sql
   SELECT email, is_admin FROM user_profiles WHERE is_admin = true;
   ```

### Method 2: During User Registration

If you want to create a new admin user from scratch:

1. First, register the user normally through your application
2. Then use Method 1 above to grant admin privileges

### Method 3: Using Supabase Table Editor

1. Go to your Supabase Dashboard
2. Click on "Table Editor" in the left sidebar
3. Select the `user_profiles` table
4. Find the user you want to make an admin
5. Click on the `is_admin` column for that user
6. Change the value from `false` to `true`
7. Click "Save"

## Testing Admin Access

1. **Log out** of your application if you're currently logged in
2. **Log in** with the admin user credentials
3. You should now see an **"Admin Dashboard"** button in the navigation bar
4. Click on it to access the admin panel where you can:
   - View all users
   - Edit user information
   - Grant/revoke admin privileges
   - Delete users

## Admin Dashboard Features

The admin dashboard allows you to:

- **View All Users**: See a complete list of all registered users
- **Search Users**: Search by name or email
- **Edit Users**: Update user information including:
  - Full name
  - Phone number
  - Bio
  - Admin status
- **Delete Users**: Remove users from the system
- **View Statistics**: See total users, admins, and regular users count

## Security Notes

⚠️ **Important Security Considerations:**

- Only grant admin privileges to trusted users
- Admin users can modify or delete any user account
- Admin users can grant admin privileges to other users
- Keep track of who has admin access
- Consider implementing audit logs for admin actions (future enhancement)

## Troubleshooting

### "Access Denied" when accessing admin dashboard

- Verify the user has `is_admin = true` in the database
- Try logging out and logging back in
- Check browser console for any errors

### Can't see Admin Dashboard button

- Make sure you're logged in with an admin account
- Check if the `is_admin` column was added to the `user_profiles` table
- Verify the migration `20251029140000_add_admin_role.sql` was applied

### Changes not reflecting

- Clear browser cache and reload
- Check if Supabase policies are properly set up
- Verify Row Level Security (RLS) is enabled on the table

## Example: Setting Up Your First Admin

```sql
-- 1. Find the user ID by email
SELECT id, email FROM user_profiles WHERE email = 'admin@example.com';

-- 2. Grant admin privileges
UPDATE user_profiles SET is_admin = true WHERE email = 'admin@example.com';

-- 3. Verify
SELECT id, email, is_admin FROM user_profiles WHERE is_admin = true;
```

## Default Admin Credentials (for testing)

For development purposes, you can create a test admin account:

**Email:** `admin@test.com`  
**Password:** (Set your own secure password during registration)

Then run:
```sql
UPDATE user_profiles SET is_admin = true WHERE email = 'admin@test.com';
```

⚠️ **Remember to change or remove test accounts in production!**
