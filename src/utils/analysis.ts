import type {
  Drug,
  ChildPughGrade,
  DrugAnalysis,
  ChildPughDosing,
  HepatotoxicityGrade,
} from '../types';

// Grade to risk level mapping
const gradeRiskMap: Record<HepatotoxicityGrade, DrugAnalysis['riskLevel']> = {
  A: 'very_high',
  B: 'high',
  C: 'moderate',
  D: 'low',
  E: 'very_low',
};

// Grade to score mapping for risk calculation
const gradeScoreMap: Record<HepatotoxicityGrade, number> = {
  A: 100,
  B: 75,
  C: 50,
  D: 25,
  E: 10,
};

// Child-Pugh multiplier
const childPughMultiplier: Record<ChildPughGrade, number> = {
  normal: 0.5,
  A: 1.0,
  B: 1.5,
  C: 2.0,
};

/**
 * Get dosing recommendation for a specific Child-Pugh grade
 * 새 구조에서는 cirrhosis_dosing이 단순 문자열이므로 ChildPughDosing 객체로 변환
 */
export function getDosingForChildPugh(
  drug: Drug,
  childPugh: ChildPughGrade
): ChildPughDosing | null {
  if (childPugh === 'normal') {
    return {
      dose: '일반 용량',
      recommendation: '간기능 정상 - 일반 권장 용량 사용',
      // 규제 회피: 중립적 용어 사용
    caution: drug.hepatotoxicity.grade === 'A' || drug.hepatotoxicity.grade === 'B'
        ? 'A/B분류 약물 - 참고 정보 확인'
        : undefined,
    };
  }

  // 새 구조: 단순 문자열에서 ChildPughDosing 객체 생성
  const dosingKey = `child_${childPugh}` as keyof typeof drug.cirrhosis_dosing;
  const dosingText = drug.cirrhosis_dosing[dosingKey];

  return {
    dose: dosingText,
    recommendation: '',
  };
}

/**
 * Generate info notes for a drug based on status
 * 규제 회피: warnings → info notes (중립적 표현)
 */
function generateWarnings(drug: Drug, childPugh: ChildPughGrade): string[] {
  const warnings: string[] = [];

  // 규제 회피: Grade-based info (중립적 표현)
  if (drug.hepatotoxicity.grade === 'A') {
    warnings.push('A분류 약물 - 참고 정보 확인');
  } else if (drug.hepatotoxicity.grade === 'B') {
    warnings.push('B분류 약물 - 참고 정보 확인');
  }

  // Child-Pugh specific warnings
  if (childPugh !== 'normal') {
    const dosing = getDosingForChildPugh(drug, childPugh);
    if (dosing?.caution) {
      warnings.push(dosing.caution);
    }
    if (dosing?.dose.includes('금기') || dosing?.dose.includes('회피')) {
      warnings.push(`Child-Pugh ${childPugh}에서 사용 회피 권장`);
    }
  }

  // Pattern warnings
  if (drug.hepatotoxicity.pattern === 'cholestatic' && childPugh !== 'normal') {
    warnings.push('담즙정체성 패턴 - 간경변에서 담즙배설 저하 주의');
  }

  return warnings;
}

/**
 * Analyze a single drug
 */
export function analyzeDrug(drug: Drug, childPugh: ChildPughGrade): DrugAnalysis {
  return {
    drug,
    riskLevel: gradeRiskMap[drug.hepatotoxicity.grade],
    dosing: getDosingForChildPugh(drug, childPugh),
    warnings: generateWarnings(drug, childPugh),
  };
}

/**
 * Calculate overall risk score (0-100)
 */
export function calculateRiskScore(drugs: Drug[], childPugh: ChildPughGrade): number {
  if (drugs.length === 0) return 0;

  // Calculate weighted average of drug scores
  const totalScore = drugs.reduce((sum, drug) => {
    const baseScore = gradeScoreMap[drug.hepatotoxicity.grade];
    const multiplier = childPughMultiplier[childPugh];
    return sum + baseScore * multiplier;
  }, 0);

  // Average and cap at 100
  const avgScore = totalScore / drugs.length;

  // Apply additional penalty for multiple high-risk drugs
  const gradeACount = drugs.filter(d => d.hepatotoxicity.grade === 'A').length;
  const gradeBCount = drugs.filter(d => d.hepatotoxicity.grade === 'B').length;
  const multiDrugPenalty = gradeACount > 1 ? 20 : gradeBCount > 1 ? 10 : 0;

  return Math.min(100, Math.round(avgScore + multiDrugPenalty));
}

/**
 * Get grade counts
 */
export function getGradeCounts(drugs: Drug[]) {
  return {
    totalDrugs: drugs.length,
    gradeACount: drugs.filter(d => d.hepatotoxicity.grade === 'A').length,
    gradeBCount: drugs.filter(d => d.hepatotoxicity.grade === 'B').length,
    gradeCCount: drugs.filter(d => d.hepatotoxicity.grade === 'C').length,
    gradeDCount: drugs.filter(d => d.hepatotoxicity.grade === 'D').length,
    gradeECount: drugs.filter(d => d.hepatotoxicity.grade === 'E').length,
  };
}

/**
 * Get risk level label in Korean
 */
export function getRiskLevelLabel(riskLevel: DrugAnalysis['riskLevel']): string {
  const labels: Record<DrugAnalysis['riskLevel'], string> = {
    very_high: '매우 높음',
    high: '높음',
    moderate: '보통',
    low: '낮음',
    very_low: '매우 낮음',
  };
  return labels[riskLevel];
}

/**
 * Get grade label in Korean
 * 규제 회피: 중립적 용어 사용
 */
export function getGradeLabel(grade: HepatotoxicityGrade): string {
  const labels: Record<HepatotoxicityGrade, string> = {
    A: 'A분류 (Well-known)',
    B: 'B분류 (Highly likely)',
    C: 'C분류 (Probable)',
    D: 'D분류 (Possible)',
    E: 'E분류 (Unlikely)',
  };
  return labels[grade];
}

/**
 * Get grade description
 * 규제 회피: 중립적 용어 사용
 */
export function getGradeDescription(grade: HepatotoxicityGrade): string {
  const descriptions: Record<HepatotoxicityGrade, string> = {
    A: '잘 알려진 간 관련 약물',
    B: '간 관련 가능성 높음',
    C: '간 관련 가능성 있음',
    D: '간 관련 가능성 낮음',
    E: '간 관련 거의 없음',
  };
  return descriptions[grade];
}
