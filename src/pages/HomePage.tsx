import Layout from '../components/layout/Layout';
import DrugSearchInput from '../components/drug/DrugSearchInput';
import DrugList from '../components/drug/DrugList';
import PatientStatusSelector from '../components/patient/PatientStatusSelector';
import AnalysisResult from '../components/analysis/AnalysisResult';
import ExportButton from '../components/export/ExportButton';
export default function HomePage() {

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Patient Status */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              환자 상태
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

          {/* Analysis Results */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              분석 결과
            </h2>
            <AnalysisResult />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          본 정보는 참고용이며, 최종 처방은 환자 상태에 따라 전문의 판단하에 결정되어야 합니다.
        </p>
        <p className="mt-2">
          약물 정보 출처: LiverTox (NIH), 대한간학회, 각 약물 허가사항
        </p>
      </footer>
    </Layout>
  );
}
