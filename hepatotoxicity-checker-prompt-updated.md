# 간독성 약물 체커 웹앱 개발 프로젝트

## 프로젝트 개요

나는 30년 경력의 간질환 전문 내과 교수야. 외래와 병동에서 간경변 환자들의 약물을 검토할 때 사용할 수 있는 **"간독성 약물 체커"** 웹앱을 만들고 싶어.

### 목표
- 환자가 복용 중인 약물을 입력하면 간독성 위험도를 시각적으로 평가
- 간경변 환자(Child-Pugh 등급별)에서 용량 조절 권고 제공
- 위험한 약물 조합 경고
- 임상에서 바로 사용 가능한 실용적인 도구

---

## 기술 스택

- **프레임워크**: React 18 + TypeScript
- **스타일링**: Tailwind CSS
- **데이터**: JSON 파일 (drugs-database-complete.json 제공됨)
- **배포**: Vercel 또는 GitHub Pages
- **반응형**: 모바일/태블릿에서도 사용 가능

---

## 핵심 기능

### 1. 약물 검색 및 입력
- 검색창에 약물명 입력 (한글/영문 모두 지원)
- 자동완성으로 약물 선택
- **성분명과 상품명 모두 검색 가능** (예: 타이레놀 → 아세트아미노펜)
- 여러 약물을 리스트에 추가/삭제

### 2. 환자 상태 선택
- 간기능 상태: 정상 / Child-Pugh A / B / C
- (선택사항) 음주력: 없음 / 사회적 음주 / 만성 음주

### 3. 분석 결과 표시
- 각 약물의 간독성 등급을 신호등 색깔로 표시:
  - 🔴 빨강 (A등급): Well-known hepatotoxin
  - 🟠 주황 (B등급): Highly likely
  - 🟡 노랑 (C등급): Probable
  - 🟢 연두 (D등급): Possible
  - 🟢 초록 (E등급): Unlikely
- 선택한 Child-Pugh 등급에 맞는 용량 권고 표시
- 위험한 약물 조합 발견 시 경고 배너 표시
- 전체 위험도 요약 점수

### 4. 상세 정보 패널
- 각 약물 클릭 시 상세 정보 표시:
  - 간독성 기전
  - 위험 인자
  - Child-Pugh 등급별 용량 조절
  - 모니터링 권고
  - 임상 팁 (clinical pearls)

---

## 약물 데이터베이스 (109개 - drugs-database-complete.json)

### 검색 기능 구현
데이터베이스에는 다음 필드로 검색이 가능하도록 구성되어 있어:
- `name_en`: 영문 성분명 (예: "Acetaminophen")
- `name_kr`: 한글 성분명 (예: "아세트아미노펜")
- `brand_names_en`: 영문 상품명 배열 (예: ["Tylenol", "Panadol"])
- `brand_names_kr`: 한글 상품명 배열 (예: ["타이레놀", "써스펜", "게보린"])

### 포함된 약물 카테고리 (109개):

| 카테고리 | 약물 수 | 주요 약물 |
|---------|--------|---------|
| 진통소염제 | 5 | 아세트아미노펜, 이부프로펜, 나프록센, 셀레콕시브, 트라마돌 |
| 항생제 | 20 | 타조신, 세프트리악손, 메로페넴, 반코마이신, 퀴놀론 등 |
| 간경변 필수약 | 10 | 스피로노락톤, 푸로세미드, 락툴로스, 리팍시민, 프로프라놀롤 등 |
| 항바이러스제 | 8 | 테노포비르, 엔테카비르, 하보니, 마비렛, 엡클루사 등 |
| 항결핵제 | 4 | 이소니아지드, 리팜핀, 피라진아미드, 에탐부톨 |
| 항진균제 | 5 | 플루코나졸, 이트라코나졸, 보리코나졸, 카스포펀진 |
| 당뇨약 | 8 | 메트포르민, 인슐린, DPP-4억제제, SGLT2억제제 등 |
| 심혈관약 | 12 | 아미오다론, 스타틴, CCB, ARB, ACE억제제, 베타차단제 등 |
| 항응고제 | 7 | 와파린, DOAC(리바록사반, 아픽사반 등), 아스피린 등 |
| 정신신경계 | 15 | 항경련제, 항우울제, 벤조디아제핀, 항정신병제 등 |
| 진통제/오피오이드 | 5 | 모르핀, 옥시코돈, 펜타닐, 프레가발린 |
| 기타 | 10 | 스테로이드, 갑상선약, 통풍약, 항구토제 등 |

### 간독성 등급 분포:
- **Grade A (고위험)**: 8개 - 아세트아미노펜, 발프로산, 아미오다론, 메토트렉세이트 등
- **Grade B**: 12개 - 페니토인, 카바마제핀, 이트라코나졸, 아목시실린-클라불란산 등
- **Grade C**: 22개 - NSAIDs, 퀴놀론, 스타틴, 항정신병제 등
- **Grade D**: 40개 - 대부분의 안전한 약물
- **Grade E (매우 안전)**: 27개 - 락툴로스, 알부민, 인슐린, 세팔로스포린 등

---

## 특수 경고 규칙

다음 조건에서 별도의 경고 배너를 표시해:

```javascript
const SPECIAL_ALERTS = [
  {
    id: "nsaid_cirrhosis",
    drugs: ["ibuprofen", "naproxen", "celecoxib"],
    condition: "any_cirrhosis",
    level: "high",
    title: "NSAIDs + 간경변 주의",
    message: "⚠️ 신기능 악화 및 상부위장관 출혈 위험 현저히 증가. 가급적 회피."
  },
  {
    id: "benzo_cirrhosis", 
    drugs: ["diazepam"],
    condition: "any_cirrhosis",
    level: "high",
    title: "진정제 + 간경변 주의",
    message: "⚠️ 간성뇌증 유발/악화 위험. Lorazepam, Oxazepam이 더 안전."
  },
  {
    id: "metronidazole_cirrhosis",
    drugs: ["metronidazole"],
    condition: "child_b_or_c",
    level: "high",
    title: "Metronidazole 감량 필수",
    message: "⚠️ 반드시 50% 감량! 250mg q8-12h, 7일 이내 사용."
  },
  {
    id: "meropenem_valproate",
    drugs: ["meropenem", "valproic-acid"],
    condition: "combination",
    level: "critical",
    title: "🚫 절대 병용 금기",
    message: "카바페넴이 발프로산 농도를 급격히 감소 → 경련 위험!"
  },
  {
    id: "amiodarone_harvoni",
    drugs: ["amiodarone", "sofosbuvir-ledipasvir"],
    condition: "combination",
    level: "critical", 
    title: "🚫 병용 금기",
    message: "치명적 서맥 위험. Amiodarone + DAA 병용 금기."
  },
  {
    id: "multiple_grade_a",
    condition: "two_or_more_grade_a",
    level: "high",
    title: "복합 간독성 위험",
    message: "⚠️ 간독성 고위험 약물 2개 이상. LFT 모니터링 필수."
  }
];
```

---

## UI 디자인 요구사항

### 컬러 팔레트
```css
:root {
  --grade-a: #DC2626;  /* 빨강 */
  --grade-b: #EA580C;  /* 주황 */
  --grade-c: #CA8A04;  /* 노랑 */
  --grade-d: #65A30D;  /* 연두 */
  --grade-e: #16A34A;  /* 초록 */
  --alert-critical: #7F1D1D;
  --alert-high: #DC2626;
  --alert-medium: #D97706;
  --background: #F8FAFC;
}
```

### 핵심 컴포넌트
1. **DrugSearchInput**: 자동완성 검색창 (한글/영문/상품명 모두 검색)
2. **DrugList**: 선택된 약물 리스트 (삭제 버튼, 간독성 색상 표시)
3. **ChildPughSelector**: Child-Pugh 등급 선택 라디오 버튼
4. **AnalysisResult**: 분석 결과 카드 (약물별 권고사항)
5. **AlertBanner**: 특수 경고 배너
6. **DrugDetailPanel**: 약물 상세 정보 슬라이드 패널

---

## 구현 순서

### Phase 1: 프로젝트 설정
1. Vite + React + TypeScript 프로젝트 생성
2. Tailwind CSS 설정
3. drugs-database-complete.json 파일을 src/data/에 복사
4. TypeScript 타입 정의

### Phase 2: 검색 기능
5. 약물 검색 컴포넌트 (한글/영문/상품명 자동완성)
6. 선택된 약물 리스트 관리

### Phase 3: 분석 로직
7. Child-Pugh 선택에 따른 용량 권고 표시
8. 특수 경고 감지 로직
9. 위험도 점수 계산

### Phase 4: UI 완성
10. 결과 카드 디자인
11. 상세 정보 패널
12. 반응형 레이아웃

---

## 시작하기

drugs-database-complete.json 파일이 이미 제공되어 있어. 
Phase 1부터 시작해줘:

1. 프로젝트 초기화
2. Tailwind 설정  
3. JSON 파일을 src/data/에 복사
4. 기본 타입 정의 (Drug, ChildPughGrade 등)

한 단계씩 진행하면서 코드를 보여줘.
