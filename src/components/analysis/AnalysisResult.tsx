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
import { AlertTriangle, Droplets, Activity } from 'lucide-react';
import {
  HEPATO_GRADE_COLORS,
  HEPATO_GRADE_BADGE_COLORS,
  RENAL_GRADE_COLORS,
  RENAL_GRADE_BADGE_COLORS,
} from '../../constants/colors';

export default function AnalysisResult() {
  const { state } = useApp();
  const { alerts: allAlerts } = useAllAlerts();
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);

  const analysis = useMemo(() => {
    const drugs = state.selectedDrugs;
    const childPugh = state.childPughGrade;
    const ckdStage = state.ckdStage;

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

    const triggeredAlerts = detectAlerts(drugs, childPugh, allAlerts, ckdStage);

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
      <ToxicityTabs
        hepatoCount={analysis.hepatoCount}
        renalCount={analysis.renalCount}
      />

      <RiskSummary
        riskScore={analysis.hepatoRiskScore}
        renalRiskScore={analysis.renalRiskScore}
        activeTab={state.activeTab}
        summary={analysis.summary}
      />

      <AlertList alerts={filteredAlerts} drugNames={drugNames} />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {state.activeTab === 'hepato' ? '간 관련' : '신 관련'} 약물별 정보
        </h3>
        <div className="grid gap-3">
          {analysis.drugAnalyses.map(drugAnalysis => {
            const { drug, dosing, warnings, renalDosing, renalWarnings } = drugAnalysis;
            const isHepatoTab = state.activeTab === 'hepato';

            const gradeColor = isHepatoTab
              ? HEPATO_GRADE_COLORS[drug.hepatotoxicity.grade]
              : drug.nephrotoxicity
                ? RENAL_GRADE_COLORS[drug.nephrotoxicity.grade]
                : 'border-gray-300 bg-gray-50 dark:bg-gray-800';

            const gradeLabel = isHepatoTab
              ? getGradeLabel(drug.hepatotoxicity.grade)
              : drug.nephrotoxicity
                ? getNephroGradeLabel(drug.nephrotoxicity.grade)
                : '신 관련 정보 없음';

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
                      <span
                        className={`px-2 py-0.5 text-xs font-bold text-white rounded flex items-center gap-1 ${
                          HEPATO_GRADE_BADGE_COLORS[drug.hepatotoxicity.grade]
                        }`}
                      >
                        <Activity size={10} />
                        {drug.hepatotoxicity.grade}
                      </span>
                      {drug.nephrotoxicity && (
                        <span
                          className={`px-2 py-0.5 text-xs font-bold text-white rounded flex items-center gap-1 ${
                            RENAL_GRADE_BADGE_COLORS[drug.nephrotoxicity.grade]
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

                    {currentDosing && showDosing && (
                      <div className="mt-3 p-2 bg-white/50 dark:bg-gray-900/30 rounded">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {dosingLabel} 참고 정보:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {currentDosing.dose}
                        </p>
                      </div>
                    )}

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

      {/* 분류 등급 설명 */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {state.activeTab === 'hepato' ? '간 관련' : '신 관련'} 분류 설명
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          {state.activeTab === 'hepato' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="w-6 h-5 flex items-center justify-center text-white font-bold rounded bg-blue-700 text-[10px]">A</span>
                <span>Well-known: 잘 알려진 간 관련 약물</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-5 flex items-center justify-center text-white font-bold rounded bg-blue-500 text-[10px]">B</span>
                <span>Highly likely: 간 관련 가능성 높음</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-5 flex items-center justify-center text-white font-bold rounded bg-slate-500 text-[10px]">C</span>
                <span>Probable: 간 관련 가능성 있음</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-5 flex items-center justify-center text-white font-bold rounded bg-gray-500 text-[10px]">D</span>
                <span>Possible: 간 관련 가능성 낮음</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-5 flex items-center justify-center text-white font-bold rounded bg-gray-400 text-[10px]">E</span>
                <span>Unlikely: 간 관련 거의 없음</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 flex items-center justify-center text-white font-bold rounded bg-purple-700 text-[10px]">N1</span>
                <span>Well-known: 잘 알려진 신 관련 약물</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 flex items-center justify-center text-white font-bold rounded bg-purple-500 text-[10px]">N2</span>
                <span>Highly likely: 신 관련 가능성 높음</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 flex items-center justify-center text-white font-bold rounded bg-slate-500 text-[10px]">N3</span>
                <span>Probable: 신 관련 가능성 있음</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 flex items-center justify-center text-white font-bold rounded bg-gray-500 text-[10px]">N4</span>
                <span>Possible: 신 관련 가능성 낮음</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 flex items-center justify-center text-white font-bold rounded bg-gray-400 text-[10px]">N5</span>
                <span>Unlikely: 신 관련 거의 없음</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 참고 수치 설명 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          참고 수치 (1-100) 설명
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          참고 수치는 선택된 약물들의 분류와 사용자 조건을 종합하여 산출된 참고용 지표입니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <span className="w-12 text-center font-bold text-blue-600 dark:text-blue-400">0-20</span>
            <span className="text-gray-600 dark:text-gray-400">1단계 (낮음)</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <span className="w-12 text-center font-bold text-blue-500 dark:text-blue-400">21-40</span>
            <span className="text-gray-600 dark:text-gray-400">2단계 (보통)</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/20 rounded">
            <span className="w-12 text-center font-bold text-slate-600 dark:text-slate-400">41-60</span>
            <span className="text-gray-600 dark:text-gray-400">3단계 (중간)</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/20 rounded">
            <span className="w-12 text-center font-bold text-slate-500 dark:text-slate-400">61-80</span>
            <span className="text-gray-600 dark:text-gray-400">4단계 (높음)</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded">
            <span className="w-12 text-center font-bold text-gray-600 dark:text-gray-400">81-100</span>
            <span className="text-gray-600 dark:text-gray-400">5단계 (매우 높음)</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">
          ※ 이 수치는 일반적인 참고 정보이며, 실제 의사결정에는 전문가 상담이 필요합니다.
        </p>
      </div>

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
