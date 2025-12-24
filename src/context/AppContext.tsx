import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Drug, ChildPughGrade, AlcoholHistory, CKDStage, ToxicityTab } from '../types';

// State type
interface AppState {
  selectedDrugs: Drug[];
  childPughGrade: ChildPughGrade;
  alcoholHistory: AlcoholHistory;
  darkMode: boolean;
  isLoading: boolean;
  // 신독성 관련 상태
  ckdStage: CKDStage;
  activeTab: ToxicityTab;
}

// Action types
type AppAction =
  | { type: 'ADD_DRUG'; payload: Drug }
  | { type: 'REMOVE_DRUG'; payload: string }
  | { type: 'CLEAR_DRUGS' }
  | { type: 'SET_CHILD_PUGH'; payload: ChildPughGrade }
  | { type: 'SET_ALCOHOL_HISTORY'; payload: AlcoholHistory }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  // 신독성 관련 액션
  | { type: 'SET_CKD_STAGE'; payload: CKDStage }
  | { type: 'SET_ACTIVE_TAB'; payload: ToxicityTab };

// Initial state
const initialState: AppState = {
  selectedDrugs: [],
  childPughGrade: 'normal',
  alcoholHistory: 'none',
  darkMode: false,
  isLoading: true,
  // 신독성 관련 초기값
  ckdStage: 'normal',
  activeTab: 'hepato',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_DRUG':
      // Prevent duplicates
      if (state.selectedDrugs.some(d => d.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        selectedDrugs: [...state.selectedDrugs, action.payload],
      };
    case 'REMOVE_DRUG':
      return {
        ...state,
        selectedDrugs: state.selectedDrugs.filter(d => d.id !== action.payload),
      };
    case 'CLEAR_DRUGS':
      return {
        ...state,
        selectedDrugs: [],
      };
    case 'SET_CHILD_PUGH':
      return {
        ...state,
        childPughGrade: action.payload,
      };
    case 'SET_ALCOHOL_HISTORY':
      return {
        ...state,
        alcoholHistory: action.payload,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'SET_DARK_MODE':
      return {
        ...state,
        darkMode: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    // 신독성 관련 케이스
    case 'SET_CKD_STAGE':
      return {
        ...state,
        ckdStage: action.payload,
      };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addDrug: (drug: Drug) => void;
  removeDrug: (drugId: string) => void;
  clearDrugs: () => void;
  setChildPugh: (grade: ChildPughGrade) => void;
  setAlcoholHistory: (history: AlcoholHistory) => void;
  toggleDarkMode: () => void;
  // 신독성 관련 메서드
  setCKDStage: (stage: CKDStage) => void;
  setActiveTab: (tab: ToxicityTab) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      dispatch({ type: 'SET_DARK_MODE', payload: savedDarkMode === 'true' });
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch({ type: 'SET_DARK_MODE', payload: prefersDark });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Sync dark mode with document and localStorage
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(state.darkMode));
  }, [state.darkMode]);

  // Actions
  const addDrug = (drug: Drug) => dispatch({ type: 'ADD_DRUG', payload: drug });
  const removeDrug = (drugId: string) => dispatch({ type: 'REMOVE_DRUG', payload: drugId });
  const clearDrugs = () => dispatch({ type: 'CLEAR_DRUGS' });
  const setChildPugh = (grade: ChildPughGrade) => dispatch({ type: 'SET_CHILD_PUGH', payload: grade });
  const setAlcoholHistory = (history: AlcoholHistory) => dispatch({ type: 'SET_ALCOHOL_HISTORY', payload: history });
  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });
  // 신독성 관련 액션
  const setCKDStage = (stage: CKDStage) => dispatch({ type: 'SET_CKD_STAGE', payload: stage });
  const setActiveTab = (tab: ToxicityTab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addDrug,
        removeDrug,
        clearDrugs,
        setChildPugh,
        setAlcoholHistory,
        toggleDarkMode,
        setCKDStage,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
