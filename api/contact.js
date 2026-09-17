import emailjs from "@emailjs/nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The email is read by a human, so an optional field left blank must arrive as
// readable text rather than an empty line, "undefined" or "null". French
// because the inbox that receives these enquiries is French-speaking,
// whichever language the visitor used on the site.
const NOT_PROVIDED = "Non précisé";

const orNotProvided = (value) =>
  (typeof value === "string" ? value.trim() : "") || NOT_PROVIDED;

// Runs server-side on Vercel. The EmailJS private key never reaches the
// browser — it's read from a Vercel environment variable (EMAILJS_PRIVATE_KEY,
// no VITE_ prefix, so Vite never bundles it into client code).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Every field the form posts. `budget` and `language` used to be missing
  // from this list, which is why the budget never reached the email: the client
  // sent it correctly, this handler simply never read it and so never passed it
  // on to the EmailJS template.
  const {
    name,
    email,
    phone,
    website,
    projectType,
    budget,
    message,
    language,
    utm,
    kd_ref_field,
  } = req.body || {};

  // Honeypot. The client no longer decides this, so every rejection is
  // recorded here. Logged at warn level because a hit is not necessarily a bot:
  // if a browser ever autofills the hidden field again, this line is the only
  // record that a real enquiry was turned away, and it carries enough to reach
  // that person by hand.
  if (kd_ref_field) {
    console.warn(
      "[contact] HONEYPOT — not sent:",
      JSON.stringify({
        event: "contact_honeypot",
        sent: false,
        honeypotValue: String(kd_ref_field).slice(0, 100),
        name,
        email,
        phone,
      })
    );
    // Still answer as if it worked, so a bot has nothing to adapt to.
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
      "service_prx83vw",
      "template_bbujlih",
      {
        // Required fields are validated above, so they are passed through
        // as-is; every optional one gets the readable fallback.
        name,
        email,
        message,
        phone: orNotProvided(phone),
        website: orNotProvided(website),
        projectType: orNotProvided(projectType),
        budget: orNotProvided(budget),
        language: orNotProvided(language),
        utm: orNotProvided(utm),
        title: "Koda Atlas Inquiry",
      },
      {
        publicKey: "SAbE7J_X_PEmfaP8h",
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
    console.log(
      "[contact] SENT:",
      JSON.stringify({
        event: "contact_sent",
        sent: true,
        email,
        projectType,
        budget,
        language,
        utm,
      })
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      "[contact] SEND FAILED:",
      JSON.stringify({ event: "contact_send_failed", sent: false, email }),
      error
    );
    return res.status(502).json({ error: "Failed to send email" });
  }
}
