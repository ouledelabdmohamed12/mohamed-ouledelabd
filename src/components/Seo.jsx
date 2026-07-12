import { useTranslation } from "react-i18next";
import { useSEO } from "../hooks/useSEO";

const Seo = ({ page, path }) => {
  const { t } = useTranslation();
  useSEO({ title: t(`seo.${page}.title`), description: t(`seo.${page}.description`), path });
  return null;
};

export default Seo;
