import Seo from "../components/Seo";
import ContactSection from "../components/Sections/ContactSection";

const ContactPage = () => (
  <>
    <Seo page="contact" path="/contact" />
    {/* Leads the page, so it owns the <h1>. */}
    <ContactSection lead />
  </>
);

export default ContactPage;
