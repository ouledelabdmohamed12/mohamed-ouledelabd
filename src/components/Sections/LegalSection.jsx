import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

const LegalSection = ({ i18nKey, sections }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <section
      className={`py-32 px-6 min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className={`text-xs uppercase tracking-[0.4em] font-semibold mb-4 ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {t(`legal.${i18nKey}.updated`)}
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-14">
          {t(`legal.${i18nKey}.title`)}
        </h1>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={section.id}>
              <h2 className="text-xl font-semibold tracking-tight mb-3 flex items-baseline gap-3">
                <span className="text-[#2B8CA6]">{String(index + 1).padStart(2, "0")}</span>
                {t(`legal.${i18nKey}.sections.${section.id}.title`)}
              </h2>
              <p
                className={`text-base font-light leading-relaxed ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t(`legal.${i18nKey}.sections.${section.id}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegalSection;
