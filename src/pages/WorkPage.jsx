import Seo from "../components/Seo";
import ProjectsSection from "../components/Sections/ProjectsSection";
import SkillsSection from "../components/Sections/SkillsSection";

const WorkPage = () => (
  <>
    <Seo page="work" path="/work" />
    <ProjectsSection />
    <SkillsSection />
  </>
);

export default WorkPage;
