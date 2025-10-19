# Complete Implementation Guide: Multi-User Storybook App
**Estimated Time: 1.5-2 hours**

---

## 📋 Phase 1: Supabase Setup (15 minutes)

### Step 1.1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project:
   - Project name: `storybook-app`
   - Database password: (choose a strong password - save it!) 1989Bala$
   - Region: Choose closest to you
5. Wait 2-3 minutes for project to initialize

### Step 1.2: Create Database Schema
1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy and paste this entire SQL script:

```sql
-- Create stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  book_data JSONB NOT NULL,
  last_modified_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "users_view_own_stories" 
  ON stories FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_stories" 
  ON stories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_stories" 
  ON stories FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own_stories" 
  ON stories FOR DELETE 
  USING (auth.uid() = user_id);
```

4. Click "Run" button
5. You should see "Success. No rows returned"

### Step 1.3: Create Test Users
1. In Supabase dashboard, click "Authentication" → "Users"
2. Click "Add user" → "Create new user"
3. Create 3 users:
   - Email: `user1@test.com`, Password: `password123`
   - Email: `user2@test.com`, Password: `password123`
   - Email: `user3@test.com`, Password: `password123`

### Step 1.4: Get API Keys
1. Click "Project Settings" (gear icon in left sidebar)
2. Click "API" in the settings menu
3. Copy these values (you'll need them):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   
   https://wxuthiosavshogzimyta.supabase.co
   
   - **anon public** key (under "Project API keys")
   
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dXRoaW9zYXZzaG9nemlteXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzUwMTIsImV4cCI6MjA3NjMxMTAxMn0.9AMeX2pRV-zEbrw9WnoWo9jtntw2DF9oy7w4XU6KziY

---

## 📦 Phase 2: Install Packages (5 minutes)

Open terminal in your project directory and run:

```bash
cd /home/ubuntu/repos/UntoldStoriesIpadApp
npm install @supabase/supabase-js idb
```

---

## 📝 Phase 3: Create Environment Variables (2 minutes)

Create file: `.env.local` in project root

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values from Step 1.4

---

## 💻 Phase 4: Create New Files (30 minutes)

I'll provide the exact code for each file below. Copy the entire content for each file.

### File 1: `src/lib/supabase.ts`
### File 2: `src/lib/localDB.ts`
### File 3: `src/contexts/AuthContext.tsx`
### File 4: `src/pages/Login.tsx`
### File 5: `src/pages/Dashboard.tsx`
### File 6: `src/components/ProtectedRoute.tsx`

(Code for each file will be provided separately)

---

## 🔧 Phase 5: Modify Existing Files (20 minutes)

### Modify 1: `src/App.tsx`
### Modify 2: `src/CreateStory.tsx`
### Modify 3: `src/main.tsx`

(Instructions for each modification will be provided)

---

## ✅ Phase 6: Testing (10 minutes)

1. Start dev server: `npm run dev`
2. Open http://localhost:5173
3. Test login with user1@test.com / password123
4. Create a new story
5. Edit and save to cloud
6. Logout and login again - verify story persists

---

## 🐛 Common Issues & Fixes

**Issue 1:** "Error: supabaseUrl is required"
- Fix: Check `.env.local` file exists and has correct values

**Issue 2:** Login fails with "Invalid credentials"
- Fix: Verify test users were created in Supabase dashboard

**Issue 3:** Stories don't load
- Fix: Check browser console for errors, verify RLS policies are enabled

---

## 📞 Support

If you get stuck:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Report the error message and I'll help debug

---

Now I'll provide the actual code files...
