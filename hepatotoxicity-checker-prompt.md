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
- **데이터**: JSON 파일 (나중에 DB 확장 가능)
- **배포**: Vercel 또는 GitHub Pages
- **반응형**: 모바일/태블릿에서도 사용 가능

---

## 핵심 기능

### 1. 약물 검색 및 입력
- 검색창에 약물명 입력 (한글/영문 모두 지원)
- 자동완성으로 약물 선택
- 상품명으로도 검색 가능 (예: 타이레놀 → 아세트아미노펜)
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
  - 약물 상호작용
  - LiverTox 링크
  - 임상 팁

### 5. 결과 내보내기
- 분석 결과를 PDF로 출력
- 클립보드에 텍스트 복사

---

## 약물 데이터 구조

각 약물은 다음 JSON 구조를 따라:

```json
{
  "id": "drug_id",
  "name_en": "English Name",
  "name_kr": "한글명",
  "brand_names_kr": ["상품명1", "상품명2"],
  "drug_class": "약물 분류",
  "atc_code": "ATC 코드",
  "hepatotoxicity": {
    "grade": "A-E",
    "likelihood_score": 1-5,
    "pattern": "hepatocellular | cholestatic | mixed",
    "mechanism": "기전 설명",
    "typical_latency": "발현 시간",
    "dose_dependent": true/false,
    "idiosyncratic": true/false,
    "incidence": "발생률"
  },
  "risk_factors": [
    {"factor": "위험인자", "severity": "high|medium|low", "note": "설명"}
  ],
  "cirrhosis_dosing": {
    "note": "일반 참고사항",
    "child_A": {"dose": "용량", "recommendation": "권고", "caution": "주의사항"},
    "child_B": {"dose": "용량", "recommendation": "권고", "caution": "주의사항"},
    "child_C": {"dose": "용량", "recommendation": "권고", "caution": "주의사항", "alternative": ["대안약물"]}
  },
  "monitoring": {
    "baseline": ["검사항목"],
    "during_use": "사용 중 모니터링",
    "warning_signs": ["경고 증상"]
  },
  "interactions": [
    {"drug": "약물명", "effect": "효과", "severity": "high|moderate|low", "mechanism": "기전", "recommendation": "권고"}
  ],
  "special_considerations": {},
  "livertox_url": "URL",
  "clinical_pearls": ["임상 팁"]
}
```

---

## 초기 약물 데이터베이스 (30개)

다음 약물들의 완전한 데이터를 만들어줘:

### 진통소염제 (5개)
1. **Acetaminophen (아세트아미노펜)** - 타이레놀, 써스펜, 게보린, 펜잘
   - 등급 A, hepatocellular, NAPQI 독성
   - 위험인자: 만성음주(high), 영양결핍(high), CYP2E1 유도제(medium)
   - Child-A: 2-3g/일, Child-B: 2g/일 단기간, Child-C: 가급적 회피 (불가피시 1g/일)
   - 상호작용: warfarin(INR↑), isoniazid(간독성↑)

2. **Ibuprofen (이부프로펜)** - 부루펜, 애드빌, 이지엔6
   - 등급 C, hepatocellular/cholestatic
   - 간경변: 가급적 회피 (신기능↓, 출혈위험↑)

3. **Naproxen (나프록센)** - 낙센, 탁센
   - 등급 C, hepatocellular
   - 간경변: 가급적 회피

4. **Celecoxib (셀레콕시브)** - 쎄레브렉스
   - 등급 C, hepatocellular/mixed
   - Child-C: 50% 감량, 가급적 회피

5. **Tramadol (트라마돌)** - 트리돌, 트라몰
   - 등급 D, hepatocellular (드묾)
   - Child-C: 50mg q12h, 서방형 회피

### 항생제 (10개)
6. **Piperacillin-Tazobactam (피페라실린-타조박탐)** - 타조신, 타조페란
   - 등급 C, cholestatic
   - 간기능 조절 불필요 (신기능 기준)
   - SBP, 담도감염에 적합

7. **Ceftriaxone (세프트리악손)** - 로세핀, 트리악손
   - 등급 D, 담즙슬러지 형성 가능
   - Child-C: 최대 2g/일, 장기사용 주의
   - 상호작용: 칼슘수액 동일라인 금기

8. **Cefotaxime (세포탁심)** - 클라포란
   - 등급 E, 매우 안전
   - Child-C에서 ceftriaxone 대안
   - 담즙슬러지 위험 없음

9. **Metronidazole (메트로니다졸)** - 후라시닐
   - 등급 D
   - **Child-B/C: 반드시 50% 감량** (반감기 2-3배 연장)
   - 7일 이상 사용 시 신경독성 위험
   - 상호작용: 알코올(disulfiram반응), warfarin(INR↑↑)

10. **Meropenem (메로페넴)** - 메렘
    - 등급 D, 가장 안전한 광범위 항생제
    - 간기능 조절 불필요
    - **상호작용: Valproic acid 절대 금기**

11. **Teicoplanin (테이코플라닌)** - 타고시드
    - 등급 D
    - Vancomycin보다 신독성 낮음
    - 간신증후군 위험 환자에서 선호

12. **Vancomycin (반코마이신)**
    - 등급 E, 간독성 거의 없음
    - 신독성이 주요 관심사
    - TDM 필수

13. **Cefazolin (세파졸린)** - 케프졸
    - 등급 E, 매우 안전
    - 수술예방, 피부연조직 감염

14. **Levofloxacin (레보플록사신)** - 크라비트
    - 등급 C
    - 급성 간손상 보고 있음
    - SBP 예방 가능
    - 상호작용: warfarin, QT연장약물

15. **Ciprofloxacin (시프로플록사신)** - 시프로바이
    - 등급 C
    - Child-C: 가능하면 다른 항생제
    - 상호작용: theophylline(금기), tizanidine(금기)

### 항경련제 (3개)
16. **Valproic acid (발프로산)** - 데파코트, 오르필
    - 등급 A, hepatocellular, 미토콘드리아 독성
    - 간경변: 가급적 회피
    - 상호작용: 카바페넴 금기

17. **Phenytoin (페니토인)** - 디란틴
    - 등급 B, hepatocellular/mixed
    - Child-C: 용량 감량, 유리농도 모니터링

18. **Carbamazepine (카바마제핀)** - 테그레톨
    - 등급 B, hepatocellular/cholestatic
    - 간경변: 가급적 회피

### 심혈관계 (2개)
19. **Amiodarone (아미오다론)** - 코다론
    - 등급 A, hepatocellular (인지질증)
    - 장기 사용 시 10-25% 간독성
    - Child-C: 가급적 회피

20. **Atorvastatin (아토르바스타틴)** - 리피토
    - 등급 C
    - 간경변: Child-A/B 저용량 가능, Child-C 금기

### 정신신경계 (3개)
21. **Haloperidol (할로페리돌)** - 할돌
    - 등급 C, cholestatic
    - 간경변: 50% 감량

22. **Diazepam (디아제팜)** - 바리움
    - 등급 D
    - **간경변: 간성뇌증 위험** - 반감기 5배 연장
    - 대안: oxazepam, lorazepam

23. **Quetiapine (쿠에티아핀)** - 쎄로켈
    - 등급 C
    - Child-C: 25mg부터 시작

### 면역억제제/기타 (4개)
24. **Methotrexate (메토트렉세이트)**
    - 등급 A, hepatocellular/섬유화
    - 간경변: 금기

25. **Azathioprine (아자티오프린)** - 이무란
    - 등급 B, cholestatic/sinusoidal
    - Child-C: 50% 감량

26. **Isoniazid (이소니아지드)**
    - 등급 A, hepatocellular
    - 간경변: 주의 깊게 사용, LFT 주 1회

27. **Amoxicillin-Clavulanate (아목시실린-클라불란산)** - 오구멘틴, 클라목스
    - 등급 A (clavulanate 때문), cholestatic
    - 약인성 간손상 가장 흔한 원인 중 하나
    - 간경변: 가능하면 다른 항생제

### 한약/건강식품 (3개)
28. **녹차추출물 (EGCG)**
    - 등급 B, hepatocellular
    - 공복 고용량에서 위험

29. **마황 (Ephedra)**
    - 등급 B
    - 간경변: 금기

30. **인진호 (Artemisia capillaris)**
    - 등급 C
    - 전통적 간보호 주장, 근거 제한적

---

## 특수 경고 규칙

다음 조건에서 별도의 경고 배너를 표시해:

```json
{
  "special_alerts": [
    {
      "id": "nsaid_cirrhosis",
      "condition": "NSAIDs(ibuprofen, naproxen, celecoxib) + 간경변(any)",
      "alert_level": "high",
      "title": "NSAIDs + 간경변 주의",
      "message": "⚠️ 신기능 악화 및 상부위장관 출혈 위험 현저히 증가. 가급적 회피하고 아세트아미노펜 저용량(2g/일 이하) 고려.",
      "icon": "warning"
    },
    {
      "id": "benzo_cirrhosis",
      "condition": "벤조디아제핀(diazepam 등) + 간경변(any)",
      "alert_level": "high",
      "title": "진정제 + 간경변 주의",
      "message": "⚠️ 간성뇌증 유발/악화 위험. 반감기 현저히 연장. 불가피 시 oxazepam, lorazepam 선호 (간대사 적음).",
      "icon": "brain"
    },
    {
      "id": "metronidazole_cirrhosis_bc",
      "condition": "Metronidazole + Child-Pugh B/C",
      "alert_level": "high",
      "title": "Metronidazole 감량 필수",
      "message": "⚠️ 반드시 50% 감량! 반감기 2-3배 연장. 250mg q8-12h, 7일 이내 사용. 신경독성(말초신경병, 뇌병증) 주의.",
      "icon": "pill"
    },
    {
      "id": "meropenem_valproate",
      "condition": "Meropenem + Valproic acid",
      "alert_level": "critical",
      "title": "🚫 절대 병용 금기",
      "message": "카바페넴이 발프로산 농도를 급격히 감소시켜 경련 위험. 대체 항경련제 또는 대체 항생제 필수.",
      "icon": "block"
    },
    {
      "id": "vancomycin_hrs_risk",
      "condition": "Vancomycin + Child-Pugh C",
      "alert_level": "medium",
      "title": "Vancomycin 신독성 주의",
      "message": "⚠️ 간신증후군 고위험 환자에서 신독성 주의. Teicoplanin이 더 안전할 수 있음. TDM 필수.",
      "icon": "kidney"
    },
    {
      "id": "fluoroquinolone_child_c",
      "condition": "Fluoroquinolone(levofloxacin, ciprofloxacin) + Child-Pugh C",
      "alert_level": "medium",
      "title": "퀴놀론 간독성 주의",
      "message": "⚠️ 급성 간손상 보고 있음. LFT 주 2회 모니터링. 가능하면 다른 계열 항생제 고려.",
      "icon": "liver"
    },
    {
      "id": "ceftriaxone_child_c_long",
      "condition": "Ceftriaxone + Child-Pugh C + 7일 이상",
      "alert_level": "medium",
      "title": "Ceftriaxone 장기사용 주의",
      "message": "⚠️ 담즙배설 의존으로 담즙슬러지/가성담석 위험. Cefotaxime 대안 고려. 최대 2g/일.",
      "icon": "gallbladder"
    },
    {
      "id": "multiple_hepatotoxic",
      "condition": "간독성 A등급 약물 2개 이상",
      "alert_level": "high",
      "title": "복합 간독성 위험",
      "message": "⚠️ 간독성 위험이 높은 약물이 2개 이상입니다. 정기적인 LFT 모니터링 필수. 대안 약물 고려.",
      "icon": "alert-triangle"
    },
    {
      "id": "ppi_cirrhosis_long",
      "condition": "PPI + 간경변 + 장기사용",
      "alert_level": "low",
      "title": "PPI 장기사용 주의",
      "message": "ℹ️ SBP 위험 증가 가능성 보고. 적응증 재평가, 필요시에만 사용.",
      "icon": "info"
    },
    {
      "id": "cipro_theophylline",
      "condition": "Ciprofloxacin + Theophylline",
      "alert_level": "critical",
      "title": "🚫 병용 주의",
      "message": "CYP1A2 억제로 테오필린 농도 상승. 독성 위험. 용량 조절 또는 대체 항생제.",
      "icon": "block"
    },
    {
      "id": "cipro_tizanidine",
      "condition": "Ciprofloxacin + Tizanidine",
      "alert_level": "critical",
      "title": "🚫 병용 금기",
      "message": "티자니딘 독성(심한 저혈압, 과진정) 위험. 절대 병용 금기.",
      "icon": "block"
    },
    {
      "id": "ceftriaxone_calcium",
      "condition": "Ceftriaxone + 칼슘함유수액",
      "alert_level": "critical",
      "title": "🚫 동일라인 투여 금기",
      "message": "침전물 형성으로 폐/신장 손상 위험. 동일 IV 라인 투여 절대 금기.",
      "icon": "block"
    }
  ]
}
```

---

## UI 디자인 요구사항

### 전체 레이아웃
- 깔끔하고 전문적인 의료용 UI
- 상단: 헤더 (앱 이름, 간단한 설명)
- 좌측/상단: 약물 검색 및 입력 영역
- 우측/하단: 분석 결과 영역
- 반응형: 모바일에서는 세로 배치

### 컬러 팔레트
- Primary: 의료/신뢰감 있는 블루 계열
- 간독성 등급 색상:
  - Grade A: #DC2626 (빨강)
  - Grade B: #EA580C (주황)
  - Grade C: #CA8A04 (노랑)
  - Grade D: #65A30D (연두)
  - Grade E: #16A34A (초록)
- 경고: #DC2626 (빨강)
- 배경: #F8FAFC (연한 회색)
- 다크모드 지원

### 접근성
- 색맹도 구분 가능하도록 색상 + 아이콘 병행
- 충분한 폰트 크기 (의료 현장에서 빠르게 확인)
- 키보드 네비게이션 지원

### 컴포넌트
1. **DrugSearchInput**: 자동완성 검색창
2. **DrugList**: 선택된 약물 리스트 (삭제 버튼 포함)
3. **PatientStatusSelector**: Child-Pugh 등급 선택
4. **AnalysisResult**: 분석 결과 카드
5. **DrugDetailModal**: 약물 상세 정보 모달
6. **AlertBanner**: 특수 경고 배너
7. **RiskSummary**: 전체 위험도 요약
8. **ExportButton**: PDF/텍스트 내보내기

---

## 구현 순서

### Phase 1: 기본 구조 (먼저 해줘)
1. 프로젝트 초기화 (Vite + React + TypeScript + Tailwind)
2. 폴더 구조 설정
3. 약물 데이터 JSON 파일 생성 (위의 30개 약물)
4. 타입 정의 (TypeScript interfaces)

### Phase 2: 핵심 UI
5. DrugSearchInput 컴포넌트 (자동완성)
6. DrugList 컴포넌트
7. PatientStatusSelector 컴포넌트
8. 기본 레이아웃

### Phase 3: 분석 로직
9. 간독성 분석 함수
10. 특수 경고 감지 함수
11. 위험도 점수 계산

### Phase 4: 결과 표시
12. AnalysisResult 컴포넌트
13. AlertBanner 컴포넌트
14. DrugDetailModal 컴포넌트

### Phase 5: 마무리
15. 다크모드
16. PDF 내보내기
17. 반응형 최적화
18. 테스트 및 버그 수정

---

## 시작하기

먼저 Phase 1부터 시작해줘:
1. Vite로 React + TypeScript 프로젝트 생성
2. Tailwind CSS 설정
3. 폴더 구조: `src/components/`, `src/data/`, `src/types/`, `src/utils/`
4. 위의 30개 약물 데이터를 `src/data/drugs.json`에 생성
5. TypeScript 타입 정의를 `src/types/index.ts`에 생성

한 단계씩 진행하면서 코드를 보여줘. 질문이 있으면 물어봐.
