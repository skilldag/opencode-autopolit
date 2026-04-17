# Oh-My-OpenAgent Features.md 分析报告

## 文档概述

**文件位置**: `docs/reference/features.md`

**内容结构**: 8大章节，涵盖 Agents、Category、Skills、Commands、Tools、Hooks、MCPs、Advanced Configuration

---

## 1. Agents — 11个专业AI代理

### 1.1 Core Agents (核心代理)

| Agent | Model | 用途 |
|-------|-------|------|
| **Sisyphus** | claude-opus-4-6 | 默认编排器，规划、委托、执行复杂任务，扩展思考(32k预算) |
| **Hephaestus** | gpt-5.4 | 深度工作者，目标导向执行，深层研究后行动 |
| **Oracle** | gpt-5.4 | 架构决策、代码审查、调试，逻辑推理专家 |
| **Librarian** | minimax-m2.7 | 多仓库分析、文档查找、OSS实现示例 |
| **Explore** | grok-code-fast-1 | 快速代码探索、上下文grep |
| **Multimodal-Looker** | gpt-5.4 | 视觉内容专家，PDF/图片/图表分析 |

### 1.2 Planning Agents (规划代理)

| Agent | Model | 用途 |
|-------|-------|------|
| **Prometheus** | claude-opus-4-6 | 战略规划，访谈模式创建详细工作计划 |
| **Metis** | claude-opus-4-6 | 计划顾问，预分析识别隐藏意图和AI失败点 |
| **Momus** | gpt-5.4 | 计划审查员，验证计划清晰度、可验证性、完整性 |

### 1.3 Orchestration Agents (编排代理)

| Agent | Model | 用途 |
|-------|-------|------|
| **Atlas** | claude-sonnet-4-6 | 待办事项编排器，系统化执行计划任务 |
| **Sisyphus-Junior** | category-dependent | 类别托管的执行器，模型根据任务类别自动选择 |

### 1.4 代理工具限制

- oracle/librarian/explore: 只读(禁止write/edit/task/call_omo_agent)
- multimodal-looker: 仅允许read
- atlas: 禁止delegate
- momus: 禁止write/edit/task

### 1.5 后台代理

- 支持后台运行多个代理
- Tmux集成可实时观察多代理工作
- 核心代理标签切换顺序: Sisyphus(1) → Hephaestus(2) → Prometheus(3) → Atlas(4)

---

## 2. Category System — 类别系统

### 2.1 内置类别 (8个)

| Category | Default Model | 场景 |
|----------|---------------|------|
| visual-engineering | google/gemini-3.1-pro | 前端、UI/UX、设计、样式 |
| ultrabrain | openai/gpt-5.4 (xhigh) | 深度逻辑推理、复杂架构决策 |
| deep | openai/gpt-5.4 (medium) | 目标导向自主解决问题，深层理解 |
| artistry | google/gemini-3.1-pro (high) | 高创意/艺术任务 |
| quick | openai/gpt-5.4-mini | 简单修改、拼写修复 |
| unspecified-low | claude-sonnet-4-6 | 低努力要求 |
| unspecified-high | claude-opus-4-6 (max) | 高努力要求 |
| writing | google/gemini-3-flash | 文档、技术写作 |

### 2.2 类别配置字段

- description, model, variant, temperature, top_p
- prompt_append, thinking, reasoningEffort, textVerbosity
- tools, maxTokens, is_unstable_agent

### 2.3 Sisyphus-Junior

- 类别调用时自动执行
- 不可重新委托，防止无限循环

---

## 3. Skills — 技能系统

### 3.1 内置技能

| Skill | 触发词 | 描述 |
|-------|--------|------|
| git-master | commit, rebase, squash | Git专家，原子提交、风格检测 |
| playwright | Browser tasks | Playwright MCP浏览器自动化 |
| playwright-cli | Browser tasks | Playwright CLI集成 |
| agent-browser | Browser tasks | Vercel agent-browser CLI |
| dev-browser | Stateful browser | 持久化页面状态脚本 |
| frontend-ui-ux | UI/UX tasks | 设计师转开发者，卓越UI/UX |

### 3.2 git-master 核心原则

- 3+文件 → 至少2次提交
- 5+文件 → 至少3次提交
- 10+文件 → 至少5次提交
- 自动分析最近30次提交的语言和风格

### 3.3 浏览器自动化选项

- **Option 1**: Playwright MCP (默认)
- **Option 2**: agent-browser CLI

### 3.4 自定义技能

- 位置: `.opencode/skills/*/SKILL.md`
- 优先级: 项目 → 用户 → Claude Code兼容 → Agents约定

---

## 4. Commands — 命令系统

### 4.1 内置命令

| Command | 描述 |
|---------|------|
| /init-deep | 生成层级AGENTS.md知识库 |
| /ralph-loop | 自循环开发直到完成 |
| /ulw-loop | ultrawork模式循环 |
| /cancel-ralph | 取消Ralph循环 |
| /refactor | 智能重构(LSP+AST-grep+TDD) |
| /start-work | 从Prometheus计划开始执行 |
| /stop-continuation | 停止所有延续机制 |
| /handoff | 创建会话交接文档 |

### 4.2 自定义命令

- 位置: `.opencode/command/*.md`

---

## 5. Tools — 工具系统

### 5.1 代码搜索

- grep: 正则表达式内容搜索
- glob: 文件名模式匹配

### 5.2 编辑工具

- edit: 哈希锚点编辑，LINE#ID格式精确修改

### 5.3 LSP工具

- lsp_diagnostics, lsp_prepare_rename, lsp_rename
- lsp_goto_definition, lsp_find_references, lsp_symbols

### 5.4 AST-Grep工具

- ast_grep_search, ast_grep_replace (支持25种语言)

### 5.5 委托工具

- call_omo_agent: 生成explore/librarian代理
- task: 类别任务委托
- background_output, background_cancel: 后台任务管理

### 5.6 可视化分析

- look_at: 多模态内容分析(PDF/图片/图表)

### 5.7 技能工具

- skill: 加载执行技能/命令
- skill_mcp: 技能嵌入的MCP调用

### 5.8 会话工具

- session_list, session_read, session_search, session_info

### 5.9 任务系统

- task_create, task_get, task_list, task_update
- 支持依赖关系和并行执行
- 存储: `.sisyphus/tasks/`

### 5.10 交互终端

- interactive_bash: Tmux TUI应用支持

---

## 6. Hooks — 生命周期钩子

### 6.1 钩子事件类型

| Event | 时机 | 能力 |
|-------|------|------|
| PreToolUse | 工具执行前 | 阻止、修改输入、注入上下文 |
| PostToolUse | 工具执行后 | 添加警告、修改输出、注入消息 |
| Message | 消息处理时 | 转换内容、检测关键词、激活模式 |
| Event | 会话生命周期 | 恢复、回退、通知 |
| Transform | 上下文转换 | 注入上下文、验证块 |
| Params | API参数设置 | 调整模型设置、努力级别 |

### 6.2 钩子分类

#### 上下文与注入

- directory-agents-injector, directory-readme-injector
- rules-injector, compaction-context-injector
- context-window-monitor, preemptive-compaction

#### 生产力与控制

- keyword-detector, think-mode
- ralph-loop, start-work, auto-slash-command
- stop-continuation-guard, category-skill-reminder, anthropic-effort

#### 质量与安全

- comment-checker, thinking-block-validator
- edit-error-recovery, write-existing-file-guard
- hashline-read-enhancer, hashline-edit-diff-enhancer

#### 恢复与稳定

- session-recovery, anthropic-context-window-limit-recovery
- runtime-fallback, model-fallback, json-error-recovery

#### 截断与上下文

- tool-output-truncator

#### 通知与UX

- auto-update-checker, background-notification
- session-notification, agent-usage-reminder, question-label-truncator

#### 任务管理

- task-resume-info, delegate-task-retry
- empty-task-response-detector, tasks-todowrite-disabler

#### 延续

- todo-continuation-enforcer, compaction-todo-preserver
- unstable-agent-babysitter

#### 集成

- claude-code-hooks, atlas, interactive-bash-session, non-interactive-env

#### 专业化

- prometheus-md-only, no-sisyphus-gpt, no-hephaestus-non-gpt
- sisyphus-junior-notepad

---

## 7. MCPs — 模型上下文协议

### 7.1 内置MCP (3个)

| MCP | 描述 |
|-----|------|
| websearch | Exa/Tavily搜索 |
| context7 | 上下文搜索 |
| grep_app | Grep应用 |

### 7.2 MCP加载方式

- 插件内置: src/mcp/
- Claude Code: .mcp.json
- 技能嵌入: SKILL.md YAML

---

## 8. Advanced Configuration — 高级配置

### 8.1 重命名兼容

- 包名: oh-my-opencode (保持)
- 配置兼容: oh-my-openagent.jsonc / oh-my-opencode.jsonc

### 8.2 回退模型

- 支持数组配置混合字符串和对象
- 对象可微调备份模型本身

### 8.3 文件提示

- file:// 加载外部提示文件
- 支持 ~ 扩展和相对路径

### 8.4 会话恢复

- 自动恢复: 缺失工具结果、思维块违规、空消息
- 上下文窗口限制、JSON解析错误

---

## 总结

此文档是Oh-My-OpenAgent的功能参考手册，涵盖了:

1. **多代理系统**: 11个专业代理，覆盖核心、规划、编排角色
2. **智能分类**: 8个预置类别，支持自定义配置
3. **技能生态**: 6个内置技能，支持MCP集成
4. **命令工作流**: 8个Slash命令，自定义扩展
5. **完整工具链**: 26个工具，覆盖开发全流程
6. **生命周期钩子**: 52个钩子，深度定制行为
7. **MCP集成**: 3个内置MCP，支持扩展
8. **高级配置**: 回退、文件提示、会话恢复

整体架构设计围绕**多代理协作**、**智能任务委托**、**深度定制**三个核心能力展开。