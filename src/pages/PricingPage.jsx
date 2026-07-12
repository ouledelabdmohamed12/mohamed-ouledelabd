import Seo from "../components/Seo";
import ProcessSection from "../components/Sections/ProcessSection";
import PricingSection from "../components/Sections/PricingSection";
import FaqSection from "../components/Sections/FaqSection";

const PricingPage = () => (
  <>
    <Seo page="pricing" path="/pricing" />
    <ProcessSection />
    <PricingSection />
    <FaqSection />
  </>
);

export default PricingPage;
