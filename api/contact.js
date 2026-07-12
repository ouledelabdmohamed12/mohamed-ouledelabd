import emailjs from "@emailjs/nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Runs server-side on Vercel. The EmailJS private key never reaches the
// browser — it's read from a Vercel environment variable (EMAILJS_PRIVATE_KEY,
// no VITE_ prefix, so Vite never bundles it into client code).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, website, projectType, message, company } = req.body || {};

  // Honeypot: bots that bypass the client JS and post directly still get
  // caught here. Pretend success so they don't adapt.
  if (company) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    await emailjs.send(
      "service_gq5hc6f",
      "template_bbujlih",
      { name, email, phone, website, projectType, message, title: "Koda Atlas Inquiry" },
      {
        publicKey: "SAbE7J_X_PEmfaP8h",
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EmailJS send failed:", error);
    return res.status(502).json({ error: "Failed to send email" });
  }
}
