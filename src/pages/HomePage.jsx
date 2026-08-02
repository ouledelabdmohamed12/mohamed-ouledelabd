import Seo from "../components/Seo";
import HeroSection from "../components/Sections/HeroSection";
import ProjectsSection from "../components/Sections/ProjectsSection";
import ServicesSection from "../components/Sections/ServicesSection";
import AboutTeaserSection from "../components/Sections/AboutTeaserSection";
import ContactSection from "../components/Sections/ContactSection";
import FaqSection from "../components/Sections/FaqSection";

const HomePage = () => (
  <>
    <Seo page="home" path="/" />
    <HeroSection />
    <ProjectsSection limit={3} />
    <ServicesSection />
    <AboutTeaserSection />
    <ContactSection />
    <FaqSection />
  </>
);

export default HomePage;
