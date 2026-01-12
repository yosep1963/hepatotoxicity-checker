# HE Monitor - 개발 지침서 (Vibe Coding Guide)

## 인지기능 트레이닝 & 셀프 모니터링 앱

---

# 🚨 1. 규제 회피 전략 (최우선 준수사항)

## 1.1 핵심 원칙: "의료기기"가 아닌 "웰니스/교육 도구"

```
┌─────────────────────────────────────────────────────────────┐
│                    포지셔닝 전략                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ❌ 피해야 할 것 (의료기기로 분류됨)                         │
│  ├── "간성뇌증 진단"                                        │
│  ├── "HE 등급 판정"                                         │
│  ├── "PHES 점수 산출"                                       │
│  ├── "인지기능 평가/검사"                                   │
│  └── "환자", "진단", "치료", "모니터링"                     │
│                                                             │
│  ✅ 사용해야 할 것 (비의료기기)                              │
│  ├── "인지 트레이닝/연습"                                   │
│  ├── "반응속도 게임"                                        │
│  ├── "두뇌 훈련"                                            │
│  ├── "셀프 기록/일지"                                       │
│  └── "사용자", "연습", "훈련", "기록"                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 1.2 앱 이름 및 설명 변경

### 변경 전 (위험) → 변경 후 (안전)

| 항목 | ❌ 위험한 표현 | ✅ 안전한 표현 |
|------|---------------|---------------|
| **앱 이름** | HE Monitor (간성뇌증 모니터) | **CogniTrack** (인지훈련 기록) |
| **부제** | 간성뇌증 인지기능 평가 도구 | **두뇌 훈련 & 반응속도 기록 앱** |
| **설명** | 간질환 환자의 인지기능을 평가하고 HE를 조기 발견 | **반응속도와 집중력 훈련을 기록하고 추적하는 웰니스 앱** |

### 최종 앱 정보

```typescript
// src/constants/appInfo.ts

export const APP_INFO = {
  name: 'CogniTrack',
  tagline: '두뇌 훈련 & 반응속도 기록',
  description: `
    CogniTrack은 반응속도, 집중력, 인지 민첩성을 
    훈련하고 기록하는 웰니스 앱입니다.
    
    • 다양한 두뇌 훈련 게임
    • 개인 기록 추적 및 시각화
    • 일별/주별 훈련 현황
  `,
  category: 'Health & Fitness',  // NOT "Medical"
  ageRating: '4+',
};
```

## 1.3 기능별 용어 변환 테이블 (필수 준수)

### 검사 → 게임/훈련

| 원래 기능명 | ❌ 금지 용어 | ✅ 사용할 용어 |
|------------|-------------|---------------|
| NCT-A | 숫자연결검사 | **숫자 연결 게임** |
| NCT-B | 숫자-문자연결검사 | **숫자-문자 연결 게임** |
| Stroop Test | 스트룹 검사 | **색상 단어 챌린지** |
| Animal Naming | 동물이름대기검사 | **동물 이름 말하기 게임** |
| Line Tracing | 선추적검사 | **선 따라가기 게임** |
| CRT | 연속반응시간검사 | **반응속도 챌린지** |

### 점수/결과 → 기록/수치

| 원래 표현 | ❌ 금지 용어 | ✅ 사용할 용어 |
|----------|-------------|---------------|
| 검사 점수 | Score, 점수 | **완료 시간**, **기록** |
| Z-score | 표준편차, 정상 대비 | **개인 평균 대비** |
| PHES 점수 | 종합 인지점수 | **종합 훈련 기록** |
| West Haven Grade | HE 등급 | ❌ **완전 제거** |
| 정상/비정상 | 정상 범위, 이상 | **이전 기록 대비** |
| 악화/호전 | 인지기능 저하 | **기록 변화** |

### 대상 → 사용자

| 원래 표현 | ❌ 금지 용어 | ✅ 사용할 용어 |
|----------|-------------|---------------|
| 환자 | Patient | **사용자 (User)** |
| 진단 | Diagnosis | ❌ **사용 금지** |
| 평가 | Assessment, Evaluation | **훈련, 연습** |
| 모니터링 | Monitoring | **기록 추적** |
| 경고/알림 | Alert, Warning | **리마인더** |

---

# 📋 2. 필수 면책조항

## 2.1 앱 시작 시 필수 동의 화면

```typescript
// src/constants/disclaimer.ts

export const DISCLAIMER = {
  title: '사용 전 안내',
  
  content: `
■ 본 앱의 성격
CogniTrack은 의료기기가 아닙니다.
본 앱은 두뇌 훈련과 반응속도 기록을 위한 
일반 웰니스/피트니스 앱입니다.

■ 의료 목적 사용 불가
• 본 앱은 어떠한 질병의 진단, 치료, 예방 목적으로 
  사용할 수 없습니다.
• 본 앱의 결과는 의학적 판단의 근거가 될 수 없습니다.
• 건강 관련 결정은 반드시 의료 전문가와 상담하세요.

■ 책임의 한계
• 본 앱 사용으로 인한 어떠한 결과에 대해서도 
  개발자는 책임지지 않습니다.
• 본 앱의 기록은 참고용이며, 의학적 정확성을 
  보장하지 않습니다.

■ 사용 대상
본 앱은 인지 훈련에 관심 있는 일반 성인을 
대상으로 합니다.
  `,
  
  checkboxText: '위 내용을 모두 읽고 이해했습니다',
  buttonText: '동의하고 시작하기',
  
  // 동의하지 않으면 앱 사용 불가
  rejectAction: 'EXIT_APP',
};

// 추가 면책조항 (설정 > 정보에서 항상 확인 가능)
export const LEGAL_INFO = {
  notMedicalDevice: `
    본 앱은 대한민국 의료기기법상 의료기기에 해당하지 않으며,
    식품의약품안전처의 허가/인증/신고 대상이 아닙니다.
  `,
  
  intendedUse: `
    본 앱은 오직 개인의 두뇌 훈련 및 기록 추적 목적으로만 
    사용해야 합니다. 의료적 목적의 사용은 금지됩니다.
  `,
  
  noWarranty: `
    본 앱에서 제공하는 모든 정보와 기록은 '있는 그대로' 
    제공되며, 정확성, 완전성, 적합성에 대한 어떠한 보증도 
    하지 않습니다.
  `,
};
```

## 2.2 결과 화면마다 표시할 안내문

```typescript
// src/constants/resultNotice.ts

// 모든 훈련 결과 화면 하단에 표시
export const RESULT_NOTICE = {
  short: '이 기록은 참고용이며 의학적 의미가 없습니다.',
  
  // 추세 그래프 화면에 표시
  trendNotice: `
    기록의 변화는 다양한 요인(피로, 집중도, 환경 등)에 
    영향을 받습니다. 건강 상태와 직접적인 관련이 없습니다.
  `,
};
```

## 2.3 면책조항 UI 컴포넌트

```typescript
// src/components/common/DisclaimerBanner.tsx

import React from 'react';

interface DisclaimerBannerProps {
  variant?: 'subtle' | 'prominent';
}

export function DisclaimerBanner({ variant = 'subtle' }: DisclaimerBannerProps) {
  if (variant === 'subtle') {
    return (
      <div className="text-xs text-gray-400 text-center py-2 border-t border-gray-700">
        ℹ️ 본 기록은 참고용이며 의학적 의미가 없습니다
      </div>
    );
  }
  
  return (
    <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 mx-4 my-2">
      <p className="text-amber-200 text-sm text-center">
        ⚠️ 이 앱은 의료기기가 아닙니다. 
        건강 관련 결정은 의료 전문가와 상담하세요.
      </p>
    </div>
  );
}
```

---

# 🎮 3. 기능 설계 (규제 회피 버전)

## 3.1 전체 기능 구조

```
CogniTrack (인지훈련 기록 앱)
│
├── 🏠 홈
│   ├── 오늘의 훈련 현황
│   ├── 빠른 시작 버튼들
│   └── 최근 기록 요약
│
├── 🎮 훈련 게임 (6종)
│   ├── 숫자 연결 게임 (NCT-A 대체)
│   ├── 숫자-문자 연결 게임 (NCT-B 대체)
│   ├── 색상 단어 챌린지 (Stroop 대체)
│   ├── 동물 이름 말하기 (Animal Naming 대체)
│   ├── 선 따라가기 (Line Tracing 대체)
│   └── 반응속도 챌린지 (CRT 대체)
│
├── 📊 내 기록
│   ├── 기록 히스토리 (리스트)
│   ├── 추세 그래프 (시각화)
│   └── 데이터 내보내기 (CSV)
│
├── 👤 프로필
│   ├── 기본 정보 (나이, 별명)
│   ├── 훈련 설정 (난이도 등)
│   └── 알림 설정
│
└── ⚙️ 설정
    ├── 앱 정보 / 면책조항
    ├── 데이터 관리
    └── 언어 설정
```

## 3.2 각 게임별 설계

### 게임 1: 숫자 연결 게임 (구 NCT-A)

```typescript
// src/types/games.ts

export interface NumberConnectGame {
  id: 'number-connect';
  name: '숫자 연결 게임';
  description: '1부터 25까지 순서대로 최대한 빠르게 연결하세요';
  
  // 게임 설정
  config: {
    gridSize: 5;           // 5x5 그리드
    maxNumber: 25;
    timeLimit?: number;    // 선택적 시간제한
  };
  
  // 결과 (의학 용어 사용 금지)
  result: {
    completionTime: number;     // 완료 시간 (초) - "검사 시간" ❌
    errors: number;             // 잘못 터치 횟수
    isCompleted: boolean;
    
    // ❌ 아래는 포함하지 않음
    // score: number;           // 점수 계산 ❌
    // zScore: number;          // Z-score ❌
    // percentile: number;      // 백분위 ❌
    // normalRange: boolean;    // 정상 여부 ❌
  };
}
```

```typescript
// src/components/games/NumberConnectGame.tsx

import React, { useState, useEffect, useRef } from 'react';

export function NumberConnectGame() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // 게임 로직...
  
  const handleNumberClick = (num: number) => {
    if (num === currentTarget) {
      if (currentTarget === 25) {
        // 완료
        const endTime = Date.now();
        const completionTime = (endTime - startTime!) / 1000;
        
        saveResult({
          gameId: 'number-connect',
          completionTime,
          errors,
          timestamp: new Date().toISOString(),
        });
        
        setIsComplete(true);
      } else {
        setCurrentTarget(prev => prev + 1);
      }
    } else {
      setErrors(prev => prev + 1);
    }
  };
  
  return (
    <div className="game-container">
      {/* 게임 UI */}
      
      {isComplete && (
        <ResultCard
          title="게임 완료!"
          stats={[
            { label: '완료 시간', value: `${completionTime.toFixed(1)}초` },
            { label: '실수 횟수', value: `${errors}회` },
          ]}
          // ❌ 점수나 등급 표시 없음
          // ❌ "정상/비정상" 판정 없음
        />
      )}
      
      {/* 면책조항 배너 */}
      <DisclaimerBanner variant="subtle" />
    </div>
  );
}
```

### 게임 2: 색상 단어 챌린지 (구 Stroop Test)

```typescript
// src/types/games.ts

export interface ColorWordGame {
  id: 'color-word';
  name: '색상 단어 챌린지';
  description: '글자의 "색상"을 맞추세요. 단어 내용에 속지 마세요!';
  
  config: {
    totalTrials: 20;        // 20회 시행
    displayTime: 2000;      // 각 문제 표시 시간 (ms)
  };
  
  result: {
    correctCount: number;      // 정답 수
    totalTrials: number;       // 전체 시행 수
    averageResponseTime: number; // 평균 반응시간 (ms)
    
    // ❌ 간섭 점수, 오류율 등 "검사" 느낌의 지표 제외
  };
}
```

### 게임 3: 반응속도 챌린지 (구 CRT)

```typescript
// src/types/games.ts

export interface ReactionGame {
  id: 'reaction-speed';
  name: '반응속도 챌린지';
  description: '화면이 바뀌면 최대한 빠르게 터치하세요!';
  
  config: {
    trials: 10;
    minWait: 1000;    // 최소 대기시간
    maxWait: 5000;    // 최대 대기시간
  };
  
  result: {
    reactionTimes: number[];      // 각 시행별 반응시간
    averageTime: number;          // 평균 반응시간
    bestTime: number;             // 최고 기록
    
    // ❌ "정상 범위" 비교 없음
  };
}
```

## 3.3 결과 저장 구조 (의학 용어 배제)

```typescript
// src/types/record.ts

// ✅ 안전한 기록 구조
export interface TrainingRecord {
  id: string;
  
  // 기본 정보
  gameId: GameType;
  timestamp: string;           // ISO 날짜/시간
  
  // 원시 데이터만 저장
  rawData: {
    completionTime?: number;   // 완료 시간 (초)
    reactionTimes?: number[];  // 반응 시간 배열 (ms)
    correctCount?: number;     // 정답 수
    totalCount?: number;       // 전체 문제 수
    errorCount?: number;       // 실수 횟수
  };
  
  // 메타데이터
  meta?: {
    note?: string;             // 사용자 메모
    condition?: string;        // "피곤함", "평소" 등 (선택)
  };
  
  // ❌ 아래 필드는 절대 포함하지 않음
  // score: number;
  // zScore: number;
  // percentile: number;
  // grade: string;
  // isNormal: boolean;
  // clinicalInterpretation: string;
}
```

## 3.4 추세 그래프 (규제 회피 버전)

```typescript
// src/components/charts/TrendChart.tsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface TrendChartProps {
  data: TrainingRecord[];
  metric: 'completionTime' | 'averageReaction';
}

export function TrendChart({ data, metric }: TrendChartProps) {
  const chartData = data.map(record => ({
    date: formatDate(record.timestamp),
    value: getMetricValue(record, metric),
  }));
  
  return (
    <div className="chart-container">
      {/* 차트 제목 - 중립적 표현 */}
      <h3 className="text-lg font-medium text-white mb-4">
        {metric === 'completionTime' ? '완료 시간 추이' : '반응 시간 추이'}
      </h3>
      
      <LineChart data={chartData} width={350} height={200}>
        <XAxis dataKey="date" stroke="#94A3B8" />
        <YAxis stroke="#94A3B8" />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6' }}
        />
        <Tooltip 
          contentStyle={{ background: '#1E293B', border: 'none' }}
          labelStyle={{ color: '#94A3B8' }}
        />
      </LineChart>
      
      {/* ❌ 아래는 표시하지 않음 */}
      {/* - "정상 범위" 표시 밴드 */}
      {/* - "악화/호전" 화살표 */}
      {/* - "경고" 마커 */}
      
      {/* 중립적 안내문 */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        기록은 피로도, 집중 상태 등 다양한 요인에 영향을 받습니다.
      </p>
      
      {/* 면책조항 */}
      <DisclaimerBanner variant="subtle" />
    </div>
  );
}
```

### ❌ 절대 포함하지 않을 차트 요소

```typescript
// 🚫 금지: 정상 범위 표시
// <ReferenceLine y={normalMax} stroke="red" label="정상 상한" />
// <ReferenceArea y1={normalMin} y2={normalMax} fill="green" opacity={0.1} />

// 🚫 금지: 경고/알림 마커
// {isAbnormal && <AlertIcon color="red" />}
// <WarningBadge>악화 추세</WarningBadge>

// 🚫 금지: 임상적 해석
// <InterpretationText>인지기능 저하 의심</InterpretationText>
```

---

# 🎨 4. UI/UX 설계

## 4.1 색상 팔레트 (웰니스/피트니스 느낌)

```css
/* src/styles/globals.css */

:root {
  /* 밝고 친근한 색상 (의료 느낌 배제) */
  --color-primary: #3B82F6;       /* 밝은 파랑 */
  --color-secondary: #8B5CF6;     /* 보라 */
  --color-accent: #10B981;        /* 민트 그린 */
  
  /* 배경 */
  --color-bg-primary: #0F172A;    /* 다크 네이비 */
  --color-bg-secondary: #1E293B;
  
  /* ❌ 의료 느낌 색상 사용 금지 */
  /* --color-medical-red: #DC2626;  병원 빨강 */
  /* --color-medical-green: #059669; 수술실 초록 */
  
  /* 게임/훈련 결과 색상 (긍정적) */
  --color-result-good: #10B981;   /* 민트 - "잘했어요" */
  --color-result-better: #3B82F6; /* 파랑 - "더 좋아졌어요" */
  --color-result-neutral: #6B7280; /* 회색 - 중립 */
  
  /* ❌ 경고/위험 색상 사용 금지 */
  /* --color-warning: #F59E0B; */
  /* --color-danger: #EF4444; */
}
```

## 4.2 결과 화면 디자인 (중립적)

```typescript
// src/components/results/GameResultCard.tsx

import React from 'react';

interface GameResultCardProps {
  completionTime: number;
  errors: number;
  previousBest?: number;
}

export function GameResultCard({ 
  completionTime, 
  errors, 
  previousBest 
}: GameResultCardProps) {
  // 개인 기록 대비만 표시 (정상 범위 비교 ❌)
  const isPersonalBest = previousBest && completionTime < previousBest;
  
  return (
    <div className="bg-slate-800 rounded-2xl p-6 mx-4">
      {/* 게임 완료 축하 메시지 */}
      <div className="text-center mb-6">
        <span className="text-4xl">🎮</span>
        <h2 className="text-xl font-bold text-white mt-2">
          훈련 완료!
        </h2>
      </div>
      
      {/* 결과 수치 */}
      <div className="space-y-4">
        <ResultRow 
          label="완료 시간" 
          value={`${completionTime.toFixed(1)}초`}
          icon="⏱️"
        />
        <ResultRow 
          label="실수 횟수" 
          value={`${errors}회`}
          icon="👆"
        />
        
        {/* 개인 최고 기록 대비 (선택적) */}
        {previousBest && (
          <div className="pt-4 border-t border-slate-700">
            <p className="text-sm text-gray-400 text-center">
              {isPersonalBest ? (
                <span className="text-emerald-400">
                  🎉 개인 최고 기록 갱신!
                </span>
              ) : (
                <span>
                  최고 기록: {previousBest.toFixed(1)}초
                </span>
              )}
            </p>
          </div>
        )}
      </div>
      
      {/* ❌ 아래는 절대 표시하지 않음 */}
      {/* <ScoreBadge score={85} /> */}
      {/* <NormalRangeIndicator isNormal={false} /> */}
      {/* <GradeDisplay grade="경도 이상" /> */}
      {/* <WarningMessage>인지기능 저하 의심</WarningMessage> */}
      
      {/* 면책조항 */}
      <p className="text-xs text-gray-500 text-center mt-6">
        이 기록은 게임 결과이며 의학적 의미가 없습니다
      </p>
    </div>
  );
}
```

## 4.3 앱 아이콘 및 스플래시 (비의료 느낌)

```
앱 아이콘 디자인 가이드:

✅ 사용할 요소:
- 두뇌/퍼즐 모양 (추상적, 게임 느낌)
- 밝은 그라데이션 (파랑-보라)
- 둥근 모서리
- 플레이 버튼, 게임패드 느낌

❌ 피할 요소:
- 심전도/의료 그래프
- 청진기, 십자가 등 의료 심볼
- 빨강/흰색 의료 색상 조합
- 심장, 뇌 해부학적 이미지
```

---

# 📁 5. 프로젝트 구조

```
cognitrack/
├── public/
│   ├── icons/                     # 앱 아이콘 (비의료 디자인)
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── DisclaimerBanner.tsx   # 면책조항 배너 (필수)
│   │   │   └── index.ts
│   │   │
│   │   ├── games/                     # "검사" → "게임"
│   │   │   ├── NumberConnectGame.tsx  # NCT-A
│   │   │   ├── NumberLetterGame.tsx   # NCT-B
│   │   │   ├── ColorWordGame.tsx      # Stroop
│   │   │   ├── AnimalNamingGame.tsx
│   │   │   ├── LineTracingGame.tsx
│   │   │   ├── ReactionGame.tsx       # CRT
│   │   │   └── index.ts
│   │   │
│   │   ├── results/                   # "평가" → "결과"
│   │   │   ├── GameResultCard.tsx
│   │   │   ├── RecordList.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── charts/
│   │   │   ├── TrendChart.tsx         # 정상범위 표시 없음
│   │   │   ├── RecordCalendar.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── layout/
│   │       ├── Layout.tsx
│   │       ├── Header.tsx
│   │       ├── BottomNav.tsx
│   │       └── index.ts
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── GameSelectPage.tsx         # "검사 선택" → "게임 선택"
│   │   ├── GamePlayPage.tsx           # "검사 수행" → "게임 플레이"
│   │   ├── RecordsPage.tsx            # "결과/히스토리" → "내 기록"
│   │   ├── ProfilePage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── DisclaimerPage.tsx         # 전체 면책조항
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   ├── useGameSession.ts
│   │   ├── useRecords.ts
│   │   └── index.ts
│   │
│   ├── stores/
│   │   ├── userStore.ts
│   │   ├── recordStore.ts             # "testStore" → "recordStore"
│   │   ├── settingsStore.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── games.ts                   # "tests.ts" → "games.ts"
│   │   ├── record.ts                  # "result.ts" → "record.ts"
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── gameGenerators.ts          # "testGenerators.ts"
│   │   ├── recordUtils.ts             # "scoringUtils.ts"
│   │   ├── dateUtils.ts
│   │   └── index.ts
│   │
│   ├── constants/
│   │   ├── appInfo.ts
│   │   ├── disclaimer.ts              # 면책조항 (필수)
│   │   ├── gameConfig.ts
│   │   └── index.ts
│   │
│   ├── db/
│   │   ├── database.ts
│   │   └── index.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── dist/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── netlify.toml
├── package.json
└── README.md
```

---

# ⚠️ 6. 금지 사항 체크리스트

## 6.1 코드 작성 시 절대 금지

```typescript
// ❌ 절대 사용 금지 용어/변수명

// 의료 관련 용어
const diagnosis = ...;           // ❌
const patient = ...;             // ❌
const assessment = ...;          // ❌
const clinicalScore = ...;       // ❌
const hepaticEncephalopathy = ...;  // ❌
const westHavenGrade = ...;      // ❌

// 정상/비정상 판정
const isNormal = ...;            // ❌
const isAbnormal = ...;          // ❌
const normalRange = ...;         // ❌
const cutoffValue = ...;         // ❌

// 점수/등급 계산
const zScore = ...;              // ❌
const percentile = ...;          // ❌
const grade = ...;               // ❌
const severity = ...;            // ❌

// 경고/알림
const warning = ...;             // ❌
const alert = ...;               // ❌ (단, 시스템 alert는 OK)
const deterioration = ...;       // ❌
const worsening = ...;           // ❌


// ✅ 대신 사용할 용어/변수명

// 게임/훈련 관련
const gameResult = ...;          // ✅
const user = ...;                // ✅
const training = ...;            // ✅
const record = ...;              // ✅

// 시간/횟수만 기록
const completionTime = ...;      // ✅
const reactionTime = ...;        // ✅
const errorCount = ...;          // ✅
const correctCount = ...;        // ✅

// 개인 기록 대비
const personalBest = ...;        // ✅
const previousRecord = ...;      // ✅
const averageTime = ...;         // ✅
```

## 6.2 UI 텍스트 금지 사항

```typescript
// src/constants/forbiddenTexts.ts

// ❌ UI에 절대 표시하지 않을 문구
export const FORBIDDEN_TEXTS = [
  // 진단 관련
  '진단', 'diagnosis', '평가', 'assessment', 'evaluation',
  '검사', 'test', 'examination', '판정', 'determination',
  
  // 환자 관련  
  '환자', 'patient', '간성뇌증', 'hepatic encephalopathy', 'HE',
  '간질환', 'liver disease', '간경변', 'cirrhosis',
  
  // 점수/등급
  '점수', 'score', '등급', 'grade', '단계', 'stage',
  'Z-score', '백분위', 'percentile', 'PHES',
  'West Haven', '정상', 'normal', '비정상', 'abnormal',
  
  // 경고
  '경고', 'warning', '주의', 'caution', '위험', 'danger',
  '악화', 'worsening', 'deterioration', '호전', 'improvement',
  
  // 의료 행위
  '치료', 'treatment', '처방', 'prescription',
  '모니터링', 'monitoring', '추적관찰', 'follow-up',
];
```

## 6.3 기능 금지 체크리스트

```
빌드 전 반드시 확인:

□ Z-score 계산 로직이 없는가?
□ 정상 범위(normative data) 비교가 없는가?
□ PHES 점수 산출이 없는가?
□ West Haven 등급 추정이 없는가?
□ "정상/비정상" 판정이 없는가?
□ "악화/호전" 판정이 없는가?
□ 자동 경고/알림이 없는가?
□ 의료 관련 용어가 UI에 없는가?
□ 면책조항이 모든 결과 화면에 있는가?
□ 앱 시작 시 동의 화면이 있는가?
```

---

# 🚀 7. 개발 일정

## Phase 1: 기본 설정 (3일)

| 날짜 | 작업 | 체크 |
|------|------|------|
| Day 1 | 프로젝트 생성, 기본 설정 | □ |
| Day 1 | 면책조항 상수 및 컴포넌트 | □ |
| Day 2 | 레이아웃, 네비게이션 | □ |
| Day 2 | 시작 동의 화면 (필수) | □ |
| Day 3 | 공통 컴포넌트, 스타일 | □ |

## Phase 2: 게임 개발 (7일)

| 날짜 | 작업 | 체크 |
|------|------|------|
| Day 4-5 | 숫자 연결 게임 | □ |
| Day 6 | 숫자-문자 연결 게임 | □ |
| Day 7 | 색상 단어 챌린지 | □ |
| Day 8 | 반응속도 챌린지 | □ |
| Day 9 | 선 따라가기 게임 | □ |
| Day 10 | 동물 이름 말하기 | □ |

## Phase 3: 기록 및 시각화 (5일)

| 날짜 | 작업 | 체크 |
|------|------|------|
| Day 11-12 | 기록 저장 (IndexedDB) | □ |
| Day 13 | 기록 목록 화면 | □ |
| Day 14 | 추세 그래프 (중립적) | □ |
| Day 15 | 데이터 내보내기 | □ |

## Phase 4: 마무리 (3일)

| 날짜 | 작업 | 체크 |
|------|------|------|
| Day 16 | 프로필, 설정 화면 | □ |
| Day 17 | PWA 설정, 최적화 | □ |
| Day 18 | 금지사항 최종 점검, 배포 | □ |

### 총 개발 기간: 약 3주 (18일)

---

# ✅ 8. 최종 점검 체크리스트

## 배포 전 필수 확인

### A. 법적 안전성

```
□ 앱 이름이 "CogniTrack" 또는 유사한 비의료 이름인가?
□ 앱 설명에 "의료", "진단", "검사" 단어가 없는가?
□ 앱 카테고리가 "Health & Fitness"인가? (Medical ❌)
□ 시작 시 면책조항 동의 화면이 있는가?
□ 모든 결과 화면에 면책조항 배너가 있는가?
□ 설정 > 정보에서 전체 면책조항 확인 가능한가?
```

### B. 용어/표현

```
□ "환자" → "사용자"로 변경되었는가?
□ "검사" → "게임/훈련"으로 변경되었는가?
□ "점수" → "기록/시간"으로 변경되었는가?
□ "정상/비정상" 판정이 제거되었는가?
□ "경고/알림" 기능이 제거되었는가?
□ 의료 관련 용어가 코드/UI에 없는가?
```

### C. 기능

```
□ Z-score 계산이 없는가?
□ 정상 범위 데이터(normative data)가 없는가?
□ PHES 점수 산출이 없는가?
□ West Haven 등급 추정이 없는가?
□ 악화/호전 자동 판정이 없는가?
□ 의료 결정 지원 기능이 없는가?
```

### D. 시각화

```
□ 그래프에 "정상 범위" 표시가 없는가?
□ 그래프에 "경고" 마커가 없는가?
□ 색상이 의료 느낌(빨강 경고 등)이 아닌가?
□ 추세 설명이 중립적인가?
```

---

# 📝 9. 부록: 안전한 표현 예시

## 결과 메시지 예시

```typescript
// src/constants/messages.ts

// ✅ 안전한 결과 메시지
export const RESULT_MESSAGES = {
  complete: '훈련 완료!',
  personalBest: '🎉 개인 최고 기록!',
  improved: '이전보다 빨라졌어요!',
  consistent: '꾸준히 하고 계시네요!',
  firstTime: '첫 번째 기록이에요!',
};

// ❌ 사용 금지 메시지
// '정상 범위입니다'
// '주의가 필요합니다'
// '인지기능이 저하되었습니다'
// '의사와 상담하세요'
// '악화 추세입니다'
```

## 그래프 라벨 예시

```typescript
// ✅ 안전한 Y축 라벨
'완료 시간 (초)'
'반응 시간 (ms)'
'정답 수'

// ❌ 사용 금지 Y축 라벨
// '인지 점수'
// 'Z-score'
// 'PHES 점수'
// '정상 범위'
```

---

# 🔒 10. 법적 고지

본 문서는 규제 회피를 위한 기술적 가이드라인이며, 
법률 자문이 아닙니다. 실제 앱 배포 전에는 반드시:

1. 식약처 "의료기기 해당 여부 질의"를 통해 공식 확인
2. 필요시 법률 전문가 자문

을 권장합니다.

---

*문서 버전: 1.0.0*
*작성일: 2026년 1월*
*목적: Vibe Coding 개발 지침*
