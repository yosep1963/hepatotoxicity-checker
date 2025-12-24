import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { seedDatabase } from './db/database';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize database
    seedDatabase()
      .then(() => {
        setIsReady(true);
      })
      .catch(error => {
        console.error('Failed to initialize database:', error);
        setIsReady(true); // Continue anyway
      });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">데이터베이스 초기화 중...</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
