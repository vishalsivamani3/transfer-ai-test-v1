# Supabase Setup Guide for Semester Planner

## Issue
The "Create Plan" function in the Semester Planner is currently failing because Supabase is not configured. The application needs your Supabase credentials to create and manage semester plans.

## Solution

### Step 1: Create Environment File
Create a `.env.local` file in your project root directory (same level as `package.json`):

```bash
touch .env.local
```

### Step 2: Add Supabase Credentials
Add the following to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (or create a new one)
3. **Go to Settings → API**
4. **Copy the following values**:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Update Your .env.local File
Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Restart Development Server
Stop your current development server and restart it:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 6: Test the Semester Planner
1. Go to the "Planner" tab in your application
2. Click "Create New Plan"
3. Fill in the plan details
4. Click "Create Plan"

The plan should now be created successfully and saved to your Supabase database!

## Database Setup
Make sure you've also run the database schema in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL to create all necessary tables

## Troubleshooting

### If you still see "Supabase not configured":
1. Check that your `.env.local` file is in the project root
2. Verify the environment variable names are exactly as shown
3. Restart your development server
4. Check the browser console for detailed error messages

### If you get database errors:
1. Make sure you've run the database schema
2. Check that your Supabase project is active
3. Verify your API keys are correct

## Security Note
- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- Keep your Supabase keys secure and don't share them publicly 