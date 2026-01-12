import { useState } from 'react';
import Layout from '../components/layout/Layout';
import DrugSearchInput from '../components/drug/DrugSearchInput';
import DrugList from '../components/drug/DrugList';
import PatientStatusSelector from '../components/patient/PatientStatusSelector';
import AnalysisResult from '../components/analysis/AnalysisResult';
import ExportButton from '../components/export/ExportButton';
import { DisclaimerModal, DisclaimerBanner } from '../components/common';
import { RESULT_NOTICE } from '../constants/disclaimer';

export default function HomePage() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Show loading state while checking disclaimer
  if (!disclaimerAccepted) {
    return (
      <>
        <DisclaimerModal onAccept={() => setDisclaimerAccepted(true)} />
        {/* Empty layout while modal is showing */}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
      </>
    );
  }

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* 조회 조건 (규제 회피: "환자 상태" → "조회 조건") */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              조회 조건
            </h2>
            <PatientStatusSelector />
          </section>

          {/* Drug Search */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              약물 선택
            </h2>
            <div className="space-y-4">
              <DrugSearchInput />
              <DrugList />
            </div>
          </section>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Export Buttons */}
          <div className="flex justify-end">
            <ExportButton />
          </div>

          {/* Analysis Results (규제 회피: "분석 결과" → "조회 결과") */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              조회 결과
            </h2>
            <AnalysisResult />
            {/* 면책조항 배너 */}
            <DisclaimerBanner variant="subtle" />
          </section>
        </div>
      </div>

      {/* Footer - 규제 회피: 중립적 문구 */}
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          {RESULT_NOTICE.medium}
        </p>
        <p className="mt-2">
          정보 출처: 공개된 의학 문헌 및 교육 자료
        </p>
      </footer>
    </Layout>
  );
}
