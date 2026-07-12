import {
    motion,
    AnimatePresence,
} from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SuccessModel = ({showSuccess, setShowSuccess, isDarkMode}) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
        {showSuccess && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                onClick={() => setShowSuccess(false)}
            >
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 16 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 16 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
                    className={`relative p-10 rounded-3xl max-w-sm w-full text-center border shadow-2xl ${
                        isDarkMode
                            ? 'bg-[#0a0c10] border-white/10'
                            : 'bg-white border-gray-100'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setShowSuccess(false)}
                        className={`absolute top-5 right-5 p-1.5 rounded-full transition-colors cursor-pointer ${
                            isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <X size={16} />
                    </button>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.15 }}
                        className="relative mx-auto w-16 h-16 flex items-center justify-center mb-7"
                    >
                        <span className="absolute inset-0 rounded-full bg-[#2B8CA6]/15 animate-ping" />
                        <span className="relative w-16 h-16 rounded-full bg-[#2B8CA6] flex items-center justify-center">
                            <Check size={28} strokeWidth={2.75} className="text-white" />
                        </span>
                    </motion.div>

                    <motion.h3
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-2xl font-semibold tracking-tight mb-3"
                    >
                        {t("contact.success.title")}
                    </motion.h3>

                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className={`leading-relaxed mb-8 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        {t("contact.success.text")}
                    </motion.p>

                    <motion.button
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowSuccess(false)}
                        className="w-full bg-[#2B8CA6] hover:bg-[#217485] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
                    >
                        {t("contact.success.close")}
                    </motion.button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default SuccessModel;