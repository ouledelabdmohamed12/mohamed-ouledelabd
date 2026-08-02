import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const FIELD_CLASS =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20";

const CustomSelect = ({ value, handleInpuChange, options, placeholder }) => {
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
        className={`${FIELD_CLASS} flex items-center justify-between gap-3 text-left ${
          isOpen ? "border-indigo-500 bg-white ring-2 ring-indigo-500/20" : ""
        }`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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
            className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-lg p-1.5"
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
                  className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

const TextInput = ({ value, handleInpuChange, textarea, select, options, placeholder, label, optional }) => {
  const { t } = useTranslation();
  const InputComponent = textarea ? "textarea" : "input";

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {optional && (
          <span className="font-normal text-gray-400"> ({t("common.optional")})</span>
        )}
      </label>
      {select ? (
        <CustomSelect
          value={value}
          handleInpuChange={handleInpuChange}
          options={options}
          placeholder={placeholder}
        />
      ) : (
        <InputComponent
          type="text"
          rows={textarea ? 4 : undefined}
          className={FIELD_CLASS}
          value={value}
          onChange={({ target }) => handleInpuChange(target.value)}
        />
      )}
    </div>
  );
};

export default TextInput;
