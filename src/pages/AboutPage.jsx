import Seo from "../components/Seo";
import AboutSection from "../components/Sections/AboutSection";
import SkillsSection from "../components/Sections/SkillsSection";

const AboutPage = () => (
  <>
    <Seo page="about" path="/about" />
    <AboutSection />
    <SkillsSection />
  </>
);

export default AboutPage;
