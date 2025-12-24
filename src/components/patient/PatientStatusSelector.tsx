import { useApp } from '../../context/AppContext';
import type { ChildPughGrade, AlcoholHistory, CKDStage } from '../../types';

const childPughOptions: { value: ChildPughGrade; label: string; description: string }[] = [
  { value: 'normal', label: '정상', description: '간경변 없음' },
  { value: 'A', label: 'Child A', description: '대상성 (5-6점)' },
  { value: 'B', label: 'Child B', description: '중등도 (7-9점)' },
  { value: 'C', label: 'Child C', description: '비대상성 (10-15점)' },
];

const ckdOptions: { value: CKDStage; label: string; description: string }[] = [
  { value: 'normal', label: '정상', description: 'eGFR ≥90' },
  { value: 'G2', label: 'G2', description: 'eGFR 60-89' },
  { value: 'G3a', label: 'G3a', description: 'eGFR 45-59' },
  { value: 'G3b', label: 'G3b', description: 'eGFR 30-44' },
  { value: 'G4', label: 'G4', description: 'eGFR 15-29' },
  { value: 'G5', label: 'G5', description: 'eGFR <15' },
  { value: 'dialysis', label: '투석', description: 'HD/PD' },
];

const alcoholOptions: { value: AlcoholHistory; label: string }[] = [
  { value: 'none', label: '없음' },
  { value: 'social', label: '사회적 음주' },
  { value: 'chronic', label: '만성 음주' },
];

export default function PatientStatusSelector() {
  const { state, setChildPugh, setAlcoholHistory, setCKDStage } = useApp();

  return (
    <div className="space-y-6">
      {/* Child-Pugh Grade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          간기능 상태 (Child-Pugh)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {childPughOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setChildPugh(option.value)}
              className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                state.childPughGrade === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {option.description}
              </div>
              {state.childPughGrade === option.value && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CKD Stage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          신기능 상태 (CKD Stage)
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {ckdOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setCKDStage(option.value)}
              className={`relative p-2 rounded-lg border-2 transition-all text-center ${
                state.ckdStage === option.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {option.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {option.description}
              </div>
              {state.ckdStage === option.value && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alcohol History */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          음주력 (선택사항)
        </label>
        <div className="flex flex-wrap gap-2">
          {alcoholOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setAlcoholHistory(option.value)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                state.alcoholHistory === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {state.alcoholHistory === 'chronic' && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            만성 음주 시 아세트아미노펜 등 일부 약물의 간독성 위험이 증가합니다
          </p>
        )}
      </div>

      {/* Info box for Child-Pugh C */}
      {state.childPughGrade === 'C' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Child-Pugh C (비대상성 간경변)</strong>
            <br />
            대부분의 간대사 약물에서 용량 조절이 필요합니다.
            간독성 위험이 높은 약물은 가급적 회피하세요.
          </p>
        </div>
      )}

      {/* Info box for CKD G4/G5/Dialysis */}
      {(state.ckdStage === 'G4' || state.ckdStage === 'G5' || state.ckdStage === 'dialysis') && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            <strong>
              {state.ckdStage === 'dialysis' ? '투석 환자' : `CKD ${state.ckdStage} (중증 신기능 저하)`}
            </strong>
            <br />
            신배설 약물의 용량 조절이 필요합니다.
            신독성 위험이 높은 약물(NSAIDs, Aminoglycosides 등)은 가급적 회피하세요.
          </p>
        </div>
      )}

      {/* Hepatorenal warning */}
      {state.childPughGrade === 'C' && (state.ckdStage === 'G4' || state.ckdStage === 'G5' || state.ckdStage === 'dialysis') && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg">
          <p className="text-sm text-red-900 dark:text-red-100 font-medium">
            <strong>간신증후군 고위험 상태</strong>
            <br />
            비대상성 간경변과 중증 신기능 저하가 동반되어 있습니다.
            약물 선택에 특히 주의가 필요하며, 전문가 협진을 권고합니다.
          </p>
        </div>
      )}
    </div>
  );
}
