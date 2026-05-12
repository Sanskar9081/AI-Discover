# Google OAuth Setup Guide

## What's New

You can now sign in or register using Google! The "Sign in with Google" button appears on both login and register tabs in the auth modal.

## Setup Steps

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a **new project** (or use existing):
   - Name: "AIDiscover" (or your preference)
   - Click **Create**
3. Once created, go to **APIs & Services → Credentials**
4. Click **+ Create Credentials → OAuth client ID**
5. Choose **Web application**
6. Name it: "AIDiscover OAuth"
7. Add Authorized redirect URIs:
   ```
   http://localhost:8080/
   http://localhost:3000/
   https://your-production-domain.com/
   ```
8. Click **Create**
9. Copy the **Client ID** (you'll need it)
10. Click **Copy** next to "Client secret" and save it

### Step 2: Configure Supabase with Google OAuth

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication → Providers**
4. Find **Google** and click it
5. **Enable the provider**
6. Paste your **Google Client ID** into the "Client ID" field
7. Paste your **Google Client secret** into the "Client secret" field
8. Click **Save**

### Step 3: Add Redirect URLs in Supabase

1. Still in **Authentication → URL Configuration**
2. Add your redirect URLs:
   ```
   http://localhost:8080/
   http://localhost:3000/
   https://your-production-domain.com/
   ```
3. Click **Save**

### Step 4: Test Google Sign In

1. Refresh your app: `http://localhost:8080`
2. Click **Login** or **Register** button
3. You should see **"Sign in with Google"** button
4. Click it and follow the Google sign-in flow
5. You'll be redirected back and logged in! ✅

---

## How It Works Behind the Scenes

1. **User clicks** "Sign in with Google"
2. **Supabase** redirects to Google's OAuth consent screen
3. **Google** asks user to sign in and grant permissions
4. **Google** redirects back to your app with an auth token
5. **Supabase** creates/updates the user profile
6. **Your app** automatically logs in the user
7. **User data** synced from Google (name, email, avatar)

---

## User Profile Auto-Population

When users sign in with Google, these fields are automatically populated:

| Field | Source |
|-------|--------|
| **Email** | Google account email |
| **Name** | Google account name (full_name) |
| **Avatar** | Google profile picture URL |
| **Mobile** | Empty (users can add it later) |

---

## Troubleshooting

### "Redirect URL mismatch" Error

**Problem**: Error says approved redirect URL doesn't match

**Solution**:
1. Check the URL in error message
2. Add that exact URL to both:
   - Google Cloud Console → OAuth redirect URIs
   - Supabase → URL Configuration
3. Make sure protocol matches (http:// vs https://)

### No Google Button Appears

**Problem**: "Sign in with Google" button not showing

**Solution**:
1. Hard refresh browser: `Ctrl+Shift+R`
2. Check browser console (F12) for errors
3. Verify Google provider is **enabled** in Supabase
4. Make sure Client ID and Secret are entered in Supabase

### User Not Logged In After Google Sign-In

**Problem**: Redirected but not authenticated

**Solution**:
1. Check redirect URL matches between:
   - Google Console
   - Supabase URL Configuration
   - Your app's actual URL
2. Open browser console and look for errors
3. Try a different Google account if testing

### "Invalid Client ID" Error

**Problem**: Google says client ID is invalid

**Solution**:
1. Copy Client ID exactly from Google Console (no extra spaces)
2. Paste into Supabase without modification
3. Verify in Google Console it's for "Web application" type
4. If created multiple times, delete old ones and use most recent

---

## For Production

When deploying to production:

1. **Get Production Domain**
   - Example: `https://aidiscover.app`

2. **Update Google Console OAuth URIs**
   ```
   https://aidiscover.app/
   https://www.aidiscover.app/
   ```

3. **Update Supabase URL Configuration**
   ```
   https://aidiscover.app/
   https://www.aidiscover.app/
   ```

4. **Enable HTTPS**
   - Google OAuth requires HTTPS in production
   - Use SSL certificate (free via Let's Encrypt)

---

## Optional: Customize OAuth Scopes

By default, we ask for `profile` and `email` scopes.

To add more scopes, edit `src/contexts/AppContext.tsx`:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`,
    scopes: 'profile email openid', // Add more if needed
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
});
```

---

## Testing Checklist

- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URLs configured in both Google Console and Supabase
- [ ] "Sign in with Google" button visible
- [ ] Can click button and see Google sign-in screen
- [ ] After signing in, redirected back to app
- [ ] User email and name show in profile
- [ ] User stays logged in after refresh

---

## After Setup

Once configured, all these work automatically:

✅ Sign in with Google  
✅ Register with Google  
✅ Auto-create user profile from Google data  
✅ Sync across all devices  
✅ One-click authentication  

Enjoy! 🎉
