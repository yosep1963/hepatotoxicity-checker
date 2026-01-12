import type { SpecialAlert } from '../types';

// 신 관련 참고 정보 (규제 회피: 경고 → 정보)
export const renalAlerts: SpecialAlert[] = [
  // === 신 관련 참고 정보 ===
  {
    id: 'nsaid_ckd',
    condition: 'NSAIDs + CKD (G3 이상)',
    alert_level: 'info2',  // 규제 회피: high → info2
    alert_category: 'renal',
    title: 'NSAIDs + 신기능 관련 참고',
    message: '신 관련 참고 정보가 있습니다. 아세트아미노펜 대안 정보 확인.',
    icon: 'info',
    required_drugs: ['ibuprofen', 'naproxen', 'celecoxib', 'diclofenac', 'ketorolac', 'meloxicam', 'indomethacin'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5', 'dialysis']
  },
  {
    id: 'aminoglycoside_ckd',
    condition: 'Aminoglycosides + CKD',
    alert_level: 'info1',  // 규제 회피: critical → info1
    alert_category: 'renal',
    title: 'Aminoglycoside 참고',
    message: '용량조절/TDM 관련 참고 정보가 있습니다. 투여 간격 정보 확인.',
    icon: 'info',
    required_drugs: ['gentamicin', 'amikacin', 'tobramycin'],
    required_ckd_stage: ['G2', 'G3a', 'G3b', 'G4', 'G5']
  },
  {
    id: 'vancomycin_ckd',
    condition: 'Vancomycin + CKD',
    alert_level: 'info2',  // 규제 회피: high → info2
    alert_category: 'renal',
    title: 'Vancomycin 참고',
    message: 'TDM 관련 참고 정보. Trough 15-20 정보 확인. Teicoplanin 대안 정보.',
    icon: 'info',
    required_drugs: ['vancomycin'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5', 'dialysis']
  },
  {
    id: 'vancomycin_aminoglycoside',
    condition: 'Vancomycin + Aminoglycoside 병용',
    alert_level: 'info1',  // 규제 회피: critical → info1
    alert_category: 'renal',
    title: '병용 참고 정보',
    message: '두 약제 병용 관련 참고 정보가 있습니다. 대안 정보 확인.',
    icon: 'info',
    required_drugs: ['vancomycin', 'gentamicin']
  },
  {
    id: 'vancomycin_amikacin',
    condition: 'Vancomycin + Amikacin 병용',
    alert_level: 'info1',  // 규제 회피: critical → info1
    alert_category: 'renal',
    title: '병용 참고 정보',
    message: '두 약제 병용 관련 참고 정보가 있습니다. 대안 정보 확인.',
    icon: 'info',
    required_drugs: ['vancomycin', 'amikacin']
  },
  {
    id: 'acei_arb_ckd',
    condition: 'ACEi/ARB + CKD G4/G5',
    alert_level: 'info2',  // 규제 회피: high → info2
    alert_category: 'renal',
    title: 'ACEi/ARB 참고',
    message: 'K+ 모니터링 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['lisinopril', 'enalapril', 'ramipril', 'losartan', 'valsartan', 'irbesartan', 'candesartan'],
    required_ckd_stage: ['G4', 'G5']
  },
  {
    id: 'metformin_ckd',
    condition: 'Metformin + CKD G4/G5',
    alert_level: 'info1',  // 규제 회피: critical → info1
    alert_category: 'renal',
    title: 'Metformin 참고',
    message: 'eGFR 30 미만 관련 참고 정보가 있습니다. 대안 정보 확인.',
    icon: 'info',
    required_drugs: ['metformin'],
    required_ckd_stage: ['G4', 'G5', 'dialysis']
  },
  {
    id: 'lithium_ckd',
    condition: 'Lithium + CKD G4/G5',
    alert_level: 'info2',  // 규제 회피: high → info2
    alert_category: 'renal',
    title: 'Lithium 참고',
    message: '혈중농도 모니터링 관련 참고 정보가 있습니다. 용량 정보 확인.',
    icon: 'info',
    required_drugs: ['lithium'],
    required_ckd_stage: ['G4', 'G5']
  },
  {
    id: 'acyclovir_ckd',
    condition: 'Acyclovir + CKD',
    alert_level: 'info3',  // 규제 회피: medium → info3
    alert_category: 'renal',
    title: 'Acyclovir 참고',
    message: '수액 공급 및 용량 조절 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['acyclovir', 'valacyclovir'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5']
  },
  {
    id: 'contrast_ckd',
    condition: '조영제 사용 예정 + CKD',
    alert_level: 'info2',  // 규제 회피: high → info2
    alert_category: 'renal',
    title: '조영제 관련 참고',
    message: '수액 전처치 및 조영제 선택 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drug_classes: ['조영제', 'contrast'],
    required_ckd_stage: ['G3a', 'G3b', 'G4', 'G5']
  },
  {
    id: 'multiple_nephrotoxic',
    condition: '신 관련 N1분류 약물 2개 이상',
    alert_level: 'info2',  // 규제 회피: high → info2
    alert_category: 'renal',
    title: '복합 신 관련 참고',
    message: '신 관련 N1분류 약물이 2개 이상입니다. 참고 정보를 확인하세요.',
    icon: 'info',
    min_grade_n1_drugs: 2
  },
  {
    id: 'hepatorenal_risk',
    condition: 'Child-Pugh C + CKD G4/G5',
    alert_level: 'info1',  // 규제 회피: critical → info1
    alert_category: 'combined',
    title: '간신 관련 참고',
    message: '간 및 신 기능 관련 복합 참고 정보가 있습니다. 전문가 상담 권장.',
    icon: 'info',
    required_child_pugh: ['C'],
    required_ckd_stage: ['G4', 'G5', 'dialysis']
  },
  {
    id: 'spironolactone_ckd',
    condition: 'Spironolactone + CKD G4/G5',
    alert_level: 'info2',  // 규제 회피: high → info2
    alert_category: 'renal',
    title: 'Spironolactone 참고',
    message: 'K+ 모니터링 관련 참고 정보가 있습니다. 용량 정보 확인.',
    icon: 'info',
    required_drugs: ['spironolactone'],
    required_ckd_stage: ['G4', 'G5']
  },
  {
    id: 'digoxin_ckd',
    condition: 'Digoxin + CKD',
    alert_level: 'info3',  // 규제 회피: medium → info3
    alert_category: 'renal',
    title: 'Digoxin 참고',
    message: '용량 조절 및 TDM 관련 참고 정보가 있습니다.',
    icon: 'info',
    required_drugs: ['digoxin'],
    required_ckd_stage: ['G3b', 'G4', 'G5', 'dialysis']
  },
  {
    id: 'gadolinium_ckd',
    condition: 'Gadolinium 조영제 + CKD G4/G5',
    alert_level: 'info1',  // 규제 회피: critical → info1
    alert_category: 'renal',
    title: 'Gadolinium 참고',
    message: 'eGFR 30 미만에서 가도리늄 관련 참고 정보. 대안 영상검사 정보 확인.',
    icon: 'info',
    required_drug_classes: ['gadolinium', 'Gadolinium', '가도리늄'],
    required_ckd_stage: ['G4', 'G5', 'dialysis']
  }
];
