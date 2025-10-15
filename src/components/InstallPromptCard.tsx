import { motion, AnimatePresence } from 'framer-motion';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Download, X } from 'lucide-react';
import logo from '@/assets/logo-clinlix.png';

export default function InstallPromptCard() {
  const { showPrompt, installApp, dismissPrompt } = useInstallPrompt();

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl p-4 shadow-2xl z-50 border border-gray-100"
        >
          <button
            onClick={dismissPrompt}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-3 mb-4">
            <img
              src={logo}
              alt="Clinlix"
              className="w-12 h-12 rounded-xl"
            />
            <div className="flex-1 pr-6">
              <h3 className="font-semibold text-gray-900 mb-1">
                Install Clinlix App
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get faster access and an app-like experience. Works offline!
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={dismissPrompt}
              className="flex-1 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Later
            </button>
            <button
              onClick={installApp}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6E45E2] to-[#8365FB] text-white hover:opacity-90 transition-opacity font-medium text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
