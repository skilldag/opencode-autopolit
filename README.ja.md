# opencode-autopolit

強制ワークフローフレームワーク - 探索→仕様→設計検証→開発(TDD)→検証→アーカイブ

[English](README.md) | [简体中文](README.zh-cn.md) | **日本語** | [한국어](README.ko.md) | [Русский](README.ru.md)

## 概要

oh-my-openagent + OpenSpec + Superpowers を統合した開発フレームワーク。仕様駆動＋テスト駆動の開発プロセスを強制執行します。

## コアワークフロー

```
EXPLORE → BRAINSTORM → SPEC → DESIGN VERIFICATION → DEV → VERIFY → ARCHIVE
   ↓         ↓          ↓           ↓              ↓       ↓         ↓
  CRG    仮定+リスク+ SPEC     仮定検証        TDD    Checklists   Merge
               アイデア Proposal              RED→GR→RF  User Approval
               (SPECに入力)  (BLOCKS DEV)
```

## フレームワーク比較分析

### 既存ソリューションの問題

| フレームワーク | コア強み | コア欠点 |
|----------------|----------|----------|
| **oh-my-openagent** | 強力なプラグインシステム、hooks機構、ワークフロー編成 | 仕様駆動のワークフローが欠けており、「思った通りに書く」傾向がある |
| **OpenSpec** | 仕様ドキュメント体系 (proposal→specs→design→tasks) | ドキュメントツールのみ、執行拘束力なくスキップ可能 |
| **Superpowers** | 豊富なskillsライブラリ (TDD, debugging, code review) | 手動呼び出しが必要、Agentは使い方を忘れることが多い |
| **Code-Review-Graph** | コード構造分析、依存関係、インパクト半径 | 「後出しジャンケン」、設計ミスの予防做不到 |
| **WeChat-ACP** | WeChat通知、進捗同期 | 通知のみ、ワークフロー統合なし |

### コアコンフリクト

1. **仕様 vs 任意**: OpenSpecは仕様を提供するが、Agentはスキップしてコードを直接書ける
2. **設計 vs 実装**: コードを書く時にモジュールが存在すると仮定し、実装時に初めて存在しないことが分かる
3. **ツール vs 行動**: 良いツールが多いが、Agentが必ずしも使うとは限らない

### ソリューション：強制ワークフロー

```
┌─────────────────────────────────────────────────────────────────┐
│                     opencode-autopolit                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐   ┌─────────┐   ┌──────────────┐   ┌───────────┐  │
│  │  CRG    │ + │OpenSpec │ + │DESIGN        │ + │Superpowers│  │
│  │探索分析  │   │文書仕様  │   │VERIFICATION  │   │スキル実行 │  │
│  └────┬────┘   └────┬────┘   └──────┬───────┘   └─────┬─────┘  │
│       │            │              │                  │         │
│       ▼            ▼              ▼                  ▼         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              強制ワークフローorchestrator                 │   │
│  │  EXPLORE → SPEC → DESIGN VERIFY → DEV → VERIFY → ARCHIVE │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### なぜ这样做うか

| 痛点 | ソリューション | 効果 |
|------|----------------|------|
| モジュールが存在すると仮定するが実際は存在しない | DESIGN VERIFICATION段階で全ての仮定を検証 | コンパイル前にエラーを発見 |
| TDDをスキップしてコードを直接書く | tdd-phaseがRED→GREEN→REFACTORを強制 | テストカバレッジ向上 |
| 仕様ドキュメントが無視される | workflowに統合、各フェーズ完了必須 | 仕様100%実装 |
| 複数のツールが各自で動く | 統一トリガーメカニズム (keyword-detector) | ツール連携 |
| 事後コードレビュー | CRGがEXPLORE段階で事前に分析 | 予防は治療に勝る |
| エッジケース/リスクを見落とす | BRAINSTORM段階で深く考える | コーディング前に準備完了 |

### 主なイノベーション：BRAINSTORMフェーズ

CRG (Code-Review-Graph) はコード構造を見つけられるが、以下は考えられない：
- ビジネスロジックのエッジケース
- ユーザー要件の曖昧さ
- 潜在的なセキュリティ脆弱性
- 新機能のボトルネック

BRAINSTORMフェーズは **Prometheus**（計画コンサルタント）または **Oracle** を使用：
1. 仮定に質疑 - "入力が空/null/無効の場合は？"
2. リスク特定 - "本番環境で何が失敗する可能性あり？"
3. 代替案探索 - "もっとシンプルなソリューションは？"
4. 問題提起 - "要件が不明確：ユーザーがXを明確にする必要あり"

出力はSPECへ入力 - 仕様は全てのブレインストーミング発見を扱う必要あり。

### 主なイノベーション：DESIGN VERIFICATION

これは「AI HALucinationコーディング」を解決する核心：

```
コードを書く時の仮定:
✗ import from 'shared/types'       → 実際のパス: '@shared/types'
✗ use createHook()                 → 実際のAPI: createHooks()
✗ class UserService exists         → 実際: UserAPI

DESIGN VERIFICATIONがすること:
1. 全てのimport文を解析
2. モジュールパスが存在するか確認
3. API名が一致するか検証
4. 型定義是否存在を確認
5. 検証レポートを生成、DEV段階をブロック直到全仮定通過
```

## インストール

`opencode.json`にプラグインを追加：

```json
{
  "plugin": [
    "file:///Users/meetai/opencode-autopolit/dist/index.js"
  ]
}
```

OpenCodeを再起動して有効化。

## 使い方

### 自動トリガー

以下のキーワードを入力すると、自动的にworkflowをトリガー：

| キーワード | トリガー |
|------------|----------|
| `implement xxx` | ✅ |
| `add xxx` | ✅ |
| `create xxx` | ✅ |
| `fix xxx` | ✅ |
| `build xxx` | ✅ |
| `tdd` | ✅ |
| `test-first` | ✅ |
| `refactor` | ✅ |

### 手動トリガー

slash commandも使用可能（対応skillが設定されている場合）：

```
/autopolit implement user login
```

## ワークフローフェーズ

### 1. EXPLORE - 探索フェーズ
- CRG (Code-Review-Graph) でコードベースを分析
- コード構造マップ、キーコンポーネント、統合ポイントを生成
- 出力はBrainstormフェーズへ

### 2. BRAINSTORM - ブレインストーミングフェーズ（新規追加）
- EXPLOREの結果に基づいて深く考える：
  - **仮定補充**: CRGが見落とした仮定を追加
  - **リスク発見**: 潜在的な落とし穴、エッジケース、競合状態を特定
  - **ソリューション探索**: 複数の実装アプローチを検討
  - **明確化質問**: 曖昧な要件を見つけ、ユーザーの確認を待つ
- 出力: 強化された仮定リスト + リスクレジストリ + 明確化質問
- **SPECフェーズへ入力** - 仕様は全てのブレインストーミング出力を扱う必要あり

### 3. SPEC - 仕様フェーズ
- proposal → specs → design → tasks を生成
- 各ドキュメント 2-5分の粒度

### 3. DESIGN VERIFICATION - 設計検証（新規追加）
- 全ての仮定を検証：モジュールパス、タイプ、APIが存在するか
- **DEV段階をブロック直到全ての仮定検証通過**

### 4. DEV - 開発フェーズ
- TDD強制：RED (テストを書く) → GREEN (実装) → REFACTOR
- テストをスキップしてコードを直接書くことを禁止

### 5. VERIFY - 検証フェーズ
- セルフチェックリスト：TODOなし、プレースホルダーなし、AI-slopなし
- ユーザー確認

### 6. ARCHIVE - アーカイブフェーズ
- delta specsをメインブランチにマージ

## トリガー効果

`implement user login`を入力すると、Agentは以下を受け取る：

```
🤖 AUTOPOLIT WORKFLOW ACTIVATED

🔄 WORKFLOW SEQUENCE (MANDATORY):
1. EXPLORE → 2. BRAINSTORM → 3. SPEC → 4. DESIGN VERIFICATION → 5. DEV → 6. VERIFY → 7. ARCHIVE
```

## モジュール構造

```
src/features/spec-driven-workflow/
├── exploration-phase.ts # 探索フェーズ管理
├── specification-phase.ts # 仕様フェーズ管理
├── design-verification.ts # 設計検証フェーズ
├── tdd-phase.ts # TDD強制執行
├── workflow-orchestrator.ts # ワークフローorchestrator
├── verification-phase.ts # 検証フェーズ
├── archival-phase.ts # アーカイブフェーズ
└── index.ts # エクスポート
```

## 依存

- oh-my-openagent
- openspec
- superpowers
- code-review-graph (MCP)
- wechat-acp (オプション)