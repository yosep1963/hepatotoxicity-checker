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

  // Sort by alert level severity
  const levelOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  triggeredAlerts.sort((a, b) => levelOrder[a.alert_level] - levelOrder[b.alert_level]);

  return triggeredAlerts;
}

/**
 * Get alert level color class
 */
export function getAlertLevelColor(level: SpecialAlert['alert_level']): string {
  const colors = {
    critical: 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    high: 'bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
    medium: 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    low: 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  };
  return colors[level];
}

/**
 * Get alert level label in Korean
 */
export function getAlertLevelLabel(level: SpecialAlert['alert_level']): string {
  const labels = {
    critical: '위험',
    high: '주의',
    medium: '참고',
    low: '정보',
  };
  return labels[level];
}

/**
 * Get icon name for alert
 */
export function getAlertIconName(iconName: string): string {
  // Map icon names to lucide-react icon names
  const iconMap: Record<string, string> = {
    'alert-triangle': 'AlertTriangle',
    'brain': 'Brain',
    'pill': 'Pill',
    'ban': 'Ban',
    'block': 'Ban',
    'activity': 'Activity',
    'shield-alert': 'ShieldAlert',
    'droplet': 'Droplet',
    'alert-octagon': 'AlertOctagon',
    'info': 'Info',
    'warning': 'AlertTriangle',
    'kidney': 'Activity',
    'liver': 'Activity',
    'gallbladder': 'Droplet',
  };
  return iconMap[iconName] || 'AlertCircle';
}
