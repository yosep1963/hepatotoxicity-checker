// src/constants/colors.ts
// 규제 회피: 모든 색상 정의를 중립적 색상으로 통합 관리

import type { HepatotoxicityGrade, NephrotoxicityGrade, InfoLevel } from '../types';

// 간 관련 분류 색상 (카드 배경/테두리)
export const HEPATO_GRADE_COLORS: Record<HepatotoxicityGrade, string> = {
  A: 'border-blue-600 bg-blue-50 dark:bg-blue-900/20',
  B: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  C: 'border-slate-500 bg-slate-50 dark:bg-slate-900/20',
  D: 'border-gray-400 bg-gray-50 dark:bg-gray-900/20',
  E: 'border-gray-300 bg-gray-50 dark:bg-gray-900/20',
};

// 간 관련 분류 배지 색상
export const HEPATO_GRADE_BADGE_COLORS: Record<HepatotoxicityGrade, string> = {
  A: 'bg-blue-700',
  B: 'bg-blue-500',
  C: 'bg-slate-500',
  D: 'bg-gray-500',
  E: 'bg-gray-400',
};

// 신 관련 분류 색상 (카드 배경/테두리)
export const RENAL_GRADE_COLORS: Record<NephrotoxicityGrade, string> = {
  N1: 'border-purple-600 bg-purple-50 dark:bg-purple-900/20',
  N2: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
  N3: 'border-slate-500 bg-slate-50 dark:bg-slate-900/20',
  N4: 'border-gray-400 bg-gray-50 dark:bg-gray-900/20',
  N5: 'border-gray-300 bg-gray-50 dark:bg-gray-900/20',
};

// 신 관련 분류 배지 색상
export const RENAL_GRADE_BADGE_COLORS: Record<NephrotoxicityGrade, string> = {
  N1: 'bg-purple-700',
  N2: 'bg-purple-500',
  N3: 'bg-slate-500',
  N4: 'bg-gray-500',
  N5: 'bg-gray-400',
};

// 정보 레벨 스타일 (Alert용)
export const INFO_LEVEL_STYLES: Record<InfoLevel, string> = {
  info1: 'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  info2: 'bg-slate-50 border-slate-400 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200',
  info3: 'bg-gray-50 border-gray-400 text-gray-800 dark:bg-gray-800/20 dark:text-gray-200',
  info4: 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800/20 dark:text-gray-300',
};

// 정보 레벨 라벨
export const INFO_LEVEL_LABELS: Record<InfoLevel, string> = {
  info1: '참고',
  info2: '참고',
  info3: '정보',
  info4: '정보',
};

// 참고 수치 단계 (RiskSummary용)
export const SCORE_LEVELS = {
  getLabel: (score: number): string => {
    if (score >= 80) return '5단계';
    if (score >= 60) return '4단계';
    if (score >= 40) return '3단계';
    if (score >= 20) return '2단계';
    return '1단계';
  },
  getTextColor: (score: number): string => {
    if (score >= 80) return 'text-blue-700 dark:text-blue-300';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-slate-600 dark:text-slate-400';
    if (score >= 20) return 'text-gray-600 dark:text-gray-400';
    return 'text-gray-500 dark:text-gray-500';
  },
  getStrokeColor: (score: number): string => {
    if (score >= 80) return 'stroke-blue-700';
    if (score >= 60) return 'stroke-blue-500';
    if (score >= 40) return 'stroke-slate-500';
    if (score >= 20) return 'stroke-gray-500';
    return 'stroke-gray-400';
  },
};

// RiskSummary 분류 정보
export const HEPATO_GRADE_INFO = [
  { grade: 'A' as HepatotoxicityGrade, color: 'bg-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { grade: 'B' as HepatotoxicityGrade, color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { grade: 'C' as HepatotoxicityGrade, color: 'bg-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
  { grade: 'D' as HepatotoxicityGrade, color: 'bg-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
  { grade: 'E' as HepatotoxicityGrade, color: 'bg-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
];

export const RENAL_GRADE_INFO = [
  { grade: 'N1' as NephrotoxicityGrade, color: 'bg-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { grade: 'N2' as NephrotoxicityGrade, color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  { grade: 'N3' as NephrotoxicityGrade, color: 'bg-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
  { grade: 'N4' as NephrotoxicityGrade, color: 'bg-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
  { grade: 'N5' as NephrotoxicityGrade, color: 'bg-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
];
