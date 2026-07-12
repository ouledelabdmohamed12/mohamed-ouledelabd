import { useTranslation } from "react-i18next";

const TextInput = ({ isDarkMode, value, handleInpuChange, textarea, label, optional }) => {
  const { t } = useTranslation();
  const InputComponent = textarea ? "textarea" : "input";
  return (
    <div className="relative">
      <label
        className={`block text-xs uppercase tracking-widest font-semibold mb-2 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {label}
        {optional && <span className="normal-case font-normal"> ({t("common.optional")})</span>}
      </label>
      <InputComponent
        type="text"
        rows={textarea ? 4 : undefined}
        className={`w-full bg-transparent border-b pb-3 outline-none resize-none transition-colors text-base ${
          isDarkMode
            ? "border-white/15 text-white focus:border-[#2B8CA6]"
            : "border-gray-300 text-gray-900 focus:border-[#2B8CA6]"
        }`}
        value={value}
        onChange={({ target }) => handleInpuChange(target.value)}
      />
    </div>
  );
};

export default TextInput;
