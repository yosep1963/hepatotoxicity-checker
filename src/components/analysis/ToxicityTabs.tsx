import { Activity, Droplets } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ToxicityTab } from '../../types';

interface ToxicityTabsProps {
  hepatoCount?: number;
  renalCount?: number;
}

export default function ToxicityTabs({ hepatoCount = 0, renalCount = 0 }: ToxicityTabsProps) {
  const { state, setActiveTab } = useApp();

  const tabs: { id: ToxicityTab; label: string; icon: typeof Activity; count: number; color: string }[] = [
    {
      id: 'hepato',
      label: '간독성',
      icon: Activity,
      count: hepatoCount,
      color: 'blue'
    },
    {
      id: 'renal',
      label: '신독성',
      icon: Droplets,
      count: renalCount,
      color: 'purple'
    }
  ];

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = state.activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative ${
              isActive
                ? tab.color === 'blue'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                isActive
                  ? tab.color === 'blue'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            )}
            {isActive && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                tab.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
              }`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
