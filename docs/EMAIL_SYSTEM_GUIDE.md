# Email System Setup Guide

## How the Email System Works

### 🏗️ Architecture

```
Frontend (React)
    ↓
  [User subscribes]
    ↓
[Save to Supabase DB]
    ↓
[Call sendWelcomeEmail()]
    ↓
Backend API (Node.js)
    ↓
[Call Resend API]
    ↓
📧 Send Thank You Email
```

### Current Flow

1. **Subscription** → User enters email and chooses frequency (weekly/bi-weekly/monthly)
2. **Database Save** → Email + frequency stored in `newsletter_subscriptions` table
3. **Email Trigger** → Automatically attempts to send welcome email
4. **Thank You Email** → Personalized welcome message with subscription details

---

## Setup Instructions

### Step 1: Get Resend API Key (Free)

1. Go to [Resend.com](https://resend.com)
2. Sign up (free tier available)
3. Go to API Keys section
4. Copy your API key
5. Add to `.env` file:

```bash
VITE_RESEND_API_KEY=re_your_api_key_here
```

### Step 2: Create Backend Service

The backend can be created with Express (Node.js). We've provided the code in `docs/BACKEND_EMAIL_SERVICE.js`.

**Option A: Quick Setup (Local Testing)**

Create a new folder for backend:

```bash
mkdir backend
cd backend
npm init -y
npm install express resend cors dotenv
```

Create `server.js`:

```javascript
const express = require("express");
const { Resend } = require("resend");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/send-email", async (req, res) => {
  try {
    const { email, templateType, frequency, unsubscribeToken } = req.body;

    if (!email || !templateType) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and templateType required" 
      });
    }

    let subject = "";
    let html = "";

    if (templateType === "welcome") {
      subject = "🎉 Welcome to AIDiscover Newsletter!";
      html = getWelcomeHTML(email, frequency, unsubscribeToken);
    }

    const result = await resend.emails.send({
      from: "AIDiscover <noreply@aidiscover.app>",
      to: email,
      subject,
      html,
    });

    res.json({
      success: true,
      messageId: result.id,
      email,
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
});

function getWelcomeHTML(email, frequency, unsubscribeToken) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%); color: white; padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 40px 20px; border-radius: 0 0 12px 12px; }
          .feature { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #7c3aed; border-radius: 4px; }
          .cta { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Thank You for Subscribing!</h1>
            <p>Welcome to AIDiscover Newsletter</p>
          </div>
          <div class="content">
            <p>Hi there! 👋</p>
            <p>Thanks for joining our community of AI enthusiasts! We're thrilled to have you on board.</p>
            <p><strong>Here's what you'll get:</strong></p>
            <div class="feature">✨ <strong>Curated AI Tools</strong> - Handpicked tools for every workflow</div>
            <div class="feature">📊 <strong>Trending Insights</strong> - What's hot in the AI world</div>
            <div class="feature">💡 <strong>Powerful Prompts</strong> - Ready-to-use prompts</div>
            <div class="feature">🚀 <strong>New Discoveries</strong> - Latest AI tools</div>
            <p>Your frequency: <strong>${frequency.toUpperCase()}</strong></p>
            <a href="https://aidiscover.app" class="cta">Explore AI Tools →</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

app.listen(3001, () => {
  console.log("✅ Email service running on http://localhost:3001");
});
```

Create `.env`:

```
RESEND_API_KEY=re_your_api_key_here
FRONTEND_URL=http://localhost:8082
PORT=3001
```

Run backend:

```bash
node server.js
```

---

### Step 3: Frontend Configuration

Frontend already has email calls built in. Just ensure `.env.local` has:

```
VITE_API_URL=http://localhost:3001
VITE_RESEND_API_KEY=re_your_api_key_here
```

---

## Email Template

The welcome email includes:

- ✅ Personalized greeting
- ✅ Features of the newsletter
- ✅ Subscription frequency badge
- ✅ Call to action button
- ✅ Unsubscribe link (when token available)
- ✅ Beautiful gradient design

---

## Admin Features

### View Subscribers

1. Go to Admin Panel → **Newsletter** tab
2. See all subscribers with:
   - Email address
   - Subscription frequency
   - Subscription date
   - Last email sent date
   - Status (Active/Inactive)

### Manage Frequency

- Click dropdown to change subscriber's email frequency
- Options: Weekly, Bi-weekly, Monthly, Never

### Unsubscribe Users

- Click "X" icon to unsubscribe (marks as inactive)
- Click "Trash" icon to permanently delete

### Statistics

- Total active subscribers
- Breakdown by frequency (Weekly, Bi-weekly, Monthly)

---

## Testing

### Without Backend (Demo Mode)

1. Subscribe on homepage/footer
2. See "Subscribed!" message
3. Check Supabase to confirm entry in `newsletter_subscriptions` table
4. Console will show "Email service offline" warning (expected)

### With Backend (Production Ready)

1. Start backend: `npm run dev` (in backend folder)
2. Frontend Dev: `npm run dev` (port 8082)
3. Subscribe on homepage/footer
4. Successfully subscribed to Supabase
5. Welcome email sent via Resend
6. Email delivered to inbox instantly

---

## Email Sending Services

### Resend (Recommended)  
- Free tier: 100 emails/day
- $20/month for unlimited
- Built for developers
- Great docs

### Alternatives

- **SendGrid**: Free 100/month tier
- **Mailgun**: Free 5000/month tier  
- **SMTP**: Use custom email server
- **AWS SES**: Pay-as-you-go

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Email service offline" | Backend not running on port 3001 |
| 401 Unauthorized from Resend | Invalid API key in `.env` |
| CORS errors | Frontend/backend on different ports - check CORS config |
| Emails not arriving | Check spam folder, verify domain in Resend |
| Subscription succeeds but no email | Backend may be down - check console logs |

---

## Environment Variables

```bash
# Frontend (.env.local)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RESEND_API_KEY=re_your_resend_key
VITE_API_URL=http://localhost:3001

# Backend (.env)
RESEND_API_KEY=re_your_resend_key
FRONTEND_URL=http://localhost:8082
PORT=3001
```

---

## Workflow Summary

```
👤 User Action
├─ 📧 Enters email
├─ ⏱️ Chooses frequency
└─ ✅ Clicks Subscribe

💾 Database Layer
├─ 🗄️ Saves to Supabase
├─ 🔄 Updates if duplicate
└─ ✅ Stores unsubscribe token

📬 Email Layer
├─ 🔗 Calls backend API
├─ 📨 Resend sends email
└─ ✅ Instant delivery

📊 Admin View
├─ 👀 See all subscribers
├─ ⚙️ Manage frequency
└─ 🗑️ Remove users
```

---

## Future Enhancements

- [ ] Weekly digest email with trending tools
- [ ] Custom email templates per use case
- [ ] Unsubscribe link handling
- [ ] Email read tracking
- [ ] A/B testing for subject lines
- [ ] Scheduled email campaigns
- [ ] Automatic re-engagement emails

---

## Important Notes

⚠️ **Email Sending is Optional**

- Subscriptions work **without** backend/email
- Users still saved to database
- Email sending fails gracefully
- Admin can still manage subscribers

✅ **Production Deployment**

- Deploy backend to Heroku, Railway, or AWS
- Update `VITE_API_URL` to production URL
- Use production Resend API key
- Set up proper CORS headers

📝 **GDPR Compliance**

- Include unsubscribe link in every email
- Store consent timestamps
- Implement data deletion (GDPR right to be forgotten)
- Use Resend's built-in compliance

---

Need help? Check the backend email service code in `docs/BACKEND_EMAIL_SERVICE.js`
