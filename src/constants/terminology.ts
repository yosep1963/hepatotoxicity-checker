// src/constants/terminology.ts
// 용어 변환 - 의료 용어를 중립적 용어로 변환

// 금지 용어 → 사용할 용어 매핑
export const TERMINOLOGY = {
  // 대상 관련
  patient: '사용자',
  환자: '사용자',

  // 행위 관련
  diagnosis: '정보 조회',
  진단: '정보 조회',
  assessment: '정보 확인',
  평가: '정보 확인',
  evaluation: '정보 확인',
  검사: '조회',
  test: '조회',
  monitoring: '참고',
  모니터링: '참고',

  // 결과 관련
  score: '수치',
  점수: '수치',
  grade: '분류',
  등급: '분류',

  // 상태 관련
  warning: '참고',
  경고: '참고',
  alert: '정보',
  주의: '참고',
  critical: '참고',
  위험: '참고',

  // 권고 관련
  recommendation: '참고 정보',
  권고: '참고 정보',

  // 독성 관련
  hepatotoxicity: '간 관련 정보',
  간독성: '간 관련 정보',
  nephrotoxicity: '신 관련 정보',
  신독성: '신 관련 정보',
  toxicity: '관련 정보',
  독성: '관련 정보',

  // 위험도 관련
  risk: '참고',
  위험도: '참고 수치',
  riskLevel: '참고 수준',
  위험수준: '참고 수준',
};

// UI 라벨 변환
export const UI_LABELS = {
  // 탭 라벨
  hepatoTab: '간 관련 정보',
  renalTab: '신 관련 정보',

  // 섹션 제목
  riskSummary: '참고 수치 요약',
  alertList: '참고 정보',
  drugAnalysis: '약물 정보',
  dosingInfo: '일반 참고 정보',

  // 버튼/액션
  analyze: '정보 조회',
  export: '내보내기',

  // 상태 선택
  patientStatus: '조회 조건',
  childPughGrade: '간 기능 분류',
  ckdStage: '신 기능 분류',
};

// NOTE: INFO_LEVEL_LABELS는 colors.ts로 이동

// 위험도 라벨 (중립적 표현)
export const RISK_LEVEL_LABELS = {
  very_high: '높음',
  high: '중간',
  moderate: '보통',
  low: '낮음',
  very_low: '낮음',
};

// 등급 라벨 (의료 용어 제거)
export const GRADE_LABELS = {
  hepato: {
    A: 'A분류',
    B: 'B분류',
    C: 'C분류',
    D: 'D분류',
    E: 'E분류',
  },
  renal: {
    N1: 'N1분류',
    N2: 'N2분류',
    N3: 'N3분류',
    N4: 'N4분류',
    N5: 'N5분류',
  },
};
