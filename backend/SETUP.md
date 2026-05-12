👋 QUICK START - EMAIL SERVICE

🎯 Goal: Get thank you emails working

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Get Free Resend API Key
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open: https://resend.com
2. Sign up (takes 2 minutes, free!)
3. Click "API Keys" in left sidebar
4. Copy your API key (looks like: re_xxxxxxxxxxxxx)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 2: Add API Key to Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Open: backend/.env

Replace:
    RESEND_API_KEY=re_your_api_key_here

With your actual key:
    RESEND_API_KEY=re_xxxxxxxxxxxxx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 3: Run Backend Service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In terminal/PowerShell:

    cd backend
    npm start

You should see:
    ✅ AIDiscover Email Service Running!
    📍 Server: http://localhost:3001

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 4: Frontend is Already Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your frontend already has:
✅ Newsletter signup forms
✅ Email sending code
✅ Correct API endpoint configured

Just keep running: npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 5: Also Need Supabase Table
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to: https://app.supabase.com
→ SQL Editor
→ Create new query

Paste:
────────────────────────────────────
DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;

CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  frequency TEXT DEFAULT 'weekly',
  subscribed_at TIMESTAMP DEFAULT NOW(),
  last_email_sent TIMESTAMP,
  unsubscribe_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON newsletter_subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON newsletter_subscriptions FOR UPDATE USING (true);
────────────────────────────────────

Click "Run" → Done!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOW TEST IT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Keep backend running
2. Open: http://localhost:8082
3. Scroll to Newsletter section
4. Enter YOUR email
5. Select frequency (weekly/etc)
6. Click "Subscribe"
7. Check your email inbox!

You should get a beautiful thank you email! 📧

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TROUBLESHOOTING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ No email received?

1. Check backend console for errors
   Should show: ✅ Email sent successfully!

2. Check spam/junk folder

3. Verify API key is correct in backend/.env

4. Make sure http://localhost:3001/health returns {"status":"ok"}

5. Check Resend dashboard: https://resend.com/emails

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRODUCTION DEPLOYMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When ready to deploy:

1. Deploy backend to:
   - Vercel
   - Railway
   - Render
   - Heroku

2. Update frontend VITE_API_URL:
   VITE_API_URL=https://your-deployed-backend.com

3. Use production Resend API key

4. All set! 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
