import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  DISCLAIMER,
  DISCLAIMER_ACCEPTED_KEY,
  DISCLAIMER_ACCEPTED_DATE_KEY,
} from '../../constants/disclaimer';
import { APP_INFO } from '../../constants/appInfo';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export default function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const accepted = localStorage.getItem(DISCLAIMER_ACCEPTED_KEY);
    if (accepted === 'true') {
      onAccept();
    } else {
      setIsVisible(true);
    }
  }, [onAccept]);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, 'true');
      localStorage.setItem(DISCLAIMER_ACCEPTED_DATE_KEY, new Date().toISOString());
      setIsVisible(false);
      onAccept();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">{APP_INFO.name}</h2>
              <p className="text-blue-100 text-sm">{DISCLAIMER.title}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {DISCLAIMER.content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {DISCLAIMER.checkboxText}
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={!isChecked}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isChecked
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {DISCLAIMER.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
