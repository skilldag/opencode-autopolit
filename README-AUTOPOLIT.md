# opencode-autopolit

强制工作流框架 - 探索→规范→验证→开发(TDD)→验证→归档

## 概述

基于 oh-my-openagent + OpenSpec + Superpowers 的集成开发框架，强制执行规范驱动+测试驱动的开发流程。

## 核心工作流

```
EXPLORE → SPEC → DESIGN VERIFICATION → DEV → VERIFY → ARCHIVE
   ↓          ↓           ↓                  ↓       ↓         ↓
  CRG     Proposal    假设验证          TDD    Checklists  Merge
        Specs/Design  (BLOCKS DEV)    RED→GR→RF  User Approval
```

## 安装

在 `opencode.json` 中添加插件：

```json
{
  "plugin": [
    "file:///Users/meetai/opencode-autopolit/dist/index.js"
  ]
}
```

重启 OpenCode 生效。

## 使用方式

### 自动触发

当输入以下关键词时，自动触发 workflow：

| 关键词 | 触发 |
|--------|------|
| `implement xxx` | ✅ |
| `add xxx` | ✅ |
| `create xxx` | ✅ |
| `fix xxx` | ✅ |
| `build xxx` | ✅ |
| `tdd` | ✅ |
| `test-first` | ✅ |
| `refactor` | ✅ |

### 手动触发

也可以使用 slash command（如果配置了对应 skill）：

```
/autopolit implement user login
```

## 工作流阶段

### 1. EXPLORE - 探索阶段
- 使用 CRG (Code-Review-Graph) 分析代码库
- 生成假设清单 (assumption list)

### 2. SPEC - 规范阶段
- 生成 proposal → specs → design → tasks
- 每个文档 2-5 分钟粒度

### 3. DESIGN VERIFICATION - 设计验证（新增）
- 验证所有假设：模块路径、类型、API 是否存在
- **阻塞 DEV 阶段直到所有假设验证通过**

### 4. DEV - 开发阶段
- TDD 强制：RED (写测试) → GREEN (实现) → REFACTOR
- 禁止跳过测试直接写代码

### 5. VERIFY - 验证阶段
- 自检清单：无 TODO、无占位符、无 AI-slop
- 用户确认

### 6. ARCHIVE - 归档阶段
- 合并 delta specs 到主分支

## 触发效果

输入 `implement user login` 后，Agent 会收到：

```
🤖 AUTOPOLIT WORKFLOW ACTIVATED

🔄 WORKFLOW SEQUENCE (MANDATORY):
1. EXPLORE → 2. SPEC → 3. DESIGN VERIFICATION → 4. DEV → 5. VERIFY → 6. ARCHIVE
```

## 模块结构

```
src/features/spec-driven-workflow/
├── exploration-phase.ts      # 探索阶段管理
├── specification-phase.ts    # 规范阶段管理  
├── design-verification.ts    # 设计验证阶段
├── tdd-phase.ts              # TDD 强制执行
├── workflow-orchestrator.ts  # 工作流编排
├── verification-phase.ts     # 验证阶段
├── archival-phase.ts         # 归档阶段
└── index.ts                  # 导出
```

## 依赖

- oh-my-openagent
- openspec
- superpowers
- code-review-graph (MCP)
- wechat-acp (可选)