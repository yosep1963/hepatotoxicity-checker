import { useState } from 'react';
import { X, Pill, Activity, Lightbulb, Droplets } from 'lucide-react';
import type { Drug, ChildPughGrade, CKDStage, HepatotoxicityGrade, NephrotoxicityGrade } from '../../types';
import { getGradeLabel, getDosingForChildPugh } from '../../utils/analysis';
import {
  getNephroGradeLabel,
  getNephroPatternLabel,
  getRenalDosingForCKD,
  getCKDStageLabel,
} from '../../utils/renalAnalysis';

const hepatoGradeBadgeColors: Record<HepatotoxicityGrade, string> = {
  A: 'bg-red-600',
  B: 'bg-orange-500',
  C: 'bg-yellow-500',
  D: 'bg-lime-500',
  E: 'bg-green-500',
};

const renalGradeBadgeColors: Record<NephrotoxicityGrade, string> = {
  N1: 'bg-red-600',
  N2: 'bg-orange-500',
  N3: 'bg-yellow-500',
  N4: 'bg-lime-500',
  N5: 'bg-green-500',
};

const tabs = [
  { id: 'info', label: '기본정보', icon: Pill },
  { id: 'hepato', label: '간독성', icon: Activity },
  { id: 'renal', label: '신독성', icon: Droplets },
];

interface DrugDetailModalProps {
  drug: Drug;
  childPugh: ChildPughGrade;
  ckdStage?: CKDStage;
  onClose: () => void;
}

export default function DrugDetailModal({ drug, childPugh, ckdStage = 'normal', onClose }: DrugDetailModalProps) {
  const [activeTab, setActiveTab] = useState('info');

  const hepatoDosing = getDosingForChildPugh(drug, childPugh);
  const renalDosing = getRenalDosingForCKD(drug, ckdStage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {drug.name_kr}
                  </h2>
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {drug.name_en} · {drug.drug_class}
                  {drug.drug_class_en && ` (${drug.drug_class_en})`}
                </p>
                {drug.brand_names_kr.length > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    상품명: {drug.brand_names_kr.join(', ')}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 -mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {/* 기본정보 탭 */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                {/* Clinical Pearls - 간독성 */}
                {drug.clinical_pearls.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      간독성 임상 팁
                    </h4>
                    <ul className="space-y-1">
                      {drug.clinical_pearls.map((tip, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                        >
                          <span className="text-yellow-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Clinical Pearls - 신독성 */}
                {drug.renal_clinical_pearls && drug.renal_clinical_pearls.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-purple-500" />
                      신독성 임상 팁
                    </h4>
                    <ul className="space-y-1">
                      {drug.renal_clinical_pearls.map((tip, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                        >
                          <span className="text-purple-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 간독성 탭 */}
            {activeTab === 'hepato' && (
              <div className="space-y-4">
                {/* Hepatotoxicity Info */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    간독성 정보
                  </h4>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-gray-500 dark:text-gray-400">등급</dt>
                    <dd className="text-gray-900 dark:text-white">
                      {getGradeLabel(drug.hepatotoxicity.grade)}
                    </dd>
                    <dt className="text-gray-500 dark:text-gray-400">패턴</dt>
                    <dd className="text-gray-900 dark:text-white capitalize">
                      {drug.hepatotoxicity.pattern}
                    </dd>
                    <dt className="text-gray-500 dark:text-gray-400">용량의존성</dt>
                    <dd className="text-gray-900 dark:text-white">
                      {drug.hepatotoxicity.dose_dependent ? '예' : '아니오'}
                    </dd>
                  </dl>
                </div>

                {/* Mechanism */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    기전
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {drug.hepatotoxicity.mechanism}
                  </p>
                </div>

                {/* Current recommendation */}
                {childPugh !== 'normal' && hepatoDosing && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      현재 선택: Child-Pugh {childPugh}
                    </h4>
                    <p className="text-blue-900 dark:text-blue-100 font-medium text-lg">
                      {hepatoDosing.dose}
                    </p>
                  </div>
                )}

                {childPugh === 'normal' && hepatoDosing && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                      간기능 정상
                    </h4>
                    <p className="text-green-800 dark:text-green-200">
                      {hepatoDosing.recommendation}
                    </p>
                    {hepatoDosing.caution && (
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        주의: {hepatoDosing.caution}
                      </p>
                    )}
                  </div>
                )}

                {/* All grades table */}
                <div className="overflow-x-auto">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Child-Pugh 등급별 용량 권고
                  </h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">등급</th>
                        <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">권고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(['A', 'B', 'C'] as const).map(grade => {
                        const dosingText = drug.cirrhosis_dosing[`child_${grade}`];
                        return (
                          <tr
                            key={grade}
                            className={`border-b border-gray-100 dark:border-gray-700 ${
                              childPugh === grade ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">
                              Child {grade}
                            </td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-300">
                              {dosingText}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 신독성 탭 */}
            {activeTab === 'renal' && (
              <div className="space-y-4">
                {drug.nephrotoxicity ? (
                  <>
                    {/* Nephrotoxicity Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        신독성 정보
                      </h4>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-gray-500 dark:text-gray-400">등급</dt>
                        <dd className="text-gray-900 dark:text-white">
                          {getNephroGradeLabel(drug.nephrotoxicity.grade)}
                        </dd>
                        <dt className="text-gray-500 dark:text-gray-400">패턴</dt>
                        <dd className="text-gray-900 dark:text-white">
                          {getNephroPatternLabel(drug.nephrotoxicity.pattern)}
                        </dd>
                        <dt className="text-gray-500 dark:text-gray-400">용량의존성</dt>
                        <dd className="text-gray-900 dark:text-white">
                          {drug.nephrotoxicity.dose_dependent ? '예' : '아니오'}
                        </dd>
                        {drug.nephrotoxicity.dialyzable !== undefined && (
                          <>
                            <dt className="text-gray-500 dark:text-gray-400">투석 제거</dt>
                            <dd className="text-gray-900 dark:text-white">
                              {drug.nephrotoxicity.dialyzable ? '가능' : '불가'}
                            </dd>
                          </>
                        )}
                      </dl>
                    </div>

                    {/* Mechanism */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        기전
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {drug.nephrotoxicity.mechanism}
                      </p>
                    </div>

                    {/* Current recommendation */}
                    {ckdStage !== 'normal' && renalDosing && (
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                          현재 선택: {getCKDStageLabel(ckdStage)}
                        </h4>
                        <p className="text-purple-900 dark:text-purple-100 font-medium text-lg">
                          {renalDosing.dose}
                        </p>
                      </div>
                    )}

                    {ckdStage === 'normal' && renalDosing && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                          신기능 정상
                        </h4>
                        <p className="text-green-800 dark:text-green-200">
                          {renalDosing.recommendation || '일반 용량 사용'}
                        </p>
                        {renalDosing.caution && (
                          <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                            주의: {renalDosing.caution}
                          </p>
                        )}
                      </div>
                    )}

                    {/* CKD stages table */}
                    {drug.renal_dosing && (
                      <div className="overflow-x-auto">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          CKD 단계별 용량 권고
                        </h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">단계</th>
                              <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">권고</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { stage: 'normal', label: '정상 (eGFR ≥90)', key: 'gfr_90_plus' },
                              { stage: 'G2', label: 'G2 (eGFR 60-89)', key: 'gfr_60_89' },
                              { stage: 'G3a', label: 'G3a (eGFR 45-59)', key: 'gfr_45_59' },
                              { stage: 'G3b', label: 'G3b (eGFR 30-44)', key: 'gfr_30_44' },
                              { stage: 'G4', label: 'G4 (eGFR 15-29)', key: 'gfr_15_29' },
                              { stage: 'G5', label: 'G5 (eGFR <15)', key: 'gfr_below_15' },
                              { stage: 'dialysis', label: '투석', key: 'dialysis' },
                            ].map(({ stage, label, key }) => {
                              const dosingText = drug.renal_dosing![key as keyof typeof drug.renal_dosing];
                              return (
                                <tr
                                  key={stage}
                                  className={`border-b border-gray-100 dark:border-gray-700 ${
                                    ckdStage === stage ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                                  }`}
                                >
                                  <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">
                                    {label}
                                  </td>
                                  <td className="py-2 px-3 text-gray-600 dark:text-gray-300">
                                    {dosingText || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Droplets className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>이 약물의 신독성 정보가 아직 등록되지 않았습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
