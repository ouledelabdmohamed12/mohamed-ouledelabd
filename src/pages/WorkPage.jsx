import Seo from "../components/Seo";
import ProjectsSection from "../components/Sections/ProjectsSection";

// SkillsSection deliberately lives only on /about — it used to render here too,
// which repeated the exact same block on two pages.
const WorkPage = () => (
  <>
    <Seo page="work" path="/work" />
    <ProjectsSection />
  </>
);

export default WorkPage;
