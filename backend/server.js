/**
 * AIDiscover Email Service Backend
 * Sends welcome emails via Resend
 * 
 * Setup:
 * 1. npm install express resend cors dotenv
 * 2. Create .env with RESEND_API_KEY
 * 3. node server.js
 */

const express = require("express");
const { Resend } = require("resend");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Welcome email HTML template
function getWelcomeEmailHTML(frequency) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f5f5f5;
          }
          .wrapper { background: #f5f5f5; padding: 20px; }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%); 
            color: white; 
            padding: 50px 20px; 
            text-align: center;
          }
          .header h1 { 
            font-size: 32px; 
            margin-bottom: 10px;
            font-weight: 700;
          }
          .header p { 
            font-size: 16px;
            opacity: 0.95;
          }
          .content { 
            padding: 40px 30px; 
          }
          .content p { 
            margin: 15px 0; 
            font-size: 15px;
            color: #555;
          }
          .content strong { color: #333; }
          .features { margin: 30px 0; }
          .feature { 
            margin: 16px 0; 
            padding: 16px; 
            background: #f9fafb; 
            border-left: 4px solid #7c3aed; 
            border-radius: 4px;
            font-size: 14px;
          }
          .feature strong { color: #7c3aed; }
          .badge {
            display: inline-block;
            background: #ddd6fe;
            color: #5b21b6;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            margin-top: 5px;
          }
          .cta-section {
            margin: 30px 0;
            text-align: center;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 32px;
            background: #7c3aed;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            transition: background 0.2s;
          }
          .cta-button:hover { background: #6d28d9; }
          .divider { 
            margin: 30px 0; 
            border: 0;
            border-top: 1px solid #e5e7eb;
          }
          .footer { 
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          .footer a { color: #7c3aed; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          .footer p { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>🎉 Welcome!</h1>
              <p>Thanks for joining AIDiscover</p>
            </div>

            <!-- Content -->
            <div class="content">
              <p>Hi there! 👋</p>
              
              <p>Thank you so much for subscribing to the <strong>AIDiscover Newsletter</strong>! We're thrilled to have you join our community of AI enthusiasts.</p>
              
              <p><strong>Here's what you'll receive:</strong></p>
              
              <div class="features">
                <div class="feature">
                  <strong>✨ Curated AI Tools</strong><br/>
                  Handpicked tools for every workflow, vetted by our community
                </div>
                
                <div class="feature">
                  <strong>📊 Trending Insights</strong><br/>
                  What's hot in the AI world this week and why it matters
                </div>
                
                <div class="feature">
                  <strong>💡 Powerful Prompts</strong><br/>
                  Ready-to-use prompts from our community for immediate use
                </div>
                
                <div class="feature">
                  <strong>🚀 New Discoveries</strong><br/>
                  Latest AI tools before anyone else discovers them
                </div>
              </div>

              <p style="margin-top: 30px;">
                <strong>Your Subscription Frequency:</strong><br/>
                <span class="badge">${frequency.toUpperCase()}</span>
              </p>

              <div class="cta-section">
                <p>Start exploring the best AI tools today:</p>
                <a href="https://aidiscover.app" class="cta-button">Explore Tools →</a>
              </div>

              <hr class="divider">

              <p style="font-size: 13px; color: #6b7280;">
                You'll receive ${
                  frequency === "weekly"
                    ? "one"
                    : frequency === "bi-weekly"
                      ? "two"
                      : "one"
                } email${frequency === "monthly" ? "" : "(s)"} per ${
                frequency === "weekly"
                  ? "week"
                  : frequency === "bi-weekly"
                    ? "two weeks"
                    : "month"
                } with fresh insights, tools, and prompts.
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>
                <a href="https://aidiscover.app/unsubscribe">Unsubscribe</a> • 
                <a href="https://aidiscover.app">Visit AIDiscover</a> • 
                <a href="https://aidiscover.app/contact">Contact Us</a>
              </p>
              <p style="margin-top: 16px; color: #9ca3af;">
                © 2026 AIDiscover. Built for the AI era.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Email service is running",
    resendConfigured: !!process.env.RESEND_API_KEY
  });
});

// Main email sending endpoint
app.post("/api/send-email", async (req, res) => {
  try {
    const { email, templateType, frequency, unsubscribeToken } = req.body;

    console.log(`📧 Email request received:`);
    console.log(`   - Email: ${email}`);
    console.log(`   - Template: ${templateType}`);
    console.log(`   - Frequency: ${frequency}`);

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    if (!templateType) {
      return res.status(400).json({
        success: false,
        message: "Template type is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not configured in .env");
      return res.status(500).json({
        success: false,
        message: "Email service not configured - RESEND_API_KEY missing",
      });
    }

    let subject = "";
    let html = "";

    if (templateType === "welcome") {
      subject = "🎉 Welcome to AIDiscover Newsletter!";
      html = getWelcomeEmailHTML(frequency || "weekly");
    } else if (templateType === "weekly") {
      subject = "📰 This Week's Best AI Tools - AIDiscover";
      html = `<p>Weekly digest here</p>`;
    } else if (templateType === "confirm-unsubscribe") {
      subject = "Unsubscribed from AIDiscover";
      html = `<p>You've been unsubscribed.</p>`;
    } else {
      return res.status(400).json({
        success: false,
        message: `Unknown template type: ${templateType}`,
      });
    }

    console.log(`🚀 Sending email via Resend...`);

    // Send email via Resend
    // Using Resend's default domain (onboarding@resend.dev) for verified sending
    // For production, verify your custom domain (aidiscover.app) in Resend dashboard
    const result = await resend.emails.send({
      from: "AIDiscover <onboarding@resend.dev>",
      to: email,
      subject: subject,
      html: html,
    });

    if (result.error) {
      console.error("❌ Resend API error:", result.error);
      return res.status(500).json({
        success: false,
        message: `Resend error: ${result.error.message}`,
        error: result.error,
      });
    }

    console.log(`✅ Email sent successfully!`);
    console.log(`   - Message ID: ${result.data?.id}`);
    console.log(`   - To: ${email}`);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: result.data?.id,
      email: email,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
      error: error.toString(),
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ AIDiscover Email Service Running!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`📧 Email Endpoint: POST http://localhost:${PORT}/api/send-email`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n⚠️  WARNING: RESEND_API_KEY not found in .env`);
    console.log(`   Add your key: RESEND_API_KEY=re_xxxxx`);
  } else {
    console.log(`\n✅ Resend API Key configured`);
  }
  console.log(`\n📝 To test: curl -X POST http://localhost:${PORT}/api/send-email \\`);
  console.log(`   -H "Content-Type: application/json" \\`);
  console.log(`   -d '{"email":"test@example.com","templateType":"welcome","frequency":"weekly"}'\n`);
});
