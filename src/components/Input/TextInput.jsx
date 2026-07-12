import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const CustomSelect = ({ isDarkMode, value, handleInpuChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 bg-transparent border-b pb-3 outline-none transition-colors text-base text-left ${
          isDarkMode ? "border-white/15 text-white" : "border-gray-300 text-gray-900"
        } ${isOpen ? "border-[#2B8CA6]" : ""}`}
      >
        <span className={selected ? "" : isDarkMode ? "text-gray-500" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border shadow-xl ${
              isDarkMode ? "bg-[#111418] border-white/10" : "bg-white border-gray-200"
            }`}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    handleInpuChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-left transition-colors ${
                    isSelected
                      ? "text-[#2B8CA6] font-semibold"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-white/5"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                  {isSelected && <Check size={15} className="flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TextInput = ({ isDarkMode, value, handleInpuChange, textarea, select, options, placeholder, label, optional }) => {
  const { t } = useTranslation();
  const InputComponent = textarea ? "textarea" : "input";
  const fieldClass = `w-full bg-transparent border-b pb-3 outline-none resize-none transition-colors text-base ${
    isDarkMode
      ? "border-white/15 text-white focus:border-[#2B8CA6]"
      : "border-gray-300 text-gray-900 focus:border-[#2B8CA6]"
  }`;

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
      {select ? (
        <CustomSelect
          isDarkMode={isDarkMode}
          value={value}
          handleInpuChange={handleInpuChange}
          options={options}
          placeholder={placeholder}
        />
      ) : (
        <InputComponent
          type="text"
          rows={textarea ? 4 : undefined}
          className={fieldClass}
          value={value}
          onChange={({ target }) => handleInpuChange(target.value)}
        />
      )}
    </div>
  );
};

export default TextInput;
