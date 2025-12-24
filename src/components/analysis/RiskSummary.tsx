import type { HepatotoxicityGrade, NephrotoxicityGrade, ToxicityTab } from '../../types';

interface RiskSummaryProps {
  riskScore: number;
  renalRiskScore?: number;
  activeTab: ToxicityTab;
  summary: {
    totalDrugs: number;
    gradeACount: number;
    gradeBCount: number;
    gradeCCount: number;
    gradeDCount: number;
    gradeECount: number;
    gradeN1Count: number;
    gradeN2Count: number;
    gradeN3Count: number;
    gradeN4Count: number;
    gradeN5Count: number;
  };
}

const hepatoGradeInfo: { grade: HepatotoxicityGrade; key: keyof RiskSummaryProps['summary']; color: string; bgColor: string }[] = [
  { grade: 'A', key: 'gradeACount', color: 'bg-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  { grade: 'B', key: 'gradeBCount', color: 'bg-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { grade: 'C', key: 'gradeCCount', color: 'bg-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { grade: 'D', key: 'gradeDCount', color: 'bg-lime-500', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
  { grade: 'E', key: 'gradeECount', color: 'bg-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
];

const renalGradeInfo: { grade: NephrotoxicityGrade; key: keyof RiskSummaryProps['summary']; color: string; bgColor: string }[] = [
  { grade: 'N1', key: 'gradeN1Count', color: 'bg-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  { grade: 'N2', key: 'gradeN2Count', color: 'bg-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { grade: 'N3', key: 'gradeN3Count', color: 'bg-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { grade: 'N4', key: 'gradeN4Count', color: 'bg-lime-500', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
  { grade: 'N5', key: 'gradeN5Count', color: 'bg-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
];

function getRiskLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: '매우 높음', color: 'text-red-600 dark:text-red-400' };
  if (score >= 60) return { label: '높음', color: 'text-orange-600 dark:text-orange-400' };
  if (score >= 40) return { label: '보통', color: 'text-yellow-600 dark:text-yellow-400' };
  if (score >= 20) return { label: '낮음', color: 'text-lime-600 dark:text-lime-400' };
  return { label: '매우 낮음', color: 'text-green-600 dark:text-green-400' };
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'stroke-red-500';
  if (score >= 60) return 'stroke-orange-500';
  if (score >= 40) return 'stroke-yellow-500';
  if (score >= 20) return 'stroke-lime-500';
  return 'stroke-green-500';
}

export default function RiskSummary({ riskScore, renalRiskScore = 0, activeTab, summary }: RiskSummaryProps) {
  const currentScore = activeTab === 'hepato' ? riskScore : renalRiskScore;
  const riskLevel = getRiskLevel(currentScore);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (currentScore / 100) * circumference;
  const gradeInfo = activeTab === 'hepato' ? hepatoGradeInfo : renalGradeInfo;
  const gradeLabel = activeTab === 'hepato' ? '간독성' : '신독성';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {gradeLabel} 위험도 요약
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              className={`${getScoreColor(currentScore)} transition-all duration-500`}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentScore}
            </span>
            <span className={`text-sm font-medium ${riskLevel.color}`}>
              {riskLevel.label}
            </span>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="flex-1 w-full">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {gradeLabel} 등급별 약물 수
          </p>
          <div className="space-y-2">
            {gradeInfo.map(({ grade, key, color, bgColor }) => {
              const count = summary[key] as number;
              return (
                <div key={grade} className="flex items-center gap-2">
                  <span className={`w-8 h-6 flex items-center justify-center text-xs font-bold text-white rounded ${color}`}>
                    {grade}
                  </span>
                  <div className="flex-1 h-6 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <div
                      className={`h-full ${bgColor} transition-all duration-300 flex items-center justify-end pr-2`}
                      style={{
                        width: summary.totalDrugs > 0
                          ? `${Math.max((count / summary.totalDrugs) * 100, count > 0 ? 20 : 0)}%`
                          : '0%'
                      }}
                    >
                      {count > 0 && (
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            총 {summary.totalDrugs}개 약물
          </p>
        </div>
      </div>
    </div>
  );
}
