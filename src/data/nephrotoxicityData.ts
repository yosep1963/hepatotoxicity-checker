import type { Nephrotoxicity, RenalDosing } from '../types';

// 약물별 신독성 데이터
// ID는 drugs-database-complete.json의 id와 일치해야 함
export const nephrotoxicityData: Record<string, {
  nephrotoxicity: Nephrotoxicity;
  renal_dosing: RenalDosing;
  renal_clinical_pearls: string[];
}> = {
  // === N1등급: 잘 알려진 신독성 약물 ===
  gentamicin: {
    nephrotoxicity: {
      grade: 'N1',
      pattern: 'acute_tubular_necrosis',
      mechanism: '세뇨관 상피세포 직접 독성',
      dose_dependent: true,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '5-7mg/kg q24h (확장 간격 투여)',
      gfr_60_89: '5-7mg/kg q36h',
      gfr_45_59: '5-7mg/kg q48h',
      gfr_30_44: '용량/간격 조절, TDM 필수',
      gfr_15_29: '부하용량 후 TDM 기반 조절',
      gfr_below_15: '부하용량 후 TDM 필수',
      dialysis: '투석 후 보충 용량'
    },
    renal_clinical_pearls: [
      'TDM 필수: Trough < 1-2 mcg/mL',
      '7일 이상 사용 시 신독성 위험 급증',
      '탈수, 저혈압 시 신독성 증가'
    ]
  },
  amikacin: {
    nephrotoxicity: {
      grade: 'N1',
      pattern: 'acute_tubular_necrosis',
      mechanism: '세뇨관 상피세포 직접 독성',
      dose_dependent: true,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '15-20mg/kg q24h',
      gfr_60_89: '15-20mg/kg q36h',
      gfr_45_59: '15-20mg/kg q48h',
      gfr_30_44: 'TDM 기반 조절',
      gfr_15_29: 'TDM 필수',
      gfr_below_15: '부하용량 후 TDM 필수',
      dialysis: '투석 후 7.5mg/kg 보충'
    },
    renal_clinical_pearls: [
      'TDM 필수: Trough < 5 mcg/mL',
      '이뇨제 병용 시 신독성 증가',
      'Vancomycin 병용 금기'
    ]
  },
  vancomycin: {
    nephrotoxicity: {
      grade: 'N1',
      pattern: 'acute_tubular_necrosis',
      mechanism: '산화 스트레스, 세뇨관 독성',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '15-20mg/kg q8-12h',
      gfr_60_89: '15-20mg/kg q12h',
      gfr_45_59: '15-20mg/kg q24h',
      gfr_30_44: '15-20mg/kg q24-48h',
      gfr_15_29: '15-20mg/kg q48-72h',
      gfr_below_15: '15-20mg/kg 로딩 후 TDM',
      dialysis: '투석 후 15-20mg/kg'
    },
    renal_clinical_pearls: [
      'TDM 필수: Trough 15-20 mcg/mL (중증감염)',
      'Aminoglycoside 병용 시 신독성 상승작용',
      'AUC/MIC 모니터링 권장'
    ]
  },
  amphotericin_b: {
    nephrotoxicity: {
      grade: 'N1',
      pattern: 'acute_tubular_necrosis',
      mechanism: '세뇨관 상피막 투과성 변화',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '0.5-1mg/kg/day',
      gfr_60_89: '용량 조절 불필요, 신기능 집중 모니터링',
      gfr_45_59: '격일 투여 고려',
      gfr_30_44: '격일 투여 또는 liposomal 제제로 변경',
      gfr_15_29: 'Liposomal 제제 권장',
      gfr_below_15: 'Liposomal 제제만',
      dialysis: 'Liposomal 제제, 용량 조절 불필요'
    },
    renal_clinical_pearls: [
      '충분한 수액 전처치 필수 (NS 500-1000mL)',
      '저칼륨/저마그네슘혈증 모니터링',
      'Liposomal 제제가 신독성 적음'
    ]
  },

  // === N2등급: 신독성 가능성 높음 ===
  ibuprofen: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'hemodynamic',
      mechanism: '프로스타글란딘 억제로 신혈류 감소',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량, 신기능 모니터링',
      gfr_45_59: '단기간 사용만, 대안 고려',
      gfr_30_44: '금기 - 아세트아미노펜 대안',
      gfr_15_29: '금기',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '탈수 상태에서 급성신손상 위험 급증',
      'ACEi/ARB 병용 시 Triple Whammy 주의',
      '심부전 환자에서 수분저류 악화'
    ]
  },
  naproxen: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'hemodynamic',
      mechanism: '프로스타글란딘 억제로 신혈류 감소',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량, 신기능 모니터링',
      gfr_45_59: '50% 감량, 단기간',
      gfr_30_44: '금기',
      gfr_15_29: '금기',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '반감기가 길어 축적 위험',
      '고령자에서 특히 주의'
    ]
  },
  celecoxib: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'hemodynamic',
      mechanism: 'COX-2 억제로 신혈류 감소',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량, 신기능 모니터링',
      gfr_45_59: '100mg bid 이하',
      gfr_30_44: '가급적 회피',
      gfr_15_29: '금기',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      'COX-2 선택적이나 신독성은 비선택적 NSAIDs와 유사',
      '심혈관 위험도 고려'
    ]
  },
  diclofenac: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'hemodynamic',
      mechanism: '프로스타글란딘 억제',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '50% 감량 고려',
      gfr_45_59: '금기',
      gfr_30_44: '금기',
      gfr_15_29: '금기',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '급성 신손상 위험 높은 NSAIDs',
      '주사제 사용 시 특히 주의'
    ]
  },
  ketorolac: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'hemodynamic',
      mechanism: '강력한 프로스타글란딘 억제',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '30mg IV q6h (최대 5일)',
      gfr_60_89: '15mg IV q6h, 최대 3일',
      gfr_45_59: '금기',
      gfr_30_44: '금기',
      gfr_15_29: '금기',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '가장 강력한 NSAIDs - 신독성 위험 높음',
      '5일 이상 사용 금기',
      '수술 후 단기간만 사용'
    ]
  },
  metformin: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'mixed',
      mechanism: '신배설 약물, 축적 시 유산증',
      dose_dependent: true,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량 (최대 2550mg/일)',
      gfr_60_89: '통상용량 (최대 2000mg/일)',
      gfr_45_59: '최대 1000mg/일',
      gfr_30_44: '최대 500mg/일, 신기능 악화 시 중단',
      gfr_15_29: '금기',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '조영제 사용 전후 48시간 중단',
      '급성질환 시 일시 중단 (sick day rule)',
      '유산증 증상: 구역, 복통, 저혈압'
    ]
  },
  acyclovir: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'obstructive',
      mechanism: '신장내 결정 침전',
      dose_dependent: true,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '투여간격 12h',
      gfr_30_44: '투여간격 24h',
      gfr_15_29: '50% 감량, 24h 간격',
      gfr_below_15: '50% 감량, 48h 간격',
      dialysis: '투석 후 보충 용량'
    },
    renal_clinical_pearls: [
      '충분한 수액 공급 필수',
      '느린 정주 (1시간 이상)',
      '요산 상승 시 결정뇨 위험 증가'
    ]
  },
  valacyclovir: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'obstructive',
      mechanism: '활성 대사체(acyclovir) 결정 침전',
      dose_dependent: true,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '50% 감량',
      gfr_30_44: '50% 감량, 간격 연장',
      gfr_15_29: '75% 감량',
      gfr_below_15: '500mg q24h',
      dialysis: '투석 후 500mg'
    },
    renal_clinical_pearls: [
      '고용량 사용 시 신경독성도 주의',
      '충분한 수분 섭취 권고'
    ]
  },
  lithium: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'acute_interstitial',
      mechanism: '만성 간질성 신염, 신성 요붕증',
      dose_dependent: true,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '25% 감량',
      gfr_45_59: '50% 감량',
      gfr_30_44: '50% 감량, 농도 집중 모니터링',
      gfr_15_29: '75% 감량, 대안 고려',
      gfr_below_15: '금기, 대안 필수',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '혈중농도 정기 모니터링 필수',
      'NSAIDs, ACEi/ARB, 이뇨제 병용 주의',
      '탈수 시 독성 급증'
    ]
  },
  cyclosporine: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'hemodynamic',
      mechanism: '수입세동맥 수축, 만성 신손상',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '신기능 집중 모니터링',
      gfr_45_59: '용량 감량 고려',
      gfr_30_44: '최소 유효 용량',
      gfr_15_29: '대안 고려',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '혈중농도 모니터링 필수 (Trough)',
      'Tacrolimus로 전환 고려',
      '신독성 약물 병용 금기'
    ]
  },
  tacrolimus: {
    nephrotoxicity: {
      grade: 'N2',
      pattern: 'hemodynamic',
      mechanism: '수입세동맥 수축',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '신기능 모니터링',
      gfr_45_59: '용량 조절 고려',
      gfr_30_44: '최소 유효 용량',
      gfr_15_29: '대안 고려',
      gfr_below_15: '대안 필수',
      dialysis: '용량 조절 불필요'
    },
    renal_clinical_pearls: [
      '혈중농도 모니터링 필수',
      'Cyclosporine보다 신독성 적음',
      '고칼륨혈증 모니터링'
    ]
  },

  // === N3등급: 신독성 가능성 있음 ===
  lisinopril: {
    nephrotoxicity: {
      grade: 'N3',
      pattern: 'hemodynamic',
      mechanism: '사구체 여과압 감소',
      dose_dependent: false,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '50% 감량으로 시작',
      gfr_30_44: '25% 감량으로 시작',
      gfr_15_29: '저용량으로 시작, 신중히 증량',
      gfr_below_15: '2.5mg/일로 시작',
      dialysis: '투석 후 투여'
    },
    renal_clinical_pearls: [
      '치료 시작 후 Cr 30% 이상 상승 시 중단 고려',
      '고칼륨혈증 주의',
      '당뇨병성 신증에서 신보호 효과'
    ]
  },
  enalapril: {
    nephrotoxicity: {
      grade: 'N3',
      pattern: 'hemodynamic',
      mechanism: '사구체 여과압 감소',
      dose_dependent: false,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '50% 감량',
      gfr_30_44: '50-75% 감량',
      gfr_15_29: '75% 감량',
      gfr_below_15: '2.5mg/일',
      dialysis: '투석 후 투여'
    },
    renal_clinical_pearls: [
      'Cr/K+ 정기 모니터링',
      '양측 신동맥협착에서 금기'
    ]
  },
  losartan: {
    nephrotoxicity: {
      grade: 'N3',
      pattern: 'hemodynamic',
      mechanism: '사구체 여과압 감소',
      dose_dependent: false,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '통상용량',
      gfr_30_44: '감량 불필요',
      gfr_15_29: '감량 불필요, 주의 관찰',
      gfr_below_15: '주의하여 사용',
      dialysis: '감량 불필요'
    },
    renal_clinical_pearls: [
      'ARB는 ACEi보다 고칼륨혈증 위험 낮음',
      'CKD에서 신보호 효과'
    ]
  },
  ciprofloxacin: {
    nephrotoxicity: {
      grade: 'N3',
      pattern: 'acute_interstitial',
      mechanism: '간질성 신염 (드물게)',
      dose_dependent: false,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '250-500mg q12h',
      gfr_30_44: '250-500mg q18h',
      gfr_15_29: '250-500mg q24h',
      gfr_below_15: '250-500mg q24h 투석 후',
      dialysis: '투석으로 제거됨'
    },
    renal_clinical_pearls: [
      '결정뇨 예방위해 충분한 수분 섭취',
      '마그네슘/칼슘 제제와 간격 두고 투여'
    ]
  },
  levofloxacin: {
    nephrotoxicity: {
      grade: 'N3',
      pattern: 'acute_interstitial',
      mechanism: '간질성 신염 (드물게)',
      dose_dependent: false,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '750mg 로딩 후 500mg q24h',
      gfr_30_44: '750mg 로딩 후 500mg q48h',
      gfr_15_29: '750mg 로딩 후 500mg q48h',
      gfr_below_15: '500mg 로딩 후 250mg q48h',
      dialysis: '투석으로 제거 안됨'
    },
    renal_clinical_pearls: [
      '신기능에 따른 용량 조절 필수',
      '힘줄 손상 위험 (고령, 스테로이드 병용 시)'
    ]
  },
  ceftriaxone: {
    nephrotoxicity: {
      grade: 'N4',
      pattern: 'obstructive',
      mechanism: '담즙 배설, 칼슘염 침전 (드물게)',
      dose_dependent: false,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '통상용량',
      gfr_30_44: '통상용량',
      gfr_15_29: '통상용량 (최대 2g/일)',
      gfr_below_15: '최대 2g/일',
      dialysis: '용량 조절 불필요'
    },
    renal_clinical_pearls: [
      '신기능에 따른 용량 조절 불필요',
      '칼슘 함유 수액과 동일 라인 투여 금기'
    ]
  },
  spironolactone: {
    nephrotoxicity: {
      grade: 'N3',
      pattern: 'mixed',
      mechanism: '고칼륨혈증 유발',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량, K+ 모니터링',
      gfr_45_59: '25mg/일로 시작',
      gfr_30_44: '25mg 격일',
      gfr_15_29: '금기 또는 전문가 상담',
      gfr_below_15: '금기',
      dialysis: '금기'
    },
    renal_clinical_pearls: [
      '고칼륨혈증 주 2회 이상 모니터링',
      'ACEi/ARB 병용 시 특히 주의',
      'K+ > 5.5 시 중단 고려'
    ]
  },
  digoxin: {
    nephrotoxicity: {
      grade: 'N4',
      pattern: 'mixed',
      mechanism: '신배설, 축적독성',
      dose_dependent: true,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '75% 용량',
      gfr_45_59: '50% 용량',
      gfr_30_44: '50% 용량, TDM',
      gfr_15_29: '25-50% 용량, TDM 필수',
      gfr_below_15: '25% 용량, TDM 필수',
      dialysis: '용량 조절 불필요'
    },
    renal_clinical_pearls: [
      '혈중농도 모니터링 (목표: 0.5-1.0 ng/mL)',
      '독성 증상: 오심, 시야장애, 서맥',
      '저칼륨혈증 시 독성 증가'
    ]
  },

  // === N5등급: 신독성 거의 없음 ===
  acetaminophen: {
    nephrotoxicity: {
      grade: 'N5',
      pattern: 'mixed',
      mechanism: '드물게 급성 신손상',
      dose_dependent: true,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량 (최대 4g/일)',
      gfr_60_89: '통상용량',
      gfr_45_59: '통상용량',
      gfr_30_44: '투여간격 6h 이상',
      gfr_15_29: '투여간격 8h 이상',
      gfr_below_15: '투여간격 8h 이상',
      dialysis: '투석 후 보충'
    },
    renal_clinical_pearls: [
      'CKD 환자에서도 안전하게 사용 가능',
      'NSAIDs 대안으로 선호됨',
      '간기능 이상 시 용량 제한 필요'
    ]
  },
  tramadol: {
    nephrotoxicity: {
      grade: 'N5',
      pattern: 'mixed',
      mechanism: '신배설 대사체',
      dose_dependent: false,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '50-100mg q12h',
      gfr_30_44: '50mg q12h',
      gfr_15_29: '50mg q12h',
      gfr_below_15: '50mg q12h, 서방형 금기',
      dialysis: '투석 후 50mg'
    },
    renal_clinical_pearls: [
      '서방형은 중증 CKD에서 금기',
      'NSAIDs 대안으로 사용 가능'
    ]
  },
  meropenem: {
    nephrotoxicity: {
      grade: 'N5',
      pattern: 'mixed',
      mechanism: '신배설, 발작 역치 감소',
      dose_dependent: false,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '1g q8h',
      gfr_60_89: '1g q8h',
      gfr_45_59: '1g q12h',
      gfr_30_44: '500mg q12h',
      gfr_15_29: '500mg q24h',
      gfr_below_15: '500mg q24h',
      dialysis: '투석 후 500mg'
    },
    renal_clinical_pearls: [
      '신기능 저하 시 발작 위험 증가',
      'Valproic acid 병용 금기',
      '카바페넴 중 가장 안전'
    ]
  },
  piperacillin_tazobactam: {
    nephrotoxicity: {
      grade: 'N4',
      pattern: 'acute_interstitial',
      mechanism: '간질성 신염 (드물게)',
      dose_dependent: false,
      dialyzable: true
    },
    renal_dosing: {
      gfr_90_plus: '4.5g q6h',
      gfr_60_89: '4.5g q6h',
      gfr_45_59: '3.375g q6h',
      gfr_30_44: '2.25g q6h',
      gfr_15_29: '2.25g q8h',
      gfr_below_15: '2.25g q8h',
      dialysis: '2.25g q8h + 투석 후 0.75g'
    },
    renal_clinical_pearls: [
      '연장 주입(4시간) 고려',
      'Vancomycin 병용 시 신독성 증가 보고'
    ]
  },
  azithromycin: {
    nephrotoxicity: {
      grade: 'N5',
      pattern: 'mixed',
      mechanism: '간대사, 신독성 거의 없음',
      dose_dependent: false,
      dialyzable: false
    },
    renal_dosing: {
      gfr_90_plus: '통상용량',
      gfr_60_89: '통상용량',
      gfr_45_59: '통상용량',
      gfr_30_44: '통상용량',
      gfr_15_29: '통상용량',
      gfr_below_15: '통상용량 (주의)',
      dialysis: '용량 조절 불필요'
    },
    renal_clinical_pearls: [
      '신기능에 따른 용량 조절 불필요',
      'CKD 환자에서 안전하게 사용 가능'
    ]
  }
};

// 약물 ID 목록 export
export const drugsWithNephroData = Object.keys(nephrotoxicityData);
