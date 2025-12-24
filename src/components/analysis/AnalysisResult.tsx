import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAllAlerts } from '../../hooks/useDrugs';
import {
  analyzeDrug,
  calculateRiskScore,
  getGradeCounts,
  getGradeLabel,
} from '../../utils/analysis';
import {
  analyzeRenalToxicity,
  calculateRenalRiskScore,
  getRenalGradeCounts,
  getNephroGradeLabel,
} from '../../utils/renalAnalysis';
import { detectAlerts } from '../../utils/alerts';
import ToxicityTabs from './ToxicityTabs';
import RiskSummary from './RiskSummary';
import { AlertList } from './AlertBanner';
import DrugDetailModal from '../drug/DrugDetailModal';
import type { HepatotoxicityGrade, NephrotoxicityGrade } from '../../types';
import { AlertTriangle, Droplets, Activity } from 'lucide-react';

const hepatoGradeColors: Record<HepatotoxicityGrade, string> = {
  A: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  B: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
  C: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  D: 'border-lime-500 bg-lime-50 dark:bg-lime-900/20',
  E: 'border-green-500 bg-green-50 dark:bg-green-900/20',
};

const hepatoGradeBadgeColors: Record<HepatotoxicityGrade, string> = {
  A: 'bg-red-600',
  B: 'bg-orange-500',
  C: 'bg-yellow-500',
  D: 'bg-lime-500',
  E: 'bg-green-500',
};

const renalGradeColors: Record<NephrotoxicityGrade, string> = {
  N1: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  N2: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
  N3: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  N4: 'border-lime-500 bg-lime-50 dark:bg-lime-900/20',
  N5: 'border-green-500 bg-green-50 dark:bg-green-900/20',
};

const renalGradeBadgeColors: Record<NephrotoxicityGrade, string> = {
  N1: 'bg-red-600',
  N2: 'bg-orange-500',
  N3: 'bg-yellow-500',
  N4: 'bg-lime-500',
  N5: 'bg-green-500',
};

export default function AnalysisResult() {
  const { state } = useApp();
  const { alerts: allAlerts } = useAllAlerts();
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);

  const analysis = useMemo(() => {
    const drugs = state.selectedDrugs;
    const childPugh = state.childPughGrade;
    const ckdStage = state.ckdStage;

    // 간독성 분석
    const drugAnalyses = drugs.map(drug => {
      const hepatoAnalysis = analyzeDrug(drug, childPugh);
      const renalAnalysis = analyzeRenalToxicity(drug, ckdStage);
      return {
        ...hepatoAnalysis,
        ...renalAnalysis,
      };
    });

    const hepatoRiskScore = calculateRiskScore(drugs, childPugh);
    const renalRiskScore = calculateRenalRiskScore(drugs, ckdStage);
    const hepatoSummary = getGradeCounts(drugs);
    const renalSummary = getRenalGradeCounts(drugs);
    const summary = {
      ...hepatoSummary,
      ...renalSummary,
    };

    // 경고 (CKD 포함)
    const triggeredAlerts = detectAlerts(drugs, childPugh, allAlerts, ckdStage);

    // 탭별 약물 수 계산
    const hepatoCount = drugs.filter(d =>
      d.hepatotoxicity.grade === 'A' || d.hepatotoxicity.grade === 'B'
    ).length;
    const renalCount = drugs.filter(d =>
      d.nephrotoxicity?.grade === 'N1' || d.nephrotoxicity?.grade === 'N2'
    ).length;

    return {
      drugAnalyses,
      hepatoRiskScore,
      renalRiskScore,
      summary,
      alerts: triggeredAlerts,
      hepatoCount,
      renalCount,
    };
  }, [state.selectedDrugs, state.childPughGrade, state.ckdStage, allAlerts]);

  const drugNames = useMemo(() => {
    const names: Record<string, string> = {};
    state.selectedDrugs.forEach(drug => {
      names[drug.id] = drug.name_kr;
    });
    return names;
  }, [state.selectedDrugs]);

  const selectedDrug = state.selectedDrugs.find(d => d.id === selectedDrugId);

  // 현재 탭에 맞는 경고 필터링
  const filteredAlerts = useMemo(() => {
    return analysis.alerts.filter(alert => {
      if (state.activeTab === 'hepato') {
        return !alert.alert_category || alert.alert_category === 'hepato' || alert.alert_category === 'combined';
      } else {
        return alert.alert_category === 'renal' || alert.alert_category === 'combined';
      }
    });
  }, [analysis.alerts, state.activeTab]);

  if (state.selectedDrugs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>약물을 선택하면 분석 결과가 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toxicity Tabs */}
      <ToxicityTabs
        hepatoCount={analysis.hepatoCount}
        renalCount={analysis.renalCount}
      />

      {/* Risk Summary */}
      <RiskSummary
        riskScore={analysis.hepatoRiskScore}
        renalRiskScore={analysis.renalRiskScore}
        activeTab={state.activeTab}
        summary={analysis.summary}
      />

      {/* Alerts */}
      <AlertList alerts={filteredAlerts} drugNames={drugNames} />

      {/* Drug Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {state.activeTab === 'hepato' ? '간독성' : '신독성'} 약물별 분석 결과
        </h3>
        <div className="grid gap-3">
          {analysis.drugAnalyses.map(drugAnalysis => {
            const { drug, dosing, warnings, renalDosing, renalWarnings } = drugAnalysis;
            const isHepatoTab = state.activeTab === 'hepato';

            // 탭에 맞는 색상과 등급 표시
            const gradeColor = isHepatoTab
              ? hepatoGradeColors[drug.hepatotoxicity.grade]
              : drug.nephrotoxicity
                ? renalGradeColors[drug.nephrotoxicity.grade]
                : 'border-gray-300 bg-gray-50 dark:bg-gray-800';

            const gradeLabel = isHepatoTab
              ? getGradeLabel(drug.hepatotoxicity.grade)
              : drug.nephrotoxicity
                ? getNephroGradeLabel(drug.nephrotoxicity.grade)
                : '신독성 정보 없음';

            const currentDosing = isHepatoTab ? dosing : renalDosing;
            const currentWarnings = isHepatoTab ? warnings : (renalWarnings || []);
            const showDosing = isHepatoTab
              ? state.childPughGrade !== 'normal'
              : state.ckdStage !== 'normal';
            const dosingLabel = isHepatoTab
              ? `Child-Pugh ${state.childPughGrade}`
              : `CKD ${state.ckdStage}`;

            return (
              <div
                key={drug.id}
                onClick={() => setSelectedDrugId(drug.id)}
                className={`p-4 rounded-lg border-l-4 cursor-pointer transition-shadow hover:shadow-md ${gradeColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {drug.name_kr}
                      </span>
                      {/* 간독성 배지 */}
                      <span
                        className={`px-2 py-0.5 text-xs font-bold text-white rounded flex items-center gap-1 ${
                          hepatoGradeBadgeColors[drug.hepatotoxicity.grade]
                        }`}
                      >
                        <Activity size={10} />
                        {drug.hepatotoxicity.grade}
                      </span>
                      {/* 신독성 배지 */}
                      {drug.nephrotoxicity && (
                        <span
                          className={`px-2 py-0.5 text-xs font-bold text-white rounded flex items-center gap-1 ${
                            renalGradeBadgeColors[drug.nephrotoxicity.grade]
                          }`}
                        >
                          <Droplets size={10} />
                          {drug.nephrotoxicity.grade}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {gradeLabel}
                    </p>

                    {/* Dosing recommendation */}
                    {currentDosing && showDosing && (
                      <div className="mt-3 p-2 bg-white/50 dark:bg-gray-900/30 rounded">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {dosingLabel} 권고:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {currentDosing.dose}
                        </p>
                      </div>
                    )}

                    {/* Warnings */}
                    {currentWarnings.length > 0 && (
                      <div className="mt-2 flex items-start gap-1">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          {currentWarnings[0]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drug Detail Modal */}
      {selectedDrug && (
        <DrugDetailModal
          drug={selectedDrug}
          childPugh={state.childPughGrade}
          ckdStage={state.ckdStage}
          onClose={() => setSelectedDrugId(null)}
        />
      )}
    </div>
  );
}
