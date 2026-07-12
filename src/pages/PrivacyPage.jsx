import Seo from "../components/Seo";
import LegalSection from "../components/Sections/LegalSection";
import { PRIVACY_SECTIONS } from "../utils/data";

const PrivacyPage = () => (
  <>
    <Seo page="privacy" path="/privacy" />
    <LegalSection i18nKey="privacy" sections={PRIVACY_SECTIONS} />
  </>
);

export default PrivacyPage;
