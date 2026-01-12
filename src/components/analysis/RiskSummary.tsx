import type { ToxicityTab } from '../../types';
import {
  SCORE_LEVELS,
  HEPATO_GRADE_INFO,
  RENAL_GRADE_INFO,
} from '../../constants/colors';

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

// 분류 정보에 키 매핑 추가
const hepatoGradeKeys = ['gradeACount', 'gradeBCount', 'gradeCCount', 'gradeDCount', 'gradeECount'] as const;
const renalGradeKeys = ['gradeN1Count', 'gradeN2Count', 'gradeN3Count', 'gradeN4Count', 'gradeN5Count'] as const;

export default function RiskSummary({ riskScore, renalRiskScore = 0, activeTab, summary }: RiskSummaryProps) {
  const currentScore = activeTab === 'hepato' ? riskScore : renalRiskScore;
  const riskLabel = SCORE_LEVELS.getLabel(currentScore);
  const riskColor = SCORE_LEVELS.getTextColor(currentScore);
  const strokeColor = SCORE_LEVELS.getStrokeColor(currentScore);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (currentScore / 100) * circumference;

  const gradeInfo = activeTab === 'hepato' ? HEPATO_GRADE_INFO : RENAL_GRADE_INFO;
  const gradeKeys = activeTab === 'hepato' ? hepatoGradeKeys : renalGradeKeys;
  const gradeLabel = activeTab === 'hepato' ? '간 관련' : '신 관련';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {gradeLabel} 참고 수치 요약
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
              className={`${strokeColor} transition-all duration-500`}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentScore}
            </span>
            <span className={`text-sm font-medium ${riskColor}`}>
              {riskLabel}
            </span>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="flex-1 w-full">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {gradeLabel} 분류별 약물 수
          </p>
          <div className="space-y-2">
            {gradeInfo.map((info, index) => {
              const count = summary[gradeKeys[index]] as number;
              return (
                <div key={info.grade} className="flex items-center gap-2">
                  <span className={`w-8 h-6 flex items-center justify-center text-xs font-bold text-white rounded ${info.color}`}>
                    {info.grade}
                  </span>
                  <div className="flex-1 h-6 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <div
                      className={`h-full ${info.bgColor} transition-all duration-300 flex items-center justify-end pr-2`}
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
