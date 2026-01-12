import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Settings, Shield } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              {/* 규제 회피: 앱 이름 변경 */}
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                PharmRef
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                약물 정보 참조
              </p>
            </div>
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Admin link */}
            <Link
              to={isAdmin ? '/' : '/admin'}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isAdmin ? '홈으로' : '관리자'}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
