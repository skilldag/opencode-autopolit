# opencode-autopolit

강제 워크플로우 프레임워크 - 탐색→사양→설계검증→개발(TDD)→검증→아카이브

## 개요

oh-my-openagent + OpenSpec + Superpowers를 통합한 개발 프레임워크. 사양 중심 + 테스트 중심 개발 프로세스를 강제执行합니다.

## 코어 워크플로우

```
EXPLORE → SPEC → DESIGN VERIFICATION → DEV → VERIFY → ARCHIVE
   ↓       ↓           ↓              ↓       ↓         ↓
  CRG   Proposal    가설 검증       TDD    Checklists   Merge
       Specs/Design              RED→GR→RF  User Approval
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
- 가설 목록 (assumption list) 생성

### 2. SPEC - 사양 단계
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
1. EXPLORE → 2. SPEC → 3. DESIGN VERIFICATION → 4. DEV → 5. VERIFY → 6. ARCHIVE
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

---

[English](README.md) | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | [Русский](README.ru.md)