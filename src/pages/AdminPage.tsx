import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAllDrugs, useAllAlerts } from '../hooks/useDrugs';
import {
  deleteDrug,
  resetDatabase,
  exportData,
  importData,
} from '../db/database';
import type { Drug, HepatotoxicityGrade } from '../types';
import {
  Lock,
  Unlock,
  Pencil,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';

const ADMIN_PASSWORD = 'hepatox2024'; // 실제 환경에서는 환경변수 사용

const gradeBadgeColors: Record<HepatotoxicityGrade, string> = {
  A: 'bg-red-600',
  B: 'bg-orange-500',
  C: 'bg-yellow-500',
  D: 'bg-lime-500',
  E: 'bg-green-500',
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { drugs, isLoading: isDrugsLoading } = useAllDrugs();
  const { alerts, isLoading: isAlertsLoading } = useAllAlerts();

  const isLoading = isDrugsLoading || isAlertsLoading;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Check session
  useEffect(() => {
    const session = sessionStorage.getItem('adminAuth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hepatox_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('내보내기에 실패했습니다');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (confirm('기존 데이터를 덮어쓰시겠습니까?')) {
        await importData(data);
        alert('가져오기 완료');
        window.location.reload();
      }
    } catch (err) {
      console.error('Import failed:', err);
      alert('가져오기에 실패했습니다. 파일 형식을 확인하세요.');
    }
    e.target.value = '';
  };

  const handleReset = async () => {
    if (confirm('정말 기본 데이터로 초기화하시겠습니까? 모든 변경사항이 삭제됩니다.')) {
      await resetDatabase();
      alert('초기화 완료');
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDrug(id);
    setShowDeleteConfirm(null);
  };

  const filteredDrugs = drugs.filter(drug =>
    drug.name_kr.includes(searchQuery) ||
    drug.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drug.brand_names_kr.some(b => b.includes(searchQuery))
  );

  // Login Screen
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                관리자 로그인
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                약물 데이터를 관리하려면 비밀번호를 입력하세요
              </p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                로그인
              </button>
            </form>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">데이터 로딩 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Admin Panel
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              약물 데이터 관리
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              총 {drugs.length}개 약물, {alerts.length}개 경고 규칙
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
            >
              <Download className="w-4 h-4" />
              내보내기
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              가져오기
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
            >
              <Unlock className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="약물명, 영문명, 상품명 검색..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Drug List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    약물명
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    분류
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    등급
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDrugs.map(drug => (
                  <tr
                    key={drug.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {drug.name_kr}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {drug.name_en}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {drug.drug_class}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-bold text-white rounded ${
                          gradeBadgeColors[drug.hepatotoxicity.grade]
                        }`}
                      >
                        {drug.hepatotoxicity.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedDrug(drug);
                            setIsEditing(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="편집"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(drug.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDrugs.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 약물이 없습니다'}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                삭제 확인
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                이 약물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal (Simple View) */}
        {isEditing && selectedDrug && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80"
              onClick={() => {
                setIsEditing(false);
                setSelectedDrug(null);
              }}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                약물 정보: {selectedDrug.name_kr}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">영문명: </span>
                  <span className="text-gray-600 dark:text-gray-400">{selectedDrug.name_en}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">분류: </span>
                  <span className="text-gray-600 dark:text-gray-400">{selectedDrug.drug_class}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">간독성 등급: </span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-bold text-white rounded ${gradeBadgeColors[selectedDrug.hepatotoxicity.grade]}`}>
                    {selectedDrug.hepatotoxicity.grade}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">패턴: </span>
                  <span className="text-gray-600 dark:text-gray-400">{selectedDrug.hepatotoxicity.pattern}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">기전: </span>
                  <span className="text-gray-600 dark:text-gray-400">{selectedDrug.hepatotoxicity.mechanism}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 mb-4">
                * 상세 편집 기능은 추후 업데이트 예정입니다
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedDrug(null);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
