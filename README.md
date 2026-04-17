# opencode-autopolit

强制工作流框架 - 探索→规范→验证→开发(TDD)→验证→归档

**English** | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Русский](README.ru.md)

## 概述

基于 oh-my-openagent + OpenSpec + Superpowers 的集成开发框架，强制执行规范驱动+测试驱动的开发流程。

## 核心工作流

```
EXPLORE → SPEC → DESIGN VERIFICATION → DEV → VERIFY → ARCHIVE
   ↓          ↓           ↓                  ↓       ↓         ↓
  CRG     Proposal    假设验证          TDD    Checklists  Merge
        Specs/Design  (BLOCKS DEV)    RED→GR→RF  User Approval
```

## 框架对比分析

### 现有方案的问题

| 框架 | 核心优势 | 核心缺陷 |
|------|----------|----------|
| **oh-my-openagent** | 强大的插件系统、hooks 机制、workflow 编排 | 缺少规范驱动的工作流，容易"想到什么写什么" |
| **OpenSpec** | 规范的文档体系 (proposal→specs→design→tasks) | 仅为文档工具，无执行约束力，可被跳过 |
| **Superpowers** | 丰富的 skills 库 (TDD, debugging, code review) | 需手动调用，Agent 常忽略或遗忘 |
| **Code-Review-Graph** | 代码结构分析、依赖关系、影响半径 | 属于"事后诸葛亮"，无法预防设计错误 |
| **WeChat-ACP** | 微信通知、进度同步 | 仅做通知，无工作流整合 |

### 核心矛盾

1. **规范 vs 随意**: OpenSpec 提供规范，但 Agent 可跳过直接写代码
2. **设计 vs 实现**: 写代码时假设模块存在，实现时才发现不存在
3. **工具 vs 行为**: 多个好工具，但 Agent 不一定会用

### 解决方案：强制工作流

```
┌─────────────────────────────────────────────────────────────────┐
│                     opencode-autopolit                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐   ┌─────────┐   ┌──────────────┐   ┌───────────┐  │
│  │  CRG    │ + │OpenSpec │ + │DESIGN        │ + │Superpowers│  │
│  │探索分析  │   │文档规范  │   │VERIFICATION  │   │技能执行   │  │
│  └────┬────┘   └────┬────┘   └──────┬───────┘   └─────┬─────┘  │
│       │            │              │                  │         │
│       ▼            ▼              ▼                  ▼         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              强制工作流编排器                             │   │
│  │  EXPLORE → SPEC → DESIGN VERIFY → DEV → VERIFY → ARCHIVE │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 为什么这样做

| 痛点 | 解决方案 | 效果 |
|------|----------|------|
| 假设模块存在但实际不存在 | DESIGN VERIFICATION 阶段验证所有假设 | 编译前发现错误 |
| 跳过 TDD 直接写代码 | tdd-phase 强制 RED→GREEN→REFACTOR | 测试覆盖率提升 |
| 规范文档被忽视 | 集成到 workflow，每阶段必须完成 | 规范 100% 落地 |
| 多个工具各自为政 | 统一触发机制 (keyword-detector) | 工具协同工作 |
| 事后代码 Review | CRG 在 EXPLORE 阶段提前分析 | 预防优于治疗 |

### 关键创新：DESIGN VERIFICATION

这是解决"AI 幻觉编码"的核心：

```
编写代码时的假设:
✗ import from 'shared/types'       → 实际路径: '@shared/types'
✗ use createHook()                 → 实际 API: createHooks()
✗ class UserService exists         → 实际: UserAPI

DESIGN VERIFICATION 做什么:
1. 解析所有 import 语句
2. 检查模块路径是否存在
3. 验证 API 名称是否匹配
4. 检查类型定义是否存在
5. 生成验证报告，阻塞 DEV 阶段直到全部通过
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