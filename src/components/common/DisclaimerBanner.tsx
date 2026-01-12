import { Info } from 'lucide-react';
import { RESULT_NOTICE } from '../../constants/disclaimer';

interface DisclaimerBannerProps {
  variant?: 'subtle' | 'prominent';
}

export default function DisclaimerBanner({ variant = 'subtle' }: DisclaimerBannerProps) {
  if (variant === 'subtle') {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2 border-t border-gray-200 dark:border-gray-700 mt-4">
        <Info className="w-3 h-3 inline-block mr-1" />
        {RESULT_NOTICE.short}
      </div>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 mx-4 my-2">
      <p className="text-slate-700 dark:text-slate-300 text-sm text-center flex items-center justify-center gap-2">
        <Info className="w-4 h-4 flex-shrink-0" />
        {RESULT_NOTICE.medium}
      </p>
    </div>
  );
}
