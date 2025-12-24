// 간독성 등급
export type HepatotoxicityGrade = 'A' | 'B' | 'C' | 'D' | 'E';

// 신독성 등급
export type NephrotoxicityGrade = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

// Child-Pugh 등급
export type ChildPughGrade = 'normal' | 'A' | 'B' | 'C';

// CKD 단계
export type CKDStage = 'normal' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | 'dialysis';

// 음주력
export type AlcoholHistory = 'none' | 'social' | 'chronic';

// 경고 레벨
export type AlertLevel = 'critical' | 'high' | 'medium' | 'low';

// 경고 카테고리
export type AlertCategory = 'hepato' | 'renal' | 'combined';

// 심각도
export type Severity = 'high' | 'moderate' | 'low';

// 간손상 패턴
export type HepatotoxicityPattern = 'hepatocellular' | 'cholestatic' | 'mixed';

// 신손상 패턴
export type NephrotoxicityPattern =
  | 'acute_tubular_necrosis'  // 급성 세뇨관 괴사
  | 'acute_interstitial'       // 급성 간질성 신염
  | 'glomerular'               // 사구체 손상
  | 'hemodynamic'              // 혈역학적 (신혈류 감소)
  | 'obstructive'              // 폐쇄성 (결정 형성)
  | 'mixed';

// 간독성 정보 (간소화)
export interface Hepatotoxicity {
  grade: HepatotoxicityGrade;
  pattern: HepatotoxicityPattern;
  mechanism: string;
  dose_dependent: boolean;
}

// Child-Pugh 등급별 용량 조절 (분석 결과용)
export interface ChildPughDosing {
  dose: string;
  recommendation?: string;
  caution?: string;
  alternative?: string[];
}

// 간경변 용량 조절 (간소화 - 단순 문자열)
export interface CirrhosisDosing {
  child_A: string;
  child_B: string;
  child_C: string;
}

// 신독성 정보
export interface Nephrotoxicity {
  grade: NephrotoxicityGrade;
  pattern: NephrotoxicityPattern;
  mechanism: string;
  dose_dependent: boolean;
  dialyzable?: boolean;  // 투석으로 제거 가능 여부
}

// CKD 단계별 용량 조절
export interface RenalDosing {
  gfr_90_plus: string;    // 정상/G1
  gfr_60_89: string;      // G2
  gfr_45_59: string;      // G3a
  gfr_30_44: string;      // G3b
  gfr_15_29: string;      // G4
  gfr_below_15: string;   // G5
  dialysis: string;       // 투석
}

// CKD 단계별 용량 권고 (분석 결과용)
export interface RenalDosingRecommendation {
  dose: string;
  recommendation?: string;
  caution?: string;
  alternative?: string[];
}

// 약물 정보 (간소화)
export interface Drug {
  id: string;
  name_en: string;
  name_kr: string;
  brand_names_kr: string[];
  brand_names_en?: string[];
  drug_class: string;
  drug_class_en?: string;
  hepatotoxicity: Hepatotoxicity;
  cirrhosis_dosing: CirrhosisDosing;
  clinical_pearls: string[];
  // 신독성 관련 필드 (선택적 - 호환성 유지)
  nephrotoxicity?: Nephrotoxicity;
  renal_dosing?: RenalDosing;
  renal_clinical_pearls?: string[];
}

// 특수 경고 규칙
export interface SpecialAlert {
  id: string;
  condition: string;
  alert_level: AlertLevel;
  title: string;
  message: string;
  icon: string;
  required_drugs?: string[];
  required_drug_classes?: string[];
  required_child_pugh?: ChildPughGrade[];
  min_grade_a_drugs?: number;
  // 신독성 관련 필드
  alert_category?: AlertCategory;
  required_ckd_stage?: CKDStage[];
  min_grade_n1_drugs?: number;
}

// 트리거된 경고
export interface TriggeredAlert extends SpecialAlert {
  triggered_by: string[];
}

// 위험도 레벨 타입
export type RiskLevel = 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';

// 약물 분석 결과
export interface DrugAnalysis {
  drug: Drug;
  // 간독성 분석 (기존)
  riskLevel: RiskLevel;
  dosing: ChildPughDosing | null;
  warnings: string[];
  // 신독성 분석 (신규)
  renalRiskLevel?: RiskLevel | 'unknown';
  renalDosing?: RenalDosingRecommendation | null;
  renalWarnings?: string[];
}

// 전체 분석 결과
export interface AnalysisResult {
  drugs: DrugAnalysis[];
  // 간독성 위험도 (기존)
  riskScore: number;
  // 신독성 위험도 (신규)
  renalRiskScore: number;
  alerts: TriggeredAlert[];
  summary: {
    totalDrugs: number;
    // 간독성 등급별 수
    gradeACount: number;
    gradeBCount: number;
    gradeCCount: number;
    gradeDCount: number;
    gradeECount: number;
    // 신독성 등급별 수
    gradeN1Count: number;
    gradeN2Count: number;
    gradeN3Count: number;
    gradeN4Count: number;
    gradeN5Count: number;
  };
}

// 독성 탭 타입
export type ToxicityTab = 'hepato' | 'renal';

// 앱 상태
export interface AppState {
  selectedDrugs: Drug[];
  childPughGrade: ChildPughGrade;
  alcoholHistory: AlcoholHistory;
  darkMode: boolean;
  // 신독성 관련 상태 (신규)
  ckdStage: CKDStage;
  activeTab: ToxicityTab;
}

// 관리자 인증 상태
export interface AdminAuth {
  isAuthenticated: boolean;
  sessionExpiry?: number;
}

// 내보내기 옵션 (간소화)
export interface ExportOptions {
  format: 'pdf' | 'text';
  includeDetails: boolean;
}
