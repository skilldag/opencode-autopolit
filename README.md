# opencode-autopolit

Forced Workflow Framework - Explore→Spec→Verify→Develop(TDD)→Verify→Archive

**English** | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Русский](README.ru.md)

## Overview

An integrated development framework based on oh-my-openagent + OpenSpec + Superpowers, enforcing specification-driven + test-driven development process.

## Core Workflow

```
EXPLORE → BRAINSTORM → SPEC → DESIGN VERIFICATION → DEV → VERIFY → ARCHIVE
   ↓         ↓          ↓           ↓              ↓       ↓         ↓
  CRG    Assumptions Proposal    Assumption     TDD    Checklists   Merge
       + Risks + Ideas Specs/Design Verification RED→GR→RF User Approval
       (FEEDS SPEC)  (BLOCKS DEV)
```

## Framework Comparison

### Problems with Existing Solutions

| Framework | Core Strength | Core Weakness |
|-----------|---------------|---------------|
| **oh-my-openagent** | Powerful plugin system, hooks, workflow orchestration | Lacks specification-driven workflow, prone to "write as you think" |
| **OpenSpec** | Structured documentation (proposal→specs→design→tasks) | Documentation only, no enforcement, can be skipped |
| **Superpowers** | Rich skills library (TDD, debugging, code review) | Manual invocation required, Agent often ignores or forgets |
| **Code-Review-Graph** | Code structure analysis, dependencies, impact radius | "Hindsight only", cannot prevent design errors |
| **WeChat-ACP** | WeChat notifications, progress sync | Notifications only, no workflow integration |

### Core Conflicts

1. **Specification vs Arbitrary**: OpenSpec provides specs, but Agent can skip and write code directly
2. **Design vs Implementation**: Assumes modules exist when coding, discovers they don't during implementation
3. **Tools vs Behavior**: Multiple good tools, but Agent doesn't necessarily use them

### Solution: Forced Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     opencode-autopolit                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐   ┌─────────┐   ┌──────────────┐   ┌───────────┐  │
│  │  CRG    │ + │OpenSpec │ + │DESIGN        │ + │Superpowers│  │
│  │Exploratn│   │Document │   │VERIFICATION  │   │Skill Exec │  │
│  └────┬────┘   └────┬────┘   └──────┬───────┘   └─────┬─────┘  │
│       │            │              │                  │         │
│       ▼            ▼              ▼                  ▼         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Forced Workflow Orchestrator                  │   │
│  │  EXPLORE → SPEC → DESIGN VERIFY → DEV → VERIFY → ARCHIVE │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Why We Do This

| Pain Point | Solution | Effect |
|------------|----------|--------|
| Assume module exists but it doesn't | DESIGN VERIFICATION validates all assumptions | Errors found before compilation |
| Skip TDD, write code directly | tdd-phase enforces RED→GREEN→REFACTOR | Improved test coverage |
| Specification docs ignored | Integrated into workflow, each phase required | 100% spec compliance |
| Tools work independently | Unified trigger mechanism (keyword-detector) | Tools work together |
| Post-hoc code review | CRG analyzes in EXPLORE phase | Prevention over cure |
| Missing edge cases / risks | BRAINSTORM phase for deep thinking | Better prepared before coding |

### Key Innovation: BRAINSTORM Phase

CRG (Code-Review-Graph) finds code structure, but it can't think about:
- Business logic edge cases
- User requirement ambiguities
- Potential security vulnerabilities
- Performance bottlenecks in new features

The BRAINSTORM phase uses **Prometheus** (Plan Consultant) or **Oracle** to:
1. Question assumptions - "What if input is empty/null/invalid?"
2. Identify risks - "What could fail in production?"
3. Explore alternatives - "Is there a simpler solution?"
4. Surface questions - "Requirements unclear: user needs to clarify X"

Output feeds into SPEC - specs must address all brainstorm findings.

### Key Innovation: DESIGN VERIFICATION

This solves the "AI hallucination coding" problem:

```
Assumptions when writing code:
✗ import from 'shared/types'       → Actual path: '@shared/types'
✗ use createHook()                 → Actual API: createHooks()
✗ class UserService exists         → Actual: UserAPI

What DESIGN VERIFICATION does:
1. Parse all import statements
2. Check if module paths exist
3. Verify API names match
4. Check if type definitions exist
5. Generate verification report, block DEV until all pass
```

## Installation

Add plugin to `opencode.json`:

```json
{
  "plugin": [
    "file:///Users/meetai/opencode-autopolit/dist/index.js"
  ]
}
```

Restart OpenCode to activate.

## Usage

### Auto Trigger

Workflow triggers automatically when entering these keywords:

| Keyword | Trigger |
|---------|---------|
| `implement xxx` | ✅ |
| `add xxx` | ✅ |
| `create xxx` | ✅ |
| `fix xxx` | ✅ |
| `build xxx` | ✅ |
| `tdd` | ✅ |
| `test-first` | ✅ |
| `refactor` | ✅ |

### Manual Trigger

Also available via slash command (if corresponding skill is configured):

```
/autopolit implement user login
```

## Workflow Phases

### 1. EXPLORE - Exploration Phase
- Use CRG (Code-Review-Graph) to analyze codebase
- Generate code structure map, key components, integration points
- Output feeds into Brainstorm phase

### 2. BRAINSTORM - Brainstorming Phase (New)
- Based on EXPLORE results, conduct deep thinking:
  - **Assumption Supplement**: Add any assumptions missed by CRG
  - **Risk Discovery**: Identify potential pitfalls, edge cases, race conditions
  - **Solution Exploration**: Consider multiple implementation approaches
  - **Clarification Questions**: Surface ambiguous requirements for user input
- Output: Enhanced assumption list + risk register + clarification questions
- **Feeds into SPEC phase** - spec must address all brainstorm outputs

### 3. SPEC - Specification Phase
- Generate proposal → specs → design → tasks
- 2-5 minute granularity per document

### 3. DESIGN VERIFICATION - Design Verification (New)
- Validate all assumptions: module paths, types, API existence
- **Blocks DEV phase until all assumptions verified**

### 4. DEV - Development Phase
- Forced TDD: RED (write test) → GREEN (implement) → REFACTOR
- Forbidden to skip tests and write code directly

### 5. VERIFY - Verification Phase
- Self-check list: no TODO, no placeholders, no AI-slop
- User confirmation

### 6. ARCHIVE - Archival Phase
- Merge delta specs to main branch

## Trigger Effect

After entering `implement user login`, Agent receives:

```
🤖 AUTOPOLIT WORKFLOW ACTIVATED

🔄 WORKFLOW SEQUENCE (MANDATORY):
1. EXPLORE → 2. BRAINSTORM → 3. SPEC → 4. DESIGN VERIFICATION → 5. DEV → 6. VERIFY → 7. ARCHIVE
```

## Module Structure

```
src/features/spec-driven-workflow/
├── exploration-phase.ts     # Exploration phase (CRG analysis)
├── brainstorm-phase.ts      # Brainstorming phase (Prometheus/Oracle)
├── specification-phase.ts   # Specification phase management
├── design-verification.ts   # Design verification phase
├── tdd-phase.ts             # TDD enforcement
├── workflow-orchestrator.ts # Workflow orchestration
├── verification-phase.ts    # Verification phase
├── archival-phase.ts        # Archival phase
└── index.ts                 # Export
```

## Dependencies

- oh-my-openagent
- openspec
- superpowers
- code-review-graph (MCP)
- wechat-acp (optional)