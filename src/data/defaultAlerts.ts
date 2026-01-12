import type { SpecialAlert } from '../types';
import { renalAlerts } from './renalAlerts';

// 간 관련 참고 정보 (규제 회피: 경고 → 정보)
const hepatoAlerts: SpecialAlert[] = [
  {
    id: 'nsaid_cirrhosis',
    condition: 'NSAIDs + 간경변(any)',
    alert_level: 'info2',  // 규제 회피: high → info2
    title: 'NSAIDs + 간경변 참고',
    message: '관련 참고 정보가 있습니다. 아세트아미노펜 저용량(2g/일 이하) 정보 확인.',
    icon: 'info',
    required_drugs: ['ibuprofen', 'naproxen', 'celecoxib'],
    required_child_pugh: ['A', 'B', 'C']
  },
  {
    id: 'benzo_cirrhosis',
    condition: '벤조디아제핀 + 간경변(any)',
    alert_level: 'info2',
    title: '진정제 + 간경변 참고',
    message: '관련 참고 정보가 있습니다. oxazepam, lorazepam 정보 확인.',
    icon: 'info',
    required_drugs: ['diazepam'],
    required_child_pugh: ['A', 'B', 'C']
  },
  {
    id: 'metronidazole_cirrhosis_bc',
    condition: 'Metronidazole + Child-Pugh B/C',
    alert_level: 'info2',
    title: 'Metronidazole 참고',
    message: '250mg q8-12h, 7일 이내 사용 정보 확인.',
    icon: 'info',
    required_drugs: ['metronidazole'],
    required_child_pugh: ['B', 'C']
  },
  {
    id: 'meropenem_valproate',
    condition: 'Meropenem + Valproic acid',
    alert_level: 'info1',  // 규제 회피: critical → info1
    title: '병용 참고 정보',
    message: '카바페넴과 발프로산 병용 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['meropenem', 'valproic_acid']
  },
  {
    id: 'vancomycin_hrs_risk',
    condition: 'Vancomycin + Child-Pugh C',
    alert_level: 'info3',  // 규제 회피: medium → info3
    title: 'Vancomycin 참고',
    message: 'Child-Pugh C에서 Vancomycin 관련 참고 정보. TDM 정보 확인.',
    icon: 'info',
    required_drugs: ['vancomycin'],
    required_child_pugh: ['C']
  },
  {
    id: 'fluoroquinolone_child_c',
    condition: 'Fluoroquinolone + Child-Pugh C',
    alert_level: 'info3',
    title: '퀴놀론 참고',
    message: 'Child-Pugh C에서 퀴놀론 관련 참고 정보.',
    icon: 'info',
    required_drugs: ['levofloxacin', 'ciprofloxacin'],
    required_child_pugh: ['C']
  },
  {
    id: 'ceftriaxone_child_c_long',
    condition: 'Ceftriaxone + Child-Pugh C',
    alert_level: 'info3',
    title: 'Ceftriaxone 참고',
    message: 'Cefotaxime 대안 정보 확인. 최대 2g/일 정보.',
    icon: 'info',
    required_drugs: ['ceftriaxone'],
    required_child_pugh: ['C']
  },
  {
    id: 'multiple_hepatotoxic',
    condition: '간 관련 A분류 약물 2개 이상',
    alert_level: 'info2',
    title: '복합 간 관련 참고',
    message: '간 관련 A분류 약물이 2개 이상입니다. 참고 정보를 확인하세요.',
    icon: 'info',
    min_grade_a_drugs: 2
  },
  {
    id: 'cipro_theophylline',
    condition: 'Ciprofloxacin + Theophylline',
    alert_level: 'info1',
    title: '병용 참고',
    message: 'CYP1A2 관련 병용 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['ciprofloxacin'],
    required_drug_classes: ['Theophylline']
  },
  {
    id: 'cipro_tizanidine',
    condition: 'Ciprofloxacin + Tizanidine',
    alert_level: 'info1',
    title: '병용 참고',
    message: '티자니딘 병용 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['ciprofloxacin'],
    required_drug_classes: ['Tizanidine']
  },
  {
    id: 'ceftriaxone_calcium',
    condition: 'Ceftriaxone + 칼슘함유수액',
    alert_level: 'info1',
    title: 'IV 투여 참고',
    message: '동일 IV 라인 투여 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['ceftriaxone'],
    required_drug_classes: ['칼슘수액']
  },
  {
    id: 'allopurinol_azathioprine',
    condition: 'Allopurinol + Azathioprine',
    alert_level: 'info1',
    alert_category: 'hepato',
    title: 'Azathioprine 참고',
    message: 'Allopurinol과 아자티오프린 병용 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['azathioprine'],
    required_drug_classes: ['Allopurinol']
  }
];

// 간 관련 경고에 카테고리 추가
const hepatoAlertsWithCategory = hepatoAlerts.map(alert => ({
  ...alert,
  alert_category: alert.alert_category || 'hepato' as const
}));

// 전체 참고 정보 규칙 (간 관련 + 신 관련)
export const defaultAlerts: SpecialAlert[] = [
  ...hepatoAlertsWithCategory,
  ...renalAlerts
];
