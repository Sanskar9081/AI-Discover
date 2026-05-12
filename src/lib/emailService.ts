// Email Service - Sends thank you emails to newsletter subscribers
// This calls a backend API endpoint that uses Resend to send emails

export interface SendEmailParams {
  email: string;
  templateType: "welcome" | "weekly" | "confirm-unsubscribe";
  frequency?: string;
  unsubscribeToken?: string;
}

// Send thank you email via backend API
export const sendWelcomeEmail = async (
  email: string,
  frequency: string,
  unsubscribeToken?: string
) => {
  try {
    // Try to call backend API endpoint
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    const response = await fetch(`${apiUrl}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateType: "welcome",
        email,
        frequency,
        unsubscribeToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn("⚠️ Email service unavailable (backend not running):", error.message);
      return { success: false, error: error.message, offline: true };
    }

    const data = await response.json();
    console.log("✅ Welcome email sent:", data);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.warn(
      "⚠️ Email service offline (backend not configured):",
      String(error)
    );
    // Don't throw - let subscription succeed even if email fails
    return { success: false, error: String(error), offline: true };
  }
};

// Welcome Email Template
export const getWelcomeEmailTemplate = (
  email: string,
  frequency: string,
  unsubscribeToken?: string
) => {
  const unsubscribeUrl = unsubscribeToken
    ? `https://aidiscover.app/unsubscribe?token=${unsubscribeToken}`
    : "";

  return {
    subject: "🎉 Welcome to AIDiscover Newsletter!",
    html: `
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
              <a href="https://aidiscover.app" class="cta">Explore AI Tools →</a>
              
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
    `,
  };
};
