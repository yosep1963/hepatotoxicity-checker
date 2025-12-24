import { useApp } from '../context/AppContext';

export function useDarkMode() {
  const { state, toggleDarkMode } = useApp();

  return {
    isDarkMode: state.darkMode,
    toggleDarkMode,
  };
}
