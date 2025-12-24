import type { SpecialAlert } from '../types';

export const renalAlerts: SpecialAlert[] = [
  // === 신독성 관련 경고 ===
  {
    id: 'nsaid_ckd',
    condition: 'NSAIDs + CKD (G3 이상)',
    alert_level: 'high',
    alert_category: 'renal',
    title: 'NSAIDs + 신기능저하 주의',
    message: '급성신손상 위험. eGFR 30 미만에서는 금기. 단기간 사용 시에도 신기능 모니터링 필수. 아세트아미노펜 대안 고려.',
    icon: 'alert-triangle',
    required_drugs: ['ibuprofen', 'naproxen', 'celecoxib', 'diclofenac', 'ketorolac', 'meloxicam', 'indomethacin'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5', 'dialysis']
  },
  {
    id: 'aminoglycoside_ckd',
    condition: 'Aminoglycosides + CKD',
    alert_level: 'critical',
    alert_category: 'renal',
    title: 'Aminoglycoside 신독성 위험',
    message: '축적 신독성 위험 매우 높음. 용량조절/TDM 필수. 대안 항생제 고려. 투여 간격 연장 필요.',
    icon: 'alert-octagon',
    required_drugs: ['gentamicin', 'amikacin', 'tobramycin'],
    required_ckd_stage: ['G2', 'G3a', 'G3b', 'G4', 'G5']
  },
  {
    id: 'vancomycin_ckd',
    condition: 'Vancomycin + CKD',
    alert_level: 'high',
    alert_category: 'renal',
    title: 'Vancomycin 신독성 주의',
    message: '신기능 저하 시 축적 위험. 반드시 TDM 필요. Trough 15-20 유지. 대안으로 Teicoplanin 고려.',
    icon: 'activity',
    required_drugs: ['vancomycin'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5', 'dialysis']
  },
  {
    id: 'vancomycin_aminoglycoside',
    condition: 'Vancomycin + Aminoglycoside 병용',
    alert_level: 'critical',
    alert_category: 'renal',
    title: '병용 시 신독성 상승작용',
    message: '두 약제 모두 신독성 고위험. 병용 시 급성신손상 위험 현저히 증가. 반드시 대안 고려. 불가피 시 신기능 집중 모니터링.',
    icon: 'ban',
    required_drugs: ['vancomycin', 'gentamicin']
  },
  {
    id: 'vancomycin_amikacin',
    condition: 'Vancomycin + Amikacin 병용',
    alert_level: 'critical',
    alert_category: 'renal',
    title: '병용 시 신독성 상승작용',
    message: '두 약제 모두 신독성 고위험. 병용 시 급성신손상 위험 현저히 증가. 반드시 대안 고려.',
    icon: 'ban',
    required_drugs: ['vancomycin', 'amikacin']
  },
  {
    id: 'acei_arb_ckd',
    condition: 'ACEi/ARB + CKD G4/G5',
    alert_level: 'high',
    alert_category: 'renal',
    title: 'ACEi/ARB 고칼륨혈증 주의',
    message: '고칼륨혈증 및 급성신손상 위험. K+ 정기 모니터링. Cr 30% 이상 상승 시 중단 고려.',
    icon: 'activity',
    required_drugs: ['lisinopril', 'enalapril', 'ramipril', 'losartan', 'valsartan', 'irbesartan', 'candesartan'],
    required_ckd_stage: ['G4', 'G5']
  },
  {
    id: 'metformin_ckd',
    condition: 'Metformin + CKD G4/G5',
    alert_level: 'critical',
    alert_category: 'renal',
    title: 'Metformin 유산증 위험',
    message: 'eGFR 30 미만에서 금기. 유산증 위험. 다른 당뇨약으로 변경 필수.',
    icon: 'alert-octagon',
    required_drugs: ['metformin'],
    required_ckd_stage: ['G4', 'G5', 'dialysis']
  },
  {
    id: 'lithium_ckd',
    condition: 'Lithium + CKD G4/G5',
    alert_level: 'high',
    alert_category: 'renal',
    title: 'Lithium 독성 위험',
    message: '신기능 저하 시 리튬 축적 위험. 혈중농도 모니터링 강화. 용량 감량 필수. 대안 고려.',
    icon: 'brain',
    required_drugs: ['lithium'],
    required_ckd_stage: ['G4', 'G5']
  },
  {
    id: 'acyclovir_ckd',
    condition: 'Acyclovir + CKD',
    alert_level: 'medium',
    alert_category: 'renal',
    title: 'Acyclovir 결정뇨 주의',
    message: '신독성 및 결정뇨 위험. 충분한 수액 공급 필수. 용량 조절 필요. 느린 정주.',
    icon: 'droplet',
    required_drugs: ['acyclovir', 'valacyclovir'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5']
  },
  {
    id: 'contrast_ckd',
    condition: '조영제 사용 예정 + CKD',
    alert_level: 'high',
    alert_category: 'renal',
    title: '조영제 유발 신손상 주의',
    message: '충분한 수액 전처치 필수. 저삼투압/등삼투압 조영제 선택. 시술 후 48-72시간 신기능 추적.',
    icon: 'activity',
    required_drug_classes: ['조영제', 'contrast'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5']
  },
  {
    id: 'multiple_nephrotoxic',
    condition: '신독성 N1등급 약물 2개 이상',
    alert_level: 'high',
    alert_category: 'renal',
    title: '복합 신독성 위험',
    message: '신독성 위험이 높은 약물이 2개 이상입니다. 정기적인 Cr/eGFR 모니터링 필수. 대안 고려.',
    icon: 'alert-octagon',
    min_grade_n1_drugs: 2
  },
  {
    id: 'hepatorenal_risk',
    condition: 'Child-Pugh C + CKD G4/G5',
    alert_level: 'critical',
    alert_category: 'combined',
    title: '간신증후군 고위험',
    message: '비대상성 간경변 + 신부전 상태. 약물 선택 매우 제한적. 전문가 협진 권고. 이뇨제/NSAIDs 금기.',
    icon: 'shield-alert',
    required_child_pugh: ['C'],
    required_ckd_stage: ['G4', 'G5', 'dialysis']
  },
  {
    id: 'spironolactone_ckd',
    condition: 'Spironolactone + CKD G4/G5',
    alert_level: 'high',
    alert_category: 'renal',
    title: '고칼륨혈증 위험',
    message: '심한 고칼륨혈증 위험. K+ 주 2회 이상 모니터링. 용량 감량 또는 중단 고려.',
    icon: 'activity',
    required_drugs: ['spironolactone'],
    required_ckd_stage: ['G4', 'G5']
  },
  {
    id: 'digoxin_ckd',
    condition: 'Digoxin + CKD',
    alert_level: 'medium',
    alert_category: 'renal',
    title: 'Digoxin 축적 주의',
    message: '신배설 약물. 축적 독성 위험. 용량 감량 필수. TDM 권고.',
    icon: 'activity',
    required_drugs: ['digoxin'],
    required_ckd_stage: ['G3b', 'G4', 'G5', 'dialysis']
  },
  {
    id: 'gadolinium_ckd',
    condition: 'Gadolinium 조영제 + CKD G4/G5',
    alert_level: 'critical',
    alert_category: 'renal',
    title: '신장성 전신 섬유증(NSF) 위험',
    message: 'eGFR 30 미만에서 가도리늄 금기. NSF 위험. 대안 영상검사 고려.',
    icon: 'ban',
    required_drug_classes: ['gadolinium', 'Gadolinium', '가도리늄'],
    required_ckd_stage: ['G4', 'G5', 'dialysis']
  }
];
