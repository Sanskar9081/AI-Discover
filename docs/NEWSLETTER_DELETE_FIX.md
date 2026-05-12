# Newsletter Subscriptions - Supabase Setup

## Quick Fix for Delete Button Not Working

The delete button isn't working because the RLS policies on the `newsletter_subscriptions` table need to allow DELETE operations.

### Step 1: Go to Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**

### Step 2: Create/Fix Newsletter Table with Proper Permissions

**Copy and paste this SQL:**

```sql
-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'bi-weekly', 'monthly', 'never')),
  subscribed_at TIMESTAMP DEFAULT NOW(),
  last_email_sent TIMESTAMP,
  unsubscribe_token TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- DROP existing policies if any
DROP POLICY IF NOT EXISTS "Allow anyone to insert" ON newsletter_subscriptions;
DROP POLICY IF NOT EXISTS "Allow anyone to read" ON newsletter_subscriptions;
DROP POLICY IF NOT EXISTS "Allow anyone to update" ON newsletter_subscriptions;
DROP POLICY IF NOT EXISTS "Allow anyone to delete" ON newsletter_subscriptions;

-- Create RLS Policies for unrestricted access (suitable for learning/demo)
CREATE POLICY "Allow anyone to insert"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to read"
  ON newsletter_subscriptions FOR SELECT
  USING (true);

CREATE POLICY "Allow anyone to update"
  ON newsletter_subscriptions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anyone to delete"
  ON newsletter_subscriptions FOR DELETE
  USING (true);
```

### Step 3: Run the SQL

1. Click the **Run** button (or Ctrl+Enter)
2. You should see: `Success. No rows returned`

### Step 4: Verify Table Structure

Go to **Tables → newsletter_subscriptions** and verify columns exist with correct types.

### Step 5: Test Delete

1. Go back to your admin panel
2. Hard refresh (Ctrl+Shift+R)
3. Try clicking the delete (trash) button for an inactive subscriber

---

## What This Does

- **Creates table** with all required fields
- **Enables RLS** for security
- **Adds policies** that allow INSERT, SELECT, UPDATE, DELETE for all users
- **Creates index** for fast email lookups

---

## For Production (More Secure RLS)

Replace the policies above with:

```sql
-- Only authenticated users can manage subscriptions
CREATE POLICY "Authenticated users can view"
  ON newsletter_subscriptions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
  ON newsletter_subscriptions FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete"
  ON newsletter_subscriptions FOR DELETE
  USING (auth.role() = 'authenticated');

-- Anyone can subscribe
CREATE POLICY "Anyone can insert"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);
```

---

## If Still Not Working

1. **Check Table Exists**
   - Go to **Tables** in left sidebar
   - Look for `newsletter_subscriptions`

2. **Check RLS Status**
   - Click the table name
   - Look for **RLS Enabled** switch (should be ON)

3. **Check Policies**
   - Click table name  
   - Go to **RLS Policies** tab
   - Should see 4 policies (Insert, Select, Update, Delete)

4. **Check Errors in Console**
   - Open browser DevTools (F12)
   - Try delete again
   - Look for red error messages

5. **If Still Failing**
   - Copy the error message
   - Check that the email in your table matches exactly

---

## After Setup

The delete button should now:
1. Show confirmation dialog
2. Delete the subscriber record
3. Remove from table instantly

✅ All done!
