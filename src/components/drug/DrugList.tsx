import { X, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { HepatotoxicityGrade } from '../../types';

const gradeColors: Record<HepatotoxicityGrade, string> = {
  A: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
  B: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
  C: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  D: 'border-l-lime-500 bg-lime-50 dark:bg-lime-900/20',
  E: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
};

const gradeBadgeColors: Record<HepatotoxicityGrade, string> = {
  A: 'bg-red-600 text-white',
  B: 'bg-orange-500 text-white',
  C: 'bg-yellow-500 text-white',
  D: 'bg-lime-500 text-white',
  E: 'bg-green-500 text-white',
};

interface DrugListProps {
  onDrugClick?: (drugId: string) => void;
}

export default function DrugList({ onDrugClick }: DrugListProps) {
  const { state, removeDrug, clearDrugs } = useApp();

  if (state.selectedDrugs.length === 0) {
    return (
      <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <Info className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          선택된 약물이 없습니다
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          위 검색창에서 약물을 검색하여 추가하세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          선택된 약물 ({state.selectedDrugs.length}개)
        </h3>
        <button
          onClick={clearDrugs}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          모두 삭제
        </button>
      </div>

      <ul className="space-y-2">
        {state.selectedDrugs.map(drug => (
          <li
            key={drug.id}
            className={`relative p-3 rounded-lg border-l-4 cursor-pointer transition-shadow hover:shadow-md ${gradeColors[drug.hepatotoxicity.grade]}`}
            onClick={() => onDrugClick?.(drug.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {drug.name_kr}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${gradeBadgeColors[drug.hepatotoxicity.grade]}`}>
                    {drug.hepatotoxicity.grade}등급
                  </span>
                  {(drug.hepatotoxicity.grade === 'A' || drug.hepatotoxicity.grade === 'B') && (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {drug.name_en}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {drug.drug_class}
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeDrug(drug.id);
                }}
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                aria-label={`${drug.name_kr} 삭제`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
