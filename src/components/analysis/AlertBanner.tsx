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
import type { TriggeredAlert, AlertLevel } from '../../types';

const alertStyles: Record<AlertLevel, string> = {
  critical: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-200',
  high: 'bg-orange-50 border-orange-500 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
  medium: 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  low: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
};

const alertLabels: Record<AlertLevel, string> = {
  critical: '위험',
  high: '주의',
  medium: '참고',
  low: '정보',
};

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
  const [isExpanded, setIsExpanded] = useState(alert.alert_level === 'critical');

  const IconComponent = iconComponents[alert.icon] || AlertTriangle;

  const triggeredDrugNames = alert.triggered_by
    .map(id => drugNames[id] || id)
    .join(', ');

  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${alertStyles[alert.alert_level]} animate-fadeIn`}
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
                [{alertLabels[alert.alert_level]}]
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
        <AlertTriangle className="w-4 h-4" />
        경고 ({alerts.length}개)
      </h3>
      <div className="space-y-2">
        {alerts.map(alert => (
          <AlertBanner key={alert.id} alert={alert} drugNames={drugNames} />
        ))}
      </div>
    </div>
  );
}
