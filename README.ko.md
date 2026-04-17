# opencode-autopolit

강제 워크플로우 프레임워크 - 탐색→사양→설계검증→개발(TDD)→검증→아카이브

[English](README.md) | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | **한국어** | [Русский](README.ru.md)

## 개요

oh-my-openagent + OpenSpec + Superpowers를 통합한 개발 프레임워크. 사양 중심 + 테스트 중심 개발 프로세스를 강제执行합니다.

## 코어 워크플로우

```
EXPLORE → BRAINSTORM → SPEC → DESIGN VERIFICATION → DEV → VERIFY → ARCHIVE
   ↓         ↓          ↓           ↓              ↓       ↓         ↓
  CRG    가설+위험+아이디어 Proposal  가설 검증       TDD    Checklists   Merge
                     SPEC에 입력   RED→GR→RF  User Approval
                     (BLOCKS DEV)
```

## 프레임워크 비교 분석

### 기존 솔루션의 문제

| 프레임워크 | 핵심 강점 | 핵심 결함 |
|------------|-----------|-----------|
| **oh-my-openagent** | 강력한 플러그인 시스템, hooks 메커니즘, 워크플로우 기획 | 사양 중심 워크플로우가 부족하여 "생각나는 대로 작성"하기 쉬움 |
| **OpenSpec** | 사양 문서 체계 (proposal→specs→design→tasks) | 문서 도구만 있고 집행 구속력 없어 건너뛸 수 있음 |
| **Superpowers** | 풍부한 skills 라이브러리 (TDD, debugging, code review) | 수동 호출 필요, Agent가 종종 무시하거나 잊음 |
| **Code-Review-Graph** | 코드 구조 분석, 의존 관계, 영향 반경 | "뒷북"에 불과, 설계 오류 예방 불가 |
| **WeChat-ACP** | 위챗 알림, 진행 동기화 | 알림만 하고 워크플로우 통합 없음 |

### 핵심 갈등

1. **사양 vs 임의**: OpenSpec은 사양을 제공하지만, Agent가 건너뛰고 바로 코드 작성 가능
2. **설계 vs 구현**: 코딩할 때 모듈이 존재한다고 가정하고 구현 시才发现不存在
3. **도구 vs 행동**: 좋은 도구가 여러 개 있지만, Agent가 반드시 사용한다는 보장 없음

### 솔루션: 강제 워크플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                     opencode-autopolit                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐   ┌─────────┐   ┌──────────────┐   ┌───────────┐  │
│  │  CRG    │ + │OpenSpec │ + │DESIGN        │ + │Superpowers│  │
│  │탐색분석  │   │문서사양  │   │VERIFICATION  │   │스킬 실행  │  │
│  └────┬────┘   └────┬────┘   └──────┬───────┘   └─────┬─────┘  │
│       │            │              │                  │         │
│       ▼            ▼              ▼                  ▼         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              강제 워크플로우 오케스트레이터                │   │
│  │  EXPLORE → SPEC → DESIGN VERIFY → DEV → VERIFY → ARCHIVE │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 왜 이렇게 하는가

|痛点|솔루션|효과|
|------|----------|------|
|모듈이 존재한다고 가정하지만 실제로는 존재하지 않음|DESIGN VERIFICATION 단계에서 모든 가설 검증|컴파일 전에 오류 발견|
|TDD를 건너뛰고 바로 코드 작성|tdd-phase가 RED→GREEN→REFACTOR 강제|테스트 커버리지 향상|
|사양 문서가 무시됨|workflow에 통합, 각 단계 완료 필수|사양 100% 구현|
|여러 도구가 각각 따로 움직임|统통합 트리거 메커니즘 (keyword-detector)|도구 연계|
|사후 코드 리뷰|CRG가 EXPLORE 단계에서 사전 분석|예방优于 치료|
|엣지 케이스/위험 놓침|BRAINSTORM 단계에서 심층 사고|코딩 전에 충분히 준비|

### 핵심 혁신: BRAINSTORM 단계

CRG (Code-Review-Graph) 는 코드 구조를 찾지만, 다음과 같은 것은 생각하지 못함:
- 비즈니스 로직 엣지 케이스
- 사용자 요구사항 모호함
- 잠재적인 보안 취약점
- 새 기능의 성능 병목

BRAINSTORM 단계는 **Prometheus** (계획 컨설턴트) 또는 **Oracle** 을 사용:
1. 가설에质疑 - "입력이 빈/null/무효라면?"
2. 위험 식별 - "프로덕션 환경에서 무엇이 실패할 수 있겠음?"
3 대안 탐색 - "더 간단한 솔루션이 있겠음?"
4. 문제 제기 - "요구가 불분명: 사용자가 X를 명확히 해야 함"

출력은 SPEC에 입력 - 스펙은 모든 브레인스토밍 발견을 다루어야 함.

### 핵심 혁신: DESIGN VERIFICATION

이는 "AI 환각 코딩"을 해결하는 핵심입니다:

```
코딩할 때의 가정:
✗ import from 'shared/types'       → 실제 경로: '@shared/types'
✗ use createHook()                 → 실제 API: createHooks()
✗ class UserService exists         → 실제: UserAPI

DESIGN VERIFICATION가 하는 일:
1. 모든 import 문解析
2. 모듈 경로是否存在 확인
3. API 이름일치 여부 검증
4. 타입 정의是否存在 확인
5. 검증 보고서 생성, DEV 단계 차단 - 모든 가설이 통과할 때까지
```

## 설치

`opencode.json`에 플러그인 추가:

```json
{
  "plugin": [
    "file:///Users/meetai/opencode-autopolit/dist/index.js"
  ]
}
```

OpenCode 재시작으로 활성화.

## 사용법

### 자동 트리거

다음 키워드를 입력하면 자동으로 workflow 트리거:

| 키워드 | 트리거 |
|--------|--------|
| `implement xxx` | ✅ |
| `add xxx` | ✅ |
| `create xxx` | ✅ |
| `fix xxx` | ✅ |
| `build xxx` | ✅ |
| `tdd` | ✅ |
| `test-first` | ✅ |
| `refactor` | ✅ |

### 수동 트리거

 slash command도 사용 가능 (해당 skill이 설정된 경우):

```
/autopolit implement user login
```

## 워크플로우 단계

### 1. EXPLORE - 탐색 단계
- CRG (Code-Review-Graph)로 코드베이스 분석
- 코드 구조 맵, 핵심 컴포넌트, 통합 포인트 생성
- 출력은 Brainstorm 단계로 전달

### 2. BRAINSTORM - 브레인스토밍 단계 (신규 추가)
- EXPLORE 결과를 바탕으로 심층 사고:
  - **가설 보충**: CRG가 놓친 가설 추가
  - **위험 발견**: 잠재적인 함정, 엣지 케이스, 레이스 상태 식별
  - **솔루션 탐색**: 여러 구현 접근 방식 고려
  - **명확화 질문**: 모호한 요구사항 발견, 사용자 확인 대기
- 출력: 강화된 가설 목록 + 위험 레지스트리 + 명확화 질문
- **SPEC 단계로 입력** - 스펙은 모든 브레인스토밍 결과물을 다루어야 함

### 3. SPEC - 사양 단계
- proposal → specs → design → tasks 생성
- 각 문서 2-5분颗粒도

### 3. DESIGN VERIFICATION - 설계 검증 (신규 추가)
- 모든 가설 검증: 모듈 경로, 타입, API 존재 여부
- **DEV 단계 차단 - 모든 가설 검증 통과까지**

### 4. DEV - 개발 단계
- TDD 강제: RED (테스트 작성) → GREEN (구현) → REFACTOR
- 테스트 건너뛰고 바로 코드 작성 금지

### 5. VERIFY - 검증 단계
-自查清单: TODOなし、プレースホルダーなし、AI-slopなし
- 사용자 확인

### 6. ARCHIVE - 아카이브 단계
- delta specs를 메인 브랜치에 병합

## 트리거 효과

`implement user login` 입력 후, Agent는以下内容을 수신:

```
🤖 AUTOPOLIT WORKFLOW ACTIVATED

🔄 WORKFLOW SEQUENCE (MANDATORY):
1. EXPLORE → 2. BRAINSTORM → 3. SPEC → 4. DESIGN VERIFICATION → 5. DEV → 6. VERIFY → 7. ARCHIVE
```

## 모듈 구조

```
src/features/spec-driven-workflow/
├── exploration-phase.ts # 탐색 단계 관리
├── specification-phase.ts # 사양 단계 관리
├── design-verification.ts # 설계 검증 단계
├── tdd-phase.ts # TDD 강제 실행
├── workflow-orchestrator.ts # 워크플로우 오케스트레이터
├── verification-phase.ts # 검증 단계
├── archival-phase.ts # 아카이브 단계
└── index.ts # 내보내기
```

## 의존성

- oh-my-openagent
- openspec
- superpowers
- code-review-graph (MCP)
- wechat-acp (선택)