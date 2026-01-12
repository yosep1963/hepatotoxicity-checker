// src/constants/appInfo.ts
// 앱 정보 - 규제 회피를 위한 포지셔닝

export const APP_INFO = {
  name: 'PharmRef',
  tagline: '약물 정보 참조 데이터베이스',
  description: '약물의 간/신 관련 정보를 검색하고 참조하는 교육용 앱입니다.',
  category: 'Reference',  // NOT "Medical"
  version: '1.0.0',
};

// 앱 카테고리 정보 (앱스토어 등록용)
export const APP_STORE_INFO = {
  primaryCategory: 'Reference',
  secondaryCategory: 'Education',
  ageRating: '4+',
  contentRating: 'Everyone',
};
