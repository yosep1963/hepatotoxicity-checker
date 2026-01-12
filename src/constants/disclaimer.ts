// src/constants/disclaimer.ts
// 면책조항 - 규제 회피 필수 요소

export const DISCLAIMER = {
  title: '사용 전 안내',

  content: `■ 본 앱의 성격
PharmRef는 의료기기가 아닙니다.
본 앱은 약물 정보를 참조하기 위한 교육용 앱입니다.

■ 의료 목적 사용 불가
• 본 앱은 어떠한 질병의 진단, 치료, 예방 목적으로 사용할 수 없습니다.
• 본 앱의 정보는 의학적 판단의 근거가 될 수 없습니다.
• 모든 의료 관련 결정은 반드시 의료 전문가와 상담하세요.

■ 책임의 한계
• 본 앱 사용으로 인한 어떠한 결과에 대해서도 개발자는 책임지지 않습니다.
• 본 앱의 정보는 참고용이며, 의학적 정확성을 보장하지 않습니다.

■ 사용 대상
본 앱은 약물 정보에 관심 있는 일반인 및 의료 전문가를 대상으로 합니다.`,

  checkboxText: '위 내용을 모두 읽고 이해했습니다',
  buttonText: '동의하고 시작하기',

  // 동의하지 않으면 앱 사용 불가
  rejectAction: 'EXIT_APP',
};

// 결과 화면 배너 (짧은 버전)
export const RESULT_NOTICE = {
  short: '이 정보는 참고용이며 의학적 의미가 없습니다.',
  medium: '본 정보는 교육 목적으로 제공되며, 의학적 판단의 근거가 될 수 없습니다.',
};

// 설정 > 정보에서 표시할 전체 법적 고지
export const LEGAL_INFO = {
  notMedicalDevice: `
본 앱은 대한민국 의료기기법상 의료기기에 해당하지 않으며,
식품의약품안전처의 허가/인증/신고 대상이 아닙니다.
  `.trim(),

  intendedUse: `
본 앱은 오직 약물 정보 참조 및 교육 목적으로만 사용해야 합니다.
의료적 목적의 사용은 금지됩니다.
  `.trim(),

  noWarranty: `
본 앱에서 제공하는 모든 정보는 '있는 그대로' 제공되며,
정확성, 완전성, 적합성에 대한 어떠한 보증도 하지 않습니다.
  `.trim(),

  dataSource: `
본 앱의 약물 정보는 공개된 의학 문헌 및 교육 자료를 참조하여 작성되었습니다.
정보의 최신성은 보장되지 않으며, 실제 임상에서의 사용 전
반드시 최신 공식 자료를 확인하시기 바랍니다.
  `.trim(),
};

// localStorage 키
export const DISCLAIMER_ACCEPTED_KEY = 'pharmref_disclaimer_accepted';
export const DISCLAIMER_ACCEPTED_DATE_KEY = 'pharmref_disclaimer_accepted_date';
