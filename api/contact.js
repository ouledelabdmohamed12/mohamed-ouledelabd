import emailjs from "@emailjs/nodejs";

// Runs server-side on Vercel. The EmailJS private key never reaches the
// browser — it's read from a Vercel environment variable (EMAILJS_PRIVATE_KEY,
// no VITE_ prefix, so Vite never bundles it into client code).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, website, message, title } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await emailjs.send(
      "service_gq5hc6f",
      "template_bbujlih",
      { name, email, phone, website, message, title },
      {
        publicKey: "SAbE7J_X_PEmfaP8h",
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EmailJS send failed:", error);
    // TEMP: surface the underlying error to diagnose the 502 in production.
    return res.status(502).json({
      error: "Failed to send email",
      detail: error?.text || error?.message || String(error),
    });
  }
}
