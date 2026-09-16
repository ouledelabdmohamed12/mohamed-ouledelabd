import Seo from "../components/Seo";
import ServicesSection from "../components/Sections/ServicesSection";

const ServicesPage = () => (
  <>
    <Seo page="services" path="/services" />
    {/* Leads the page, so it owns the <h1>. */}
    <ServicesSection lead />
  </>
);

export default ServicesPage;
