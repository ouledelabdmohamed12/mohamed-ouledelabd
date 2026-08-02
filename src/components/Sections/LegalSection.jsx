import { useTranslation } from "react-i18next";

const LegalSection = ({ i18nKey, sections }) => {
  const { t } = useTranslation();

  return (
    <section className="bg-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          {t(`legal.${i18nKey}.updated`)}
        </span>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-12">
          {t(`legal.${i18nKey}.title`)}
        </h1>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
            >
              <h2 className="flex items-baseline gap-3 text-lg font-semibold text-gray-900 mb-3">
                <span className="text-sm font-semibold text-indigo-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {t(`legal.${i18nKey}.sections.${section.id}.title`)}
              </h2>
              <p className="text-[15px] leading-relaxed text-gray-500">
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
