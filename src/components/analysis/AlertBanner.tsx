import { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  ChevronDown,
  ChevronUp,
  Ban,
  Activity,
  ShieldAlert,
  Brain,
  Pill,
} from 'lucide-react';
import type { TriggeredAlert } from '../../types';
import { INFO_LEVEL_STYLES, INFO_LEVEL_LABELS } from '../../constants/colors';

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  'alert-triangle': AlertTriangle,
  'alert-octagon': AlertOctagon,
  info: Info,
  ban: Ban,
  activity: Activity,
  'shield-alert': ShieldAlert,
  brain: Brain,
  pill: Pill,
};

interface AlertBannerProps {
  alert: TriggeredAlert;
  drugNames?: Record<string, string>;
}

export default function AlertBanner({ alert, drugNames = {} }: AlertBannerProps) {
  const [isExpanded, setIsExpanded] = useState(alert.alert_level === 'info1');
  const IconComponent = iconComponents[alert.icon] || AlertTriangle;

  const triggeredDrugNames = alert.triggered_by
    .map(id => drugNames[id] || id)
    .join(', ');

  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${INFO_LEVEL_STYLES[alert.alert_level]} animate-fadeIn`}
    >
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs uppercase tracking-wide">
                [{INFO_LEVEL_LABELS[alert.alert_level]}]
              </span>
              <span className="font-semibold">{alert.title}</span>
            </div>
            {!isExpanded && (
              <p className="text-sm mt-1 opacity-80 line-clamp-1">
                {alert.message}
              </p>
            )}
          </div>
        </div>
        <button className="p-1 flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pl-8">
          <p className="text-sm">{alert.message}</p>
          {triggeredDrugNames && (
            <p className="text-xs mt-2 opacity-75">
              관련 약물: {triggeredDrugNames}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface AlertListProps {
  alerts: TriggeredAlert[];
  drugNames?: Record<string, string>;
}

export function AlertList({ alerts, drugNames }: AlertListProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Info className="w-4 h-4" />
        참고 정보 ({alerts.length}개)
      </h3>
      <div className="space-y-2">
        {alerts.map(alert => (
          <AlertBanner key={alert.id} alert={alert} drugNames={drugNames} />
        ))}
      </div>
    </div>
  );
}
