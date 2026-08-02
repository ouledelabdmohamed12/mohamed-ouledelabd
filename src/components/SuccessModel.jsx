import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SuccessModel = ({ showSuccess, setShowSuccess }) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setShowSuccess(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
              className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.12 }}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50"
            >
              <Check size={26} strokeWidth={2.5} className="text-indigo-600" />
            </motion.div>

            <motion.h3
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold tracking-tight text-gray-900 mb-2"
            >
              {t("contact.success.title")}
            </motion.h3>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[15px] leading-relaxed text-gray-500 mb-7"
            >
              {t("contact.success.text")}
            </motion.p>

            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowSuccess(false)}
              className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-colors cursor-pointer"
            >
              {t("contact.success.close")}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModel;
