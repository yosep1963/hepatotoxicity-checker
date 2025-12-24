import type {
  Drug,
  CKDStage,
  NephrotoxicityGrade,
  RenalDosingRecommendation,
  RiskLevel,
} from '../types';

// 신독성 등급 -> 위험도 매핑
const nephroGradeRiskMap: Record<NephrotoxicityGrade, RiskLevel> = {
  N1: 'very_high',
  N2: 'high',
  N3: 'moderate',
  N4: 'low',
  N5: 'very_low',
};

// 신독성 등급 -> 점수 매핑
const nephroGradeScoreMap: Record<NephrotoxicityGrade, number> = {
  N1: 100,
  N2: 75,
  N3: 50,
  N4: 25,
  N5: 10,
};

// CKD 단계 -> 배율 매핑
const ckdMultiplier: Record<CKDStage, number> = {
  normal: 0.5,
  G2: 0.8,
  G3a: 1.0,
  G3b: 1.3,
  G4: 1.7,
  G5: 2.0,
  dialysis: 2.5,
};

/**
 * CKD 단계에 따른 용량 권고 반환
 */
export function getRenalDosingForCKD(
  drug: Drug,
  ckdStage: CKDStage
): RenalDosingRecommendation | null {
  if (!drug.renal_dosing) {
    return null;
  }

  if (ckdStage === 'normal') {
    return {
      dose: drug.renal_dosing.gfr_90_plus || '일반 용량',
      recommendation: '신기능 정상 - 일반 권장 용량 사용',
      caution: drug.nephrotoxicity?.grade === 'N1' || drug.nephrotoxicity?.grade === 'N2'
        ? '신독성 위험 약물 - 정기적 Cr/eGFR 모니터링 권장'
        : undefined,
    };
  }

  // CKD 단계별 용량 조회
  const dosingMap: Record<CKDStage, string> = {
    normal: drug.renal_dosing.gfr_90_plus,
    G2: drug.renal_dosing.gfr_60_89,
    G3a: drug.renal_dosing.gfr_45_59,
    G3b: drug.renal_dosing.gfr_30_44,
    G4: drug.renal_dosing.gfr_15_29,
    G5: drug.renal_dosing.gfr_below_15,
    dialysis: drug.renal_dosing.dialysis,
  };

  const dose = dosingMap[ckdStage] || '정보 없음';

  return {
    dose,
    recommendation: '',
    caution: dose.includes('금기') || dose.includes('회피')
      ? `CKD ${ckdStage}에서 사용 주의`
      : undefined,
  };
}

/**
 * 신독성 관련 경고 생성
 */
export function generateRenalWarnings(drug: Drug, ckdStage: CKDStage): string[] {
  const warnings: string[] = [];

  if (!drug.nephrotoxicity) {
    return warnings;
  }

  // 등급 기반 경고
  if (drug.nephrotoxicity.grade === 'N1') {
    warnings.push('Well-known nephrotoxin - 신독성 고위험 약물');
  } else if (drug.nephrotoxicity.grade === 'N2') {
    warnings.push('Highly likely nephrotoxin - 신독성 위험 높음');
  }

  // CKD 단계별 경고
  if (ckdStage !== 'normal') {
    const dosing = getRenalDosingForCKD(drug, ckdStage);
    if (dosing?.dose.includes('금기') || dosing?.dose.includes('회피')) {
      warnings.push(`CKD ${ckdStage}에서 사용 회피 권장`);
    }
  }

  // 패턴별 경고
  if (drug.nephrotoxicity.pattern === 'hemodynamic' && ckdStage !== 'normal') {
    warnings.push('혈역학적 신손상 패턴 - 저혈압/탈수 시 위험 증가');
  }

  if (drug.nephrotoxicity.pattern === 'acute_tubular_necrosis') {
    warnings.push('급성 세뇨관 괴사 위험 - 용량 및 투여기간 주의');
  }

  // 투석 관련
  if (ckdStage === 'dialysis') {
    if (drug.nephrotoxicity.dialyzable === false) {
      warnings.push('투석으로 제거되지 않음 - 축적 주의');
    } else if (drug.nephrotoxicity.dialyzable === true) {
      warnings.push('투석으로 제거됨 - 투석 후 보충 용량 고려');
    }
  }

  return warnings;
}

/**
 * 단일 약물의 신독성 분석
 */
export function analyzeRenalToxicity(
  drug: Drug,
  ckdStage: CKDStage
): {
  renalRiskLevel: RiskLevel | 'unknown';
  renalDosing: RenalDosingRecommendation | null;
  renalWarnings: string[];
} {
  if (!drug.nephrotoxicity) {
    return {
      renalRiskLevel: 'unknown',
      renalDosing: getRenalDosingForCKD(drug, ckdStage),
      renalWarnings: [],
    };
  }

  return {
    renalRiskLevel: nephroGradeRiskMap[drug.nephrotoxicity.grade],
    renalDosing: getRenalDosingForCKD(drug, ckdStage),
    renalWarnings: generateRenalWarnings(drug, ckdStage),
  };
}

/**
 * 전체 신독성 위험도 점수 계산 (0-100)
 */
export function calculateRenalRiskScore(drugs: Drug[], ckdStage: CKDStage): number {
  const nephrotoxicDrugs = drugs.filter(d => d.nephrotoxicity);
  if (nephrotoxicDrugs.length === 0) return 0;

  // 가중 평균 계산
  const totalScore = nephrotoxicDrugs.reduce((sum, drug) => {
    const baseScore = nephroGradeScoreMap[drug.nephrotoxicity!.grade];
    const multiplier = ckdMultiplier[ckdStage];
    return sum + baseScore * multiplier;
  }, 0);

  const avgScore = totalScore / nephrotoxicDrugs.length;

  // N1 등급 약물 다수 사용 시 추가 페널티
  const gradeN1Count = drugs.filter(d => d.nephrotoxicity?.grade === 'N1').length;
  const gradeN2Count = drugs.filter(d => d.nephrotoxicity?.grade === 'N2').length;
  const multiDrugPenalty = gradeN1Count > 1 ? 20 : gradeN2Count > 1 ? 10 : 0;

  return Math.min(100, Math.round(avgScore + multiDrugPenalty));
}

/**
 * 신독성 등급별 약물 수 집계
 */
export function getRenalGradeCounts(drugs: Drug[]) {
  return {
    gradeN1Count: drugs.filter(d => d.nephrotoxicity?.grade === 'N1').length,
    gradeN2Count: drugs.filter(d => d.nephrotoxicity?.grade === 'N2').length,
    gradeN3Count: drugs.filter(d => d.nephrotoxicity?.grade === 'N3').length,
    gradeN4Count: drugs.filter(d => d.nephrotoxicity?.grade === 'N4').length,
    gradeN5Count: drugs.filter(d => d.nephrotoxicity?.grade === 'N5').length,
  };
}

/**
 * 신독성 위험도 레이블 (한글)
 */
export function getRenalRiskLevelLabel(riskLevel: RiskLevel | 'unknown'): string {
  const labels: Record<RiskLevel | 'unknown', string> = {
    very_high: '매우 높음',
    high: '높음',
    moderate: '보통',
    low: '낮음',
    very_low: '매우 낮음',
    unknown: '정보 없음',
  };
  return labels[riskLevel];
}

/**
 * 신독성 등급 레이블 (한글)
 */
export function getNephroGradeLabel(grade: NephrotoxicityGrade): string {
  const labels: Record<NephrotoxicityGrade, string> = {
    N1: 'N1등급 (Well-known)',
    N2: 'N2등급 (Highly likely)',
    N3: 'N3등급 (Probable)',
    N4: 'N4등급 (Possible)',
    N5: 'N5등급 (Unlikely)',
  };
  return labels[grade];
}

/**
 * 신독성 등급 설명 (한글)
 */
export function getNephroGradeDescription(grade: NephrotoxicityGrade): string {
  const descriptions: Record<NephrotoxicityGrade, string> = {
    N1: '잘 알려진 신독성 약물',
    N2: '신독성 가능성 높음',
    N3: '신독성 가능성 있음',
    N4: '신독성 가능성 낮음',
    N5: '신독성 거의 없음',
  };
  return descriptions[grade];
}

/**
 * CKD 단계 레이블 (한글)
 */
export function getCKDStageLabel(stage: CKDStage): string {
  const labels: Record<CKDStage, string> = {
    normal: '정상 (eGFR ≥90)',
    G2: 'CKD G2 (eGFR 60-89)',
    G3a: 'CKD G3a (eGFR 45-59)',
    G3b: 'CKD G3b (eGFR 30-44)',
    G4: 'CKD G4 (eGFR 15-29)',
    G5: 'CKD G5 (eGFR <15)',
    dialysis: '투석 중',
  };
  return labels[stage];
}

/**
 * CKD 단계 짧은 레이블
 */
export function getCKDStageShortLabel(stage: CKDStage): string {
  const labels: Record<CKDStage, string> = {
    normal: '정상',
    G2: 'G2',
    G3a: 'G3a',
    G3b: 'G3b',
    G4: 'G4',
    G5: 'G5',
    dialysis: '투석',
  };
  return labels[stage];
}

/**
 * 신손상 패턴 레이블 (한글)
 */
export function getNephroPatternLabel(pattern: string): string {
  const labels: Record<string, string> = {
    acute_tubular_necrosis: '급성 세뇨관 괴사',
    acute_interstitial: '급성 간질성 신염',
    glomerular: '사구체 손상',
    hemodynamic: '혈역학적 손상',
    obstructive: '폐쇄성 손상',
    mixed: '복합 손상',
  };
  return labels[pattern] || pattern;
}
