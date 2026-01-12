import type {
  Drug,
  ChildPughGrade,
  CKDStage,
  SpecialAlert,
  TriggeredAlert,
} from '../types';

/**
 * Check if a specific alert condition is met
 */
function checkAlertCondition(
  alert: SpecialAlert,
  drugs: Drug[],
  childPugh: ChildPughGrade,
  ckdStage: CKDStage = 'normal'
): { triggered: boolean; triggeredBy: string[] } {
  const triggeredBy: string[] = [];

  // Check required drugs (all must be present)
  if (alert.required_drugs && alert.required_drugs.length > 0) {
    const presentDrugs = alert.required_drugs.filter(drugId =>
      drugs.some(d => d.id === drugId)
    );

    // For drug combination alerts, all required drugs must be present
    if (alert.id === 'meropenem_valproate' ||
        alert.id === 'cipro_theophylline' ||
        alert.id === 'cipro_tizanidine' ||
        alert.id === 'allopurinol_azathioprine') {
      if (presentDrugs.length < alert.required_drugs.length) {
        return { triggered: false, triggeredBy: [] };
      }
      triggeredBy.push(...presentDrugs);
    } else {
      // For other alerts, at least one required drug must be present
      if (presentDrugs.length === 0) {
        return { triggered: false, triggeredBy: [] };
      }
      triggeredBy.push(...presentDrugs);
    }
  }

  // Check required Child-Pugh grade
  if (alert.required_child_pugh && alert.required_child_pugh.length > 0) {
    if (!alert.required_child_pugh.includes(childPugh)) {
      return { triggered: false, triggeredBy: [] };
    }
  }

  // Check for multiple grade A drugs (간독성)
  if (alert.min_grade_a_drugs) {
    const gradeADrugs = drugs.filter(d => d.hepatotoxicity.grade === 'A');
    if (gradeADrugs.length < alert.min_grade_a_drugs) {
      return { triggered: false, triggeredBy: [] };
    }
    triggeredBy.push(...gradeADrugs.map(d => d.id));
  }

  // Check for multiple grade N1 drugs (신독성)
  if (alert.min_grade_n1_drugs) {
    const gradeN1Drugs = drugs.filter(d => d.nephrotoxicity?.grade === 'N1');
    if (gradeN1Drugs.length < alert.min_grade_n1_drugs) {
      return { triggered: false, triggeredBy: [] };
    }
    triggeredBy.push(...gradeN1Drugs.map(d => d.id));
  }

  // Check required CKD stage
  if (alert.required_ckd_stage && alert.required_ckd_stage.length > 0) {
    if (!alert.required_ckd_stage.includes(ckdStage)) {
      return { triggered: false, triggeredBy: [] };
    }
  }

  // Check required drug classes
  if (alert.required_drug_classes && alert.required_drug_classes.length > 0) {
    const matchingDrugs = drugs.filter(d =>
      alert.required_drug_classes!.some(className =>
        d.drug_class.toLowerCase().includes(className.toLowerCase()) ||
        d.name_en.toLowerCase().includes(className.toLowerCase()) ||
        d.name_kr.includes(className)
      )
    );
    if (matchingDrugs.length === 0) {
      return { triggered: false, triggeredBy: [] };
    }
    triggeredBy.push(...matchingDrugs.map(d => d.id));
  }

  // If we have required drugs but no triggered drugs, don't trigger
  if ((alert.required_drugs && alert.required_drugs.length > 0) && triggeredBy.length === 0) {
    return { triggered: false, triggeredBy: [] };
  }

  return { triggered: true, triggeredBy: [...new Set(triggeredBy)] };
}

/**
 * Detect all triggered alerts for the selected drugs and patient status
 */
export function detectAlerts(
  drugs: Drug[],
  childPugh: ChildPughGrade,
  alerts: SpecialAlert[],
  ckdStage: CKDStage = 'normal'
): TriggeredAlert[] {
  if (drugs.length === 0) return [];

  const triggeredAlerts: TriggeredAlert[] = [];

  for (const alert of alerts) {
    const { triggered, triggeredBy } = checkAlertCondition(alert, drugs, childPugh, ckdStage);
    if (triggered) {
      triggeredAlerts.push({
        ...alert,
        triggered_by: triggeredBy,
      });
    }
  }

  // Sort by info level (규제 회피: info1~info4)
  const levelOrder = { info1: 0, info2: 1, info3: 2, info4: 3 };
  triggeredAlerts.sort((a, b) => levelOrder[a.alert_level] - levelOrder[b.alert_level]);

  return triggeredAlerts;
}

// NOTE: 색상과 라벨은 constants/colors.ts의 INFO_LEVEL_STYLES, INFO_LEVEL_LABELS 사용
