/**
 * Simple Node.js backend for sending emails via Resend
 * 
 * Setup Instructions:
 * 1. Create a separate backend folder (or use existing server)
 * 2. Install dependencies: npm install express resend cors dotenv
 * 3. Create this file as backend/routes/sendEmail.js or similar
 * 4. Add RESEND_API_KEY to .env
 * 5. Run the backend server on port 3001
 * 
 * Then update the VITE_API_URL in frontend .env.local to point to backend
 */

const express = require("express");
const { Resend } = require("resend");
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

const getWelcomeEmailHTML = (email, frequency, unsubscribeToken) => {
  const unsubscribeUrl = unsubscribeToken
    ? `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; }
          .header { background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%); color: white; padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { background: #f9fafb; padding: 40px 20px; border-radius: 0 0 12px 12px; }
          .content p { margin: 15px 0; font-size: 15px; }
          .feature { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #7c3aed; border-radius: 4px; }
          .feature strong { color: #7c3aed; }
          .cta { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
          .cta:hover { background: #6d28d9; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          .frequency-badge { display: inline-block; background: #ddd6fe; color: #5b21b6; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px; }
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
            
            <div class="feature">
              ✨ <strong>Curated AI Tools</strong> - Handpicked tools for every workflow
            </div>
            
            <div class="feature">
              📊 <strong>Trending Insights</strong> - What's hot in the AI world this week
            </div>
            
            <div class="feature">
              💡 <strong>Powerful Prompts</strong> - Ready-to-use prompts from our community
            </div>
            
            <div class="feature">
              🚀 <strong>New Discoveries</strong> - Latest AI tools before anyone else
            </div>
            
            <p style="margin-top: 30px;">
              <strong>Your subscription frequency:</strong><br/>
              <span class="frequency-badge">${frequency.toUpperCase()}</span>
            </p>
            
            <p style="margin-top: 30px;">Start exploring now:</p>
            <a href="${process.env.FRONTEND_URL}" class="cta">Explore AI Tools →</a>
            
            <div class="footer">
              <p>You'll receive ${
                frequency === "weekly"
                  ? "weekly"
                  : frequency === "bi-weekly"
                    ? "bi-weekly"
                    : "monthly"
              } updates from AIDiscover.</p>
              ${
                unsubscribeUrl
                  ? `<p><a href="${unsubscribeUrl}" style="color: #7c3aed; text-decoration: none;">Manage preferences</a> • <a href="${unsubscribeUrl}" style="color: #7c3aed; text-decoration: none;">Unsubscribe</a></p>`
                  : ""
              }
              <p style="margin-top: 10px;">© 2026 AIDiscover. Built for the AI era.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// POST /api/send-email
router.post("/send-email", async (req, res) => {
  try {
    const { email, templateType, frequency, unsubscribeToken } = req.body;

    // Validate input
    if (!email || !templateType) {
      return res
        .status(400)
        .json({ success: false, message: "Email and templateType required" });
    }

    let subject = "";
    let html = "";

    if (templateType === "welcome") {
      subject = "🎉 Welcome to AIDiscover Newsletter!";
      html = getWelcomeEmailHTML(email, frequency || "weekly", unsubscribeToken);
    } else if (templateType === "weekly") {
      subject = "📰 This Week's Best AI Tools - AIDiscover";
      html = `<p>Weekly digest coming soon...</p>`;
    } else if (templateType === "confirm-unsubscribe") {
      subject = "Unsubscribed from AIDiscover Newsletter";
      html = `<p>You've been unsubscribed. <a href="${process.env.FRONTEND_URL}">Resubscribe anytime</a></p>`;
    }

    // Send via Resend
    const result = await resend.emails.send({
      from: "AIDiscover <noreply@aidiscover.app>",
      to: email,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${email}:`, result);

    res.json({
      success: true,
      messageId: result.id,
      email,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
});

module.exports = router;

/**
 * Usage in Express server:
 * 
 * const express = require('express');
 * const cors = require('cors');
 * require('dotenv').config();
 * const emailRouter = require('./routes/sendEmail');
 * 
 * const app = express();
 * 
 * app.use(cors());
 * app.use(express.json());
 * app.use('/api', emailRouter);
 * 
 * const PORT = process.env.PORT || 3001;
 * app.listen(PORT, () => console.log(`Email service running on port ${PORT}`));
 */
