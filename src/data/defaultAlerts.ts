import type { SpecialAlert } from '../types';
import { renalAlerts } from './renalAlerts';

// 간독성 관련 경고
const hepatoAlerts: SpecialAlert[] = [
  {
    id: 'nsaid_cirrhosis',
    condition: 'NSAIDs + 간경변(any)',
    alert_level: 'high',
    title: 'NSAIDs + 간경변 주의',
    message: '신기능 악화 및 상부위장관 출혈 위험 현저히 증가. 가급적 회피하고 아세트아미노펜 저용량(2g/일 이하) 고려.',
    icon: 'alert-triangle',
    required_drugs: ['ibuprofen', 'naproxen', 'celecoxib'],
    required_child_pugh: ['A', 'B', 'C']
  },
  {
    id: 'benzo_cirrhosis',
    condition: '벤조디아제핀 + 간경변(any)',
    alert_level: 'high',
    title: '진정제 + 간경변 주의',
    message: '간성뇌증 유발/악화 위험. 반감기 현저히 연장. 불가피 시 oxazepam, lorazepam 선호 (간대사 적음).',
    icon: 'brain',
    required_drugs: ['diazepam'],
    required_child_pugh: ['A', 'B', 'C']
  },
  {
    id: 'metronidazole_cirrhosis_bc',
    condition: 'Metronidazole + Child-Pugh B/C',
    alert_level: 'high',
    title: 'Metronidazole 감량 필수',
    message: '반드시 50% 감량! 반감기 2-3배 연장. 250mg q8-12h, 7일 이내 사용. 신경독성(말초신경병, 뇌병증) 주의.',
    icon: 'pill',
    required_drugs: ['metronidazole'],
    required_child_pugh: ['B', 'C']
  },
  {
    id: 'meropenem_valproate',
    condition: 'Meropenem + Valproic acid',
    alert_level: 'critical',
    title: '절대 병용 금기',
    message: '카바페넴이 발프로산 농도를 급격히 감소시켜 경련 위험. 대체 항경련제 또는 대체 항생제 필수.',
    icon: 'ban',
    required_drugs: ['meropenem', 'valproic_acid']
  },
  {
    id: 'vancomycin_hrs_risk',
    condition: 'Vancomycin + Child-Pugh C',
    alert_level: 'medium',
    title: 'Vancomycin 신독성 주의',
    message: '간신증후군 고위험 환자에서 신독성 주의. Teicoplanin이 더 안전할 수 있음. TDM 필수.',
    icon: 'activity',
    required_drugs: ['vancomycin'],
    required_child_pugh: ['C']
  },
  {
    id: 'fluoroquinolone_child_c',
    condition: 'Fluoroquinolone + Child-Pugh C',
    alert_level: 'medium',
    title: '퀴놀론 간독성 주의',
    message: '급성 간손상 보고 있음. LFT 주 2회 모니터링. 가능하면 다른 계열 항생제 고려.',
    icon: 'shield-alert',
    required_drugs: ['levofloxacin', 'ciprofloxacin'],
    required_child_pugh: ['C']
  },
  {
    id: 'ceftriaxone_child_c_long',
    condition: 'Ceftriaxone + Child-Pugh C',
    alert_level: 'medium',
    title: 'Ceftriaxone 장기사용 주의',
    message: '담즙배설 의존으로 담즙슬러지/가성담석 위험. Cefotaxime 대안 고려. 최대 2g/일.',
    icon: 'droplet',
    required_drugs: ['ceftriaxone'],
    required_child_pugh: ['C']
  },
  {
    id: 'multiple_hepatotoxic',
    condition: '간독성 A등급 약물 2개 이상',
    alert_level: 'high',
    title: '복합 간독성 위험',
    message: '간독성 위험이 높은 약물이 2개 이상입니다. 정기적인 LFT 모니터링 필수. 대안 약물 고려.',
    icon: 'alert-octagon',
    min_grade_a_drugs: 2
  },
  {
    id: 'cipro_theophylline',
    condition: 'Ciprofloxacin + Theophylline',
    alert_level: 'critical',
    title: '병용 주의',
    message: 'CYP1A2 억제로 테오필린 농도 상승. 독성 위험. 용량 조절 또는 대체 항생제.',
    icon: 'alert-triangle',
    required_drugs: ['ciprofloxacin'],
    required_drug_classes: ['Theophylline']
  },
  {
    id: 'cipro_tizanidine',
    condition: 'Ciprofloxacin + Tizanidine',
    alert_level: 'critical',
    title: '병용 금기',
    message: '티자니딘 독성(심한 저혈압, 과진정) 위험. 절대 병용 금기.',
    icon: 'ban',
    required_drugs: ['ciprofloxacin'],
    required_drug_classes: ['Tizanidine']
  },
  {
    id: 'ceftriaxone_calcium',
    condition: 'Ceftriaxone + 칼슘함유수액',
    alert_level: 'critical',
    title: '동일라인 투여 금기',
    message: '침전물 형성으로 폐/신장 손상 위험. 동일 IV 라인 투여 절대 금기.',
    icon: 'ban',
    required_drugs: ['ceftriaxone'],
    required_drug_classes: ['칼슘수액']
  },
  {
    id: 'allopurinol_azathioprine',
    condition: 'Allopurinol + Azathioprine',
    alert_level: 'critical',
    alert_category: 'hepato',
    title: 'Azathioprine 감량 필수',
    message: 'Allopurinol이 아자티오프린 대사를 억제하여 골수억제 및 간독성 위험 증가. 아자티오프린 75% 감량 필수.',
    icon: 'alert-octagon',
    required_drugs: ['azathioprine'],
    required_drug_classes: ['Allopurinol']
  }
];

// 간독성 경고에 카테고리 추가
const hepatoAlertsWithCategory = hepatoAlerts.map(alert => ({
  ...alert,
  alert_category: alert.alert_category || 'hepato' as const
}));

// 전체 경고 규칙 (간독성 + 신독성)
export const defaultAlerts: SpecialAlert[] = [
  ...hepatoAlertsWithCategory,
  ...renalAlerts
];
