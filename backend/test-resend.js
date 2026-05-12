// Quick test to verify Resend API key works
require("dotenv").config({ path: __dirname + "/.env" });
const { Resend } = require("resend");

const apiKey = process.env.RESEND_API_KEY;
console.log("🔑 API Key loaded:", apiKey ? "✅ Yes" : "❌ No");

if (!apiKey) {
  console.error("❌ RESEND_API_KEY not found in .env");
  process.exit(1);
}

const resend = new Resend(apiKey);

(async () => {
  try {
    console.log("\n📧 Testing Resend API...");
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "delivered@resend.dev", // Resend test email
      subject: "Test Email from AIDiscover",
      html: "<p>This is a test email to verify Resend is working.</p>",
    });

    console.log("\n✅ Success!");
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Error:");
    console.error("Message:", error.message);
    console.error("Full Error:", JSON.stringify(error, null, 2));
  }
})();
