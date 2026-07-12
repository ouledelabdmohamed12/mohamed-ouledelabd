import Seo from "../components/Seo";
import LegalSection from "../components/Sections/LegalSection";
import { TERMS_SECTIONS } from "../utils/data";

const TermsPage = () => (
  <>
    <Seo page="terms" path="/terms" />
    <LegalSection i18nKey="terms" sections={TERMS_SECTIONS} />
  </>
);

export default TermsPage;
