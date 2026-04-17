export const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g
export const INLINE_CODE_PATTERN = /`[^`]+`/g

export { isPlannerAgent, isNonOmoAgent, getUltraworkMessage } from "./ultrawork"
export { SEARCH_PATTERN, SEARCH_MESSAGE } from "./search"
export { ANALYZE_PATTERN, ANALYZE_MESSAGE } from "./analyze"

import { getUltraworkMessage } from "./ultrawork"
import { SEARCH_PATTERN, SEARCH_MESSAGE } from "./search"

export type KeywordDetector = {
  pattern: RegExp
  message: string | ((agentName?: string, modelID?: string) => string)
}

export const KEYWORD_DETECTORS: KeywordDetector[] = [
  {
    pattern: /\b(ultrawork|ulw)\b/i,
    message: getUltraworkMessage,
  },
  {
    pattern: SEARCH_PATTERN,
    message: SEARCH_MESSAGE,
  },
  {
    pattern:
      /\b(analyze|analyse|investigate|examine|research|study|deep[\s-]?dive|inspect|audit|evaluate|assess|review|diagnose|scrutinize|dissect|debug|comprehend|interpret|breakdown|understand)\b|why\s+is|how\s+does|how\s+to|분석|조사|파악|연구|검토|진단|이해|설명|원인|이유|뜯어봐|따져봐|평가|해석|디버깅|디버그|어떻게|왜|살펴|分析|調査|解析|検討|研究|診断|理解|説明|検証|精査|究明|デバッグ|なぜ|どう|仕組み|调查|检查|剖析|深入|诊断|解释|调试|为什么|原理|搞清楚|弄明白|phân tích|điều tra|nghiên cứu|kiểm tra|xem xét|chẩn đoán|giải thích|tìm hiểu|gỡ lỗi|tại sao/i,
    message: `[analyze-mode]
ANALYSIS MODE. Gather context before diving deep:
CONTEXT GATHERING (parallel):
- 1-2 explore agents (codebase patterns, implementations)
- 1-2 librarian agents (if external library involved)
- Direct tools: Grep, AST-grep, LSP for targeted searches

IF COMPLEX - DO NOT STRUGGLE ALONE. Consult specialists:
- **Oracle**: Conventional problems (architecture, debugging, complex logic)
- **Artistry**: Non-conventional problems (different approach needed)

SYNTHESIZE findings before proceeding.
---
MANDATORY delegate_task params: ALWAYS include load_skills=[] and run_in_background when calling delegate_task.
Example: delegate_task(subagent_type="explore", prompt="...", run_in_background=true, load_skills=[])`,
  },
  {
    pattern: /\b(implement|add\s+\w+|create\s+\w+|fix\s+\w+|build\s+\w+|tdd|test-first|test\s+first|red-green|refactor)\b/i,
    message: `[autopolit]
🤖 AUTOPOLIT WORKFLOW ACTIVATED

You are running with the integrated workflow: oh-my-openagent + Superpowers + OpenSpec + Code-Review-Graph

🔄 WORKFLOW SEQUENCE (MANDATORY):
1. EXPLORE → 2. SPEC → 3. DESIGN VERIFICATION → 4. DEV → 5. VERIFY → 6. ARCHIVE

📋 EXECUTION RULES:
• EXPLORE: Use CRG (Code-Review-Graph) to analyze codebase structure first
• SPEC: Generate proposal → specs → design → tasks (2-5 min each)
• DESIGN VERIFICATION: Verify all assumptions (module paths, types, APIs exist) - BLOCKS DEV if unverified
• DEV: TDD enforcement - RED (write test) → GREEN (implement) → REFACTOR
• VERIFY: Self-check (no TODOs, no placeholders, no AI-slop) + User approval
• ARCHIVE: Merge delta specs to main specs

⚠️ FORBIDDEN:
• No implementation without exploration
• No code without RED test first
• No skipping phases (must follow EXPLORE→SPEC→DESIGN_VERIFY→DEV→VERIFY→ARCHIVE)

✅ USE AVAILABLE TOOLS:
• task() - delegate to specialized agents
• LSP/AST tools - refactoring, diagnostics
• CRG tools - code analysis
• Explore/Librarian - context gathering`,
  },
]
