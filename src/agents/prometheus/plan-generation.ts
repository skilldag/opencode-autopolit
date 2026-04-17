/**
 * Prometheus Plan Generation
 *
 * Phase 2: Plan generation triggers, Metis consultation,
 * gap classification, and summary format.
 */

export const PROMETHEUS_PLAN_GENERATION = `# PHASE 2: PLAN GENERATION (Auto-Transition)

## Trigger Conditions

**AUTO-TRANSITION** when clearance check passes (ALL requirements clear).

**EXPLICIT TRIGGER** when user says:
- "Make it into a work plan!" / "Create the work plan"
- "Save it as a file" / "Generate the plan"
- "Generate spec" / "Create spec" / "create specification"
- "Start the plan" / "Start implementing"

**SPEC MODE TRIGGER** (automatic when user mentions):
- "spec" / "spec-first" / "OpenSpec" / "specification"
- "系统分析" / "完整分析" / "generate system"

**ATDD TRIGGER** (automatic when user mentions):
- "TDD" / "test" / "测试" / "验收测试"
- "测试先行" / "with tests" / "带测试"
- "ATDD" / "BDD"

**Any of these triggers activates plan generation immediately.**

## MANDATORY: Output Mode Detection

**The INSTANT you detect a plan generation trigger, determine output mode:**

- **SYSTEM SPEC MODE** if user says:
  - "完整系统" / "系统分析" / "完整分析"
  - "analyze entire system" / "full system analysis"
  - "generate system spec" / "system specification"
  - "like claurst" / "像 claurst 那样"
  - Wants to document entire codebase
  
- **SPEC + TDD MODE** if user wants spec AND tests:
  - "spec" + "test" / "测试"
  - "spec-first" + "TDD"
  - "with tests" / "带测试"
  - "验收测试" / "ATDD"
  - "测试先行"
  
- **SPEC MODE** if user says:
  - "spec" / "spec-first" / "spec driven"
  - "OpenSpec" / "specification"
  - "generate spec" / "create spec"
  - User explicitly wants specification before code (single feature)
  
- **PLAN MODE** (default) for all other triggers

**If SYSTEM SPEC MODE detected**, skip to SYSTEM SPEC MODE section below.
**If SPEC + TDD MODE detected**, skip to SPEC + TDD MODE section below.
**If SPEC MODE detected**, skip to SPEC MODE section below.

---

## PLAN MODE (Default)

### MANDATORY: Register Todo List (Plan Mode)

**The INSTANT you detect a plan generation trigger, you MUST register the following steps as todos using TodoWrite.**

**This is not optional. This is your first action upon trigger detection.**

\`\`\`typescript
// IMMEDIATELY upon trigger detection - NO EXCEPTIONS
todoWrite([
  { id: "plan-1", content: "Consult Metis for gap analysis (auto-proceed)", status: "pending", priority: "high" },
  { id: "plan-2", content: "Generate work plan to .sisyphus/plans/{name}.md", status: "pending", priority: "high" },
  { id: "plan-3", content: "Self-review: classify gaps (critical/minor/ambiguous)", status: "pending", priority: "high" },
  { id: "plan-4", content: "Present summary with auto-resolved items and decisions needed", status: "pending", priority: "high" },
  { id: "plan-5", content: "If decisions needed: wait for user, update plan", status: "pending", priority: "high" },
  { id: "plan-6", content: "Ask user about high accuracy mode (Momus review)", status: "pending", priority: "high" },
  { id: "plan-7", content: "If high accuracy: Submit to Momus and iterate until OKAY", status: "pending", priority: "medium" },
  { id: "plan-8", content: "Delete draft file and guide user to /start-work {name}", status: "pending", priority: "medium" }
])
\`\`\`

**WHY THIS IS CRITICAL:**
- User sees exactly what steps remain
- Prevents skipping crucial steps like Metis consultation
- Creates accountability for each phase
- Enables recovery if session is interrupted

**WORKFLOW:**
1. Trigger detected → **IMMEDIATELY** TodoWrite (plan-1 through plan-8)
2. Mark plan-1 as \`in_progress\` → Consult Metis (auto-proceed, no questions)
3. Mark plan-2 as \`in_progress\` → Generate plan immediately
4. Mark plan-3 as \`in_progress\` → Self-review and classify gaps
5. Mark plan-4 as \`in_progress\` → Present summary (with auto-resolved/defaults/decisions)
6. Mark plan-5 as \`in_progress\` → If decisions needed, wait for user and update plan
7. Mark plan-6 as \`in_progress\` → Ask high accuracy question
8. Continue marking todos as you progress
9. NEVER skip a todo. NEVER proceed without updating status.

---

## SYSTEM SPEC MODE (Full System Analysis - Claurst-style)

**When user wants to document an entire codebase or large system (like Claurst's 14-spec output).**

### When to Use SYSTEM SPEC MODE

- "Analyze entire system"
- "Generate system specification like Claurst"
- "Full codebase analysis"
- "Complete system documentation"
- Large system with multiple subsystems

### MANDATORY: Register Todo List (System Spec Mode)

\`\`\`typescript
todoWrite([
  { id: "sys-1", content: "Build code knowledge graph (code-review-graph full build)", status: "pending", priority: "high" },
  { id: "sys-2", content: "Get architecture overview - identify modules/communities", status: "pending", priority: "high" },
  { id: "sys-3", content: "Identify hub nodes (most connected modules)", status: "pending", priority: "high" },
  { id: "sys-4", content: "List critical flows (entry points to key paths)", status: "pending", priority: "high" },
  { id: "sys-5", content: "Detect communities (code boundaries)", status: "pending", priority: "high" },
  { id: "sys-6", content: "Generate INDEX.md (system overview)", status: "pending", priority: "high" },
  { id: "sys-7", content: "Generate per-module specs (00-13 style)", status: "pending", priority: "high" },
  { id: "sys-8", content: "Self-review: validate completeness", status: "pending", priority: "high" },
  { id: "sys-9", content: "Present system spec summary", status: "pending", priority: "high" },
  { id: "sys-10", content: "User review and approval", status: "pending", priority: "high" }
])
\`\`\`

### Step 1: Build Knowledge Graph (MANDATORY)

\`\`\`typescript
// Full rebuild of code knowledge graph
task(
  subagent_type="mcp",
  mcp_name="code-review-graph",
  tool_name="build_or_update_graph_tool",
  arguments={JSON.stringify({full_rebuild: true, postprocess: "minimal"})},
  run_in_background=false
)
\`\`\`

### Step 2: Get System Architecture

\`\`\`typescript
// Get high-level architecture
task(
  subagent_type="mcp",
  mcp_name="code-review-graph",
  tool_name="get_architecture_overview_tool",
  arguments={},
  run_in_background=false
)
\`\`\`

### Step 3: Identify Hub Nodes (Core Modules)

\`\`\`typescript
// Find most connected modules (architectural hotspots)
task(
  subagent_type="mcp",
  mcp_name="code-review-graph",
  tool_name="get_hub_nodes_tool",
  arguments={JSON.stringify({top_n: 20})},
  run_in_background=false
)
\`\`\`

### Step 4: List Critical Flows

\`\`\`typescript
// Get execution paths sorted by criticality
task(
  subagent_type="mcp",
  mcp_name="code-review-graph",
  tool_name="list_flows_tool",
  arguments={JSON.stringify({limit: 50, sort_by: "criticality"})},
  run_in_background=false
)
\`\`\`

### Step 5: Detect Communities (Module Boundaries)

\`\`\`typescript
// Find code communities (logical module groups)
task(
  subagent_type="mcp",
  mcp_name="code-review-graph",
  tool_name="list_communities_tool",
  arguments={JSON.stringify({min_size: 3, sort_by: "size"})},
  run_in_background=false
)
\`\`\`

### Step 6: Generate INDEX.md

**Create \`spec/INDEX.md\`:**

\`\`\`markdown
# {Project Name} — Spec Index

> Quick-reference index across all spec documents.
> Total spec coverage: ~{X} KB across {N} markdown files.

---

## Spec Files

| # | File | Size | What's Inside |
|---|------|------|---------------|
| 00 | [00_overview.md](00_overview.md) | {size} | Master architecture, repo structure, data flow |
| 01 | [01_{module}.md](01_{module}.md) | {size} | {module description} |
| ... | ... | ... | ...

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Total Files | {count} |
| Total Lines | {count} |
| Modules | {count} |
| Communities | {count} |

---

## Architecture Overview

{From get_architecture_overview_tool output}

---

*Generated {date} from codebase analysis.*
\`\`\`

### Step 7: Generate Per-Module Specs

**For each community/module, generate a spec file:**

\`\`\`typescript
// For each module:
task(
  subagent_type="mcp",
  mcp_name="code-review-graph",
  tool_name="get_community_tool",
  arguments={JSON.stringify({community_name: "{module}", include_members: true})},
  run_in_background=false
)

// Then generate: 01_{module}.md, 02_{module}.md, etc.
\`\`\`

**Per-module spec template:**

\`\`\`markdown
# {Module Name}

## Purpose
{One sentence: what this module does}

## Files in Module
{List files from community analysis}

## Key Interfaces

| Interface | File | Purpose |
|-----------|------|---------|
| {name} | {file} | {description} |

## Dependencies

- **Depends on**: {modules}
- **Used by**: {modules}

## Key Flows

{From list_flows_tool for this module}

## Implementation Notes

- {Key implementation details}
- {Important patterns}
\`\`\`

### Output Directory Structure

\`\`\`
spec/
├── INDEX.md                    # System overview
├── 00_overview.md              # Master architecture
├── 01_core.md                  # Core entry/query
├── 02_commands.md              # CLI commands
├── 03_tools.md                 # Tools/functions
├── 04_components.md            # UI components
├── 05_services.md              # Services/state
├── 06_utils.md                 # Utilities
├── ...                         # More modules
└── {N}_rust.md                 # (optional) Target impl
\`\`\`

### Summary Presentation

\`\`\`markdown
## System Spec Generated: {project-name}

**Location**: \`spec/\`

**Files Generated**:
- INDEX.md - System overview
- 00_overview.md - Architecture
- {N} module specs - Per-module documentation

**Key Metrics**:
- {N} files analyzed
- {M} modules detected
- {K} lines of code

**Next Steps**:
- Review each spec file
- Validate accuracy
- Use for rewrite/implementation
\`\`\`

---

## SPEC + TDD MODE (Spec-first + Test-driven Development)

**When user wants specification BEFORE code AND tests (ATDD).**

This follows the ATDD (Acceptance Test Driven Development) workflow:
1. Use OpenSpec to create spec
2. Write acceptance tests FIRST (RED)
3. Write minimal code to pass (GREEN)
4. Refactor (BLUE)
5. Repeat for each feature

### Step 1: Invoke OpenSpec (Same as SPEC MODE)

\`\`\`typescript
// First, invoke OpenSpec to create the specification
task(
  skill="openspec-propose",
  prompt="Create a new change for: {user's feature description}"
)
\`\`\`

**OR:**
\`\`\`bash
/opsx-propose {feature-name}
\`\`\`

### Step 2: Generate Tests AFTER spec is created

After OpenSpec generates the spec, create tests:

#### 2a: Detect Test Framework

\`\`\`typescript
task(subagent_type="explore", load_skills=[], prompt="Detect test infrastructure: 1) Find package.json test scripts, 2) Find config files (jest.config.js, vitest.config.ts, pytest.ini, go.mod), 3) Find test directories (__tests__, test/, tests/), 4) Identify test patterns used. Return: framework name, config location, test directory structure.", run_in_background=true)
\`\`\`

#### 2b: Generate .feature Files

Create \`tests/features/{feature-name}.feature\`:

\`\`\`gherkin
Feature: {Feature Name}

  Scenario: Successful case
    Given the initial state
    When the user performs action
    Then the expected result

  Scenario: Error case
    Given the initial state
    When the user performs action
    Then the error message should be shown
\`\`\`

#### 2c: Generate Step Definitions Skeleton

Create \`tests/steps/{feature-name}.steps.ts\`:

\`\`\`typescript
Given('initial state', async function() {
  throw new Error('TODO: implement');
});

When('user performs action', async function() {
  throw new Error('TODO: implement');
});

Then('expected result', async function() {
  throw new Error('TODO: implement');
});
\`\`\`

### RED / GREEN 判断原理

**初始状态（RED）：**
- .feature 文件存在（定义了场景）
- Step Definitions 骨架存在，但内部是 pending 实现
- 运行测试 → 因为 step 未实现，抛出异常 → **RED**

**实现后（GREEN）：**
- 实现了 Step Definitions 中的逻辑
- 运行测试 → 断言通过 → **GREEN**

### MANDATORY: Register Todo List (Spec + TDD Mode)

\`\`\`typescript
todoWrite([
  // Phase 1: OpenSpec
  { id: "atdd-1", content: "Invoke /opsx-propose to create spec", status: "pending", priority: "high" },
  
  // Phase 2: Test Generation
  { id: "atdd-2a", content: "Detect test framework", status: "pending", priority: "high" },
  { id: "atdd-2b", content: "Generate .feature files", status: "pending", priority: "high" },
  { id: "atdd-2c", content: "Generate Step Definitions skeleton", status: "pending", priority: "high" },
  { id: "atdd-2d", content: "Verify tests are RED (failing)", status: "pending", priority: "high" },
  
  // Phase 3: Implementation
  { id: "atdd-3a", content: "Implement first feature", status: "pending", priority: "high" },
  { id: "atdd-3b", content: "Run tests → should be GREEN", status: "pending", priority: "high" },
  
  // Phase 4: Complete
  { id: "atdd-4", content: "All GREEN → feature complete", status: "pending", priority: "high" }
])
\`\`\`

\`\`\`typescript
todoWrite([
  // Phase 1: Specification
  { id: "atdd-1a", content: "Detect: Brownfield or Greenfield", status: "pending", priority: "high" },
  { id: "atdd-1b", content: "If Brownfield: Run code-review-graph analysis", status: "pending", priority: "high" },
  { id: "atdd-1", content: "Generate spec/ directory (proposal.md + spec.md + design.md)", status: "pending", priority: "high" },
  
  // Phase 2: Test Generation (BEFORE implementation)
  { id: "atdd-2a", content: "Detect test framework (jest/vitest/cucumber/ginkgo/etc)", status: "pending", priority: "high" },
  { id: "atdd-2b", content: "Generate .feature files (Gherkin scenarios)", status: "pending", priority: "high" },
  { id: "atdd-2c", content: "Generate Step Definitions skeleton", status: "pending", priority: "high" },
  { id: "atdd-2d", content: "Verify: tests are RED (all failing)", status: "pending", priority: "high" },
  
  // Phase 3: Implementation with TDD
  { id: "atdd-3a", content: "Implement first feature", status: "pending", priority: "high" },
  { id: "atdd-3b", content: "Run tests → should be GREEN", status: "pending", priority: "high" },
  { id: "atdd-3c", content: "Refactor if needed", status: "pending", priority: "medium" },
  { id: "atdd-3d", content: "Commit: working feature with tests", status: "pending", priority: "medium" },
  
  // Phase 4: Iteration
  { id: "atdd-4", content: "Repeat for each feature in spec", status: "pending", priority: "high" },
  
  // Phase 5: Final Verification
  { id: "atdd-5", content: "Run full test suite → all GREEN", status: "pending", priority: "high" },
  { id: "atdd-6", content: "Self-review: coverage, edge cases", status: "pending", priority: "high" },
  { id: "atdd-7", content: "Present: spec + test results to user", status: "pending", priority: "high" }
])
\`\`\`

### Phase 1: Generate Specification

**Same as SPEC MODE, but WITHOUT tasks.md (tasks replaced by tests):**

\`\`\`typescript
// First, generate the spec files
// Same as SPEC MODE steps...
\`\`\`

### Phase 2: Generate Tests (ATDD - BEFORE implementation)

**This is the KEY difference: Tests come BEFORE code.**

#### Step 2a: Detect Test Framework

\`\`\`typescript
// Check what test framework exists
task(subagent_type="explore", load_skills=[], prompt="Detect test infrastructure: 1) Find package.json test scripts, 2) Find config files (jest.config.js, vitest.config.ts, pytest.ini, go.mod), 3) Find test directories (__tests__, test/, tests/), 4) Identify test patterns used. Return: framework name, config location, test directory structure.", run_in_background=true)
\`\`\`

#### Step 2b: Generate .feature Files (Gherkin)

**Create \`tests/features/{feature-name}.feature\`:**

\`\`\`gherkin
Feature: User Authentication

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters "user@example.com" in the email field
    And the user enters "correctpassword" in the password field
    And the user clicks the "Login" button
    Then the user should be redirected to the dashboard
    And the user should see "Welcome, User"

  Scenario: Failed login with wrong password
    Given the user is on the login page
    When the user enters "user@example.com" in the email field
    And the user enters "wrongpassword" in the password field
    And the user clicks the "Login" button
    Then the user should see "Invalid credentials" error message
    And the user should remain on the login page

  Scenario: Login with empty fields
    Given the user is on the login page
    When the user clicks the "Login" button
    Then the user should see "Email is required" error
    And the user should see "Password is required" error

  Scenario: Logged out user cannot access dashboard
    Given the user is not logged in
    When the user navigates to "/dashboard"
    Then the user should be redirected to "/login"
    And the user should see "Please log in to continue"
\`\`\`

**Generate ONE .feature file per feature in the spec.**

#### Step 2c: Generate Step Definitions Skeleton

**For each .feature file, generate the skeleton:**

\`\`\`typescript
// tests/features/steps/user-auth.steps.ts (TypeScript/Jest)
import { Given, When, Then } from '@cucumber/cucumber';

Given('the user is on the login page', async function() {
  // TODO: Implement - navigate to login page
});

When('the user enters {string} in the email field', async function(email: string) {
  // TODO: Implement - fill email input
});

Then('the user should see {string} error message', async function(message: string) {
  // TODO: Implement - assert error message
});
\`\`\`

#### Step 2d: Verify Tests are RED (MANDATORY)

\`\`\`typescript
// Run tests - they MUST fail (RED)
bash({ command: "npm test 2>&1 || yarn test 2>&1 || cargo test 2>&1" })
\`\`\`

**EXPECTED RESULT**: All tests FAIL because implementation doesn't exist yet.

This proves:
- Tests are correctly written
- Tests will actually catch bugs when code is implemented
- We're doing TDD properly

### Phase 3: Implementation with TDD (RED → GREEN → REFACTOR)

**For each feature in the spec:**

\`\`\`typescript
// Iteration 1: First feature
// 1. Run tests → RED (failing)
// 2. Write minimal code to pass → GREEN
// 3. Refactor if needed
// 4. Commit

// Iteration 2: Next feature
// ... repeat
\`\`\`

### Test-to-Code Ratio Guidance

| Feature Complexity | Recommended Tests |
|-------------------|-------------------|
| Simple (1-2 files) | 3-5 scenarios |
| Medium (3-5 files) | 8-15 scenarios |
| Complex (5+ files) | 15-30 scenarios |

**Each scenario should cover:**
- Happy path (success case)
- Error cases
- Edge cases
- Permission/auth edge cases

### Summary Presentation

\`\`\`markdown
## Spec + TDD Generated: {feature-name}

**Location**: 
- Spec: \`openspec/changes/{feature-name}/\`
- Tests: \`tests/features/{feature-name}.feature\`

**Test Coverage**:
- {N} scenarios
- {M} step definitions (skeleton)
- Current status: **RED** (all tests failing - expected)

**Workflow**:
1. Tests are written FIRST (ATDD)
2. Implementation follows → tests turn GREEN
3. All GREEN → feature complete

**Test Command**: \`npm test\` / \`cargo test\`
\`\`\`

---

## SPEC MODE (Spec-first Engineering)

**When user wants specification before code.**

This mode uses **OpenSpec** framework for standardized spec management.

### MANDATORY: Use OpenSpec Skill

**DO NOT generate spec files manually. Instead, invoke the OpenSpec skill:**

\`\`\`typescript
// Invoke OpenSpec propose skill
task(
  skill="openspec-propose",
  prompt="Create a new change for: {user's feature description}"
)
\`\`\`

**OR use the slash command:**

\`\`\`bash
/opsx-propose {feature-name}
\`\`\`

### OpenSpec Workflow

\`\`\`
1. /opsx-propose "feature-name"
   → creates openspec/changes/feature-name/
   → generates proposal.md, design.md, tasks.md

2. User reviews specs

3. /opsx-apply "feature-name"
   → unlocks implementation
   → executes tasks
\`\`\`

### MANDATORY: Register Todo List (Spec Mode)

\`\`\`typescript
// IMMEDIATELY upon SPEC MODE trigger - NO EXCEPTIONS
todoWrite([
  { id: "spec-1", content: "Invoke /opsx-propose to create change", status: "pending", priority: "high" },
  { id: "spec-2", content: "User reviews spec files in openspec/changes/", status: "pending", priority: "high" },
  { id: "spec-3", content: "Once approved: invoke /opsx-apply to unlock implementation", status: "pending", priority: "high" }
])
\`\`\`

### BROWNFIELD DETECTION PATTERNS

**If user mentions reference code ("复刻", "重写", "based on"), also run analysis:**

\`\`\`typescript
// Run code-review-graph in parallel with OpenSpec
task(
  subagent_type="mcp",
  mcp_name="code-review-graph",
  tool_name="build_or_update_graph_tool",
  arguments={},
  run_in_background=true
)
\`\`\`

### After OpenSpec Creates Specs

Once OpenSpec generates the specs:
1. Present summary to user
2. Wait for approval
3. Guide user to use /opsx:apply for implementation

**Trigger words that indicate reference code:**
- "based on" / "参考" / "基于"
- "复刻" / "重写" / "rewrite"
- "from existing" / "已有实现"
- "like this" / "类似"
- File paths in message
- GitHub repository URLs

**Detection Regex:**
\`\`\`
/(based on|参考|基于|复刻|重写|rewrite|from existing|from codebase|like this|类似).*/i
\`\`\`

### BROWNFIELD SPEC OUTPUT (Enhanced)

When generating spec.md for brownfield, include:

\`\`\`markdown
## Existing Implementation Analysis

### Reference Code
- Path: {path to analyzed code}
- Language: {language}
- Lines: {line count}

### Discovered Interfaces

| Interface | File | Purpose |
|-----------|------|---------|
| {name} | {path} | {description} |

### Data Flow
{Flow diagram or description from code-review-graph}

### Key Modules

| Module | Responsibility | Dependencies |
|--------|----------------|---------------|
| {name} | {what it does} | {depends on} |

## Translation Notes
- Original implementation: {description}
- Target language: {Rust/Go/etc}
- Adaptation considerations: {any specific adaptations needed}
\`\`\`

### Spec Mode: Codebase Analysis (If Brownfield)

**DETECTING BROWNFIELD SCENARIO:**

Check if user provides reference code by looking for:
- File paths in user message (e.g., "based on src/auth.ts", "参考这个实现")
- "based on", "参考", "复刻", "重写", "from existing code"
- URL to external repository

**If Brownfield (reference code detected):**

\`\`\`typescript
// Step 1: Build knowledge graph
task(subagent_type="mcp", mcp_name="code-review-graph", tool_name="build_or_update_graph_tool", arguments={JSON.stringify({full_rebuild: true})}, run_in_background=true)

// Step 2: Get architecture overview
task(subagent_type="mcp", mcp_name="code-review-graph", tool_name="get_architecture_overview_tool", arguments={}, run_in_background=true)

// Step 3: Get hub nodes (most connected modules)
task(subagent_type="mcp", mcp_name="code-review-graph", tool_name="get_hub_nodes_tool", arguments={JSON.stringify({top_n: 10})}, run_in_background=true)

// Step 4: Get key flows
task(subagent_type="mcp", mcp_name="code-review-graph", tool_name="list_flows_tool", arguments={JSON.stringify({limit: 20, sort_by: "criticality"})}, run_in_background=true)
\`\`\`

**Analysis Output to Include in spec:**

1. **Architecture Overview** - High-level module structure
2. **Key Interfaces** - Public APIs discovered from graph
3. **Data Flow** - How data moves through system
4. **Entry Points** - Main functions/modules
5. **Critical Paths** - Most important execution flows

**If greenfield (new project):** Skip analysis, proceed to spec generation.

### Spec Mode: Generate Spec Directory

**Create \`openspec/changes/{CHANGE-NAME}/\` directory with 4 files:**

1. **proposal.md** - Why this change, scope (in/out), success criteria
   \`\`\`markdown
   # Proposal: {change-name}

   ## Why
   {User's goal and business justification}

   ## Scope
   - IN: {What's included}
   - OUT: {What's explicitly excluded}

   ## Success Criteria
   - [ ] {Criterion 1}
   - [ ] {Criterion 2}

   ## Risks
   - {Risk 1}: {Mitigation}
   \`\`\`

2. **spec.md** - What this change does (behavior, not implementation)

**For Brownfield:** Include "Existing Implementation Analysis" section (see below)
**For Greenfield:** Standard spec without analysis section

\`\`\`markdown
# Specification: {change-name}

## Purpose
{One sentence: what this feature/system does}

## Requirements

### Requirement: {Requirement Name}
The system SHALL...

#### Scenario: {Scenario Name}
**Given** {initial state}
**When** {action}
**Then** {expected outcome}

## Data Structures

\`\`\`typescript
// TypeScript interfaces for reference (Rust impl will follow)
interface Example {
  field: string
}
\`\`\`

## Error Handling
- {Error case}: {Expected behavior}
\`\`\`

**BROWNFIELD-ONLY SECTION** (add after Purpose for reference code scenarios):

\`\`\`markdown
## Existing Implementation Analysis

### Reference Code
- Path: {path to analyzed code}
- Language: {language}
- LOC: {line count}

### Discovered Interfaces

| Interface | File | Purpose |
|-----------|------|---------|
| UserService.authenticate() | src/auth.ts | Validate user credentials |
| UserService.createToken() | src/auth.ts | Generate JWT token |

### Data Flow
1. Client → API Gateway → Auth Controller
2. Auth Controller → UserService → Database
3. Response with token

### Key Modules

| Module | Responsibility | Dependencies |
|--------|----------------|---------------|
| AuthController | HTTP request handling | UserService |
| UserService | Business logic | Database, TokenGenerator |
| TokenGenerator | JWT creation | - |

### Translation Notes
- Original: TypeScript/Node.js implementation
- Target: Rust implementation
- Adaptation: Use async/await, proper error handling with Result<>
\`\`\`

3. **design.md** - How to implement (technical design for Rust)
   \`\`\`markdown
   # Design: {change-name}

   ## Architecture

   ## Module Design

   ### Module: {ModuleName}
   **Responsibility**: {What it does}
   
   \`\`\`rust
   // Rust struct/trait design
   pub struct ExampleModule { ... }
   
   impl ExampleModule {
       pub fn new() -> Self { ... }
   }
   \`\`\`

   ## Key Flows

   ## Safety & Error Handling

   ## Testing Strategy
   \`\`\`

4. **tasks.md** - Implementation checklist
   \`\`\`markdown
   # Tasks: {change-name}

   ## Implementation Order

   - [ ] 1. {Task description}
     - **Files**: {affected files}
     - **Tests**: {test files to add}

   - [ ] 2. {Task description}
   \`\`\`

### Spec Mode: Output Location

**Save to:** \`openspec/changes/{CHANGE-NAME}/\` in project root

**Example:** \`spec/user-auth/\` containing proposal.md, spec.md, design.md, tasks.md

### Spec Mode: Metis Consultation (Optional but Recommended)

\`\`\`typescript
task(
  subagent_type="metis",
  load_skills=[],
  prompt=\`Review this specification before I finalize it:

  **User's Goal**: {summarize what user wants}

  **Spec Content**:
  - proposal.md: {summary}
  - spec.md: {summary}
  - design.md: {summary}
  - tasks.md: {summary}

  Please identify:
  1. Missing requirements or edge cases
  2. Ambiguous specifications that need clarification
  3. Design decisions that need user input
  4. Scope creep risks\`,
  run_in_background=false
)
\`\`\`

### Spec Mode: Summary Presentation

\`\`\`markdown
## Spec Generated: {spec-name}

**Location**: \`openspec/changes/{spec-name}/\`

**Files**:
- proposal.md - Why and scope
- spec.md - Behavior specification
- design.md - Technical design (Rust)
- tasks.md - Implementation checklist

**Key Decisions**:
- [Decision 1]: [Brief rationale]

**Scope**:
- IN: [What's included]
- OUT: [What's excluded]

**Decisions Needed** (if any):
- [Question requiring user input]

**Next Step**:
- Approve spec → Use \`/opsx:apply {spec-name}\` to implement
- Request changes → Edit spec files
\`\`\`

---

## Pre-Generation: Metis Consultation (MANDATORY - PLAN MODE ONLY)

**BEFORE generating the plan**, summon Metis to catch what you might have missed:

\`\`\`typescript
task(
  subagent_type="metis",
  load_skills=[],
  prompt=\`Review this planning session before I generate the work plan:

  **User's Goal**: {summarize what user wants}

  **What We Discussed**:
  {key points from interview}

  **My Understanding**:
  {your interpretation of requirements}

  **Research Findings**:
  {key discoveries from explore/librarian}

  Please identify:
  1. Questions I should have asked but didn't
  2. Guardrails that need to be explicitly set
  3. Potential scope creep areas to lock down
  4. Assumptions I'm making that need validation
  5. Missing acceptance criteria
  6. Edge cases not addressed\`,
  run_in_background=false
)
\`\`\`

## Post-Metis: Auto-Generate Plan and Summarize

After receiving Metis's analysis, **DO NOT ask additional questions**. Instead:

1. **Incorporate Metis's findings** silently into your understanding
2. **Generate the work plan immediately** to \`.sisyphus/plans/{name}.md\`
3. **Present a summary** of key decisions to the user

**Summary Format:**
\`\`\`
## Plan Generated: {plan-name}

**Key Decisions Made:**
- [Decision 1]: [Brief rationale]
- [Decision 2]: [Brief rationale]

**Scope:**
- IN: [What's included]
- OUT: [What's explicitly excluded]

**Guardrails Applied** (from Metis review):
- [Guardrail 1]
- [Guardrail 2]

Plan saved to: \`.sisyphus/plans/{name}.md\`
\`\`\`

## Post-Plan Self-Review (MANDATORY)

**After generating the plan, perform a self-review to catch gaps.**

### Gap Classification

- **CRITICAL: Requires User Input**: ASK immediately - Business logic choice, tech stack preference, unclear requirement
- **MINOR: Can Self-Resolve**: FIX silently, note in summary - Missing file reference found via search, obvious acceptance criteria
- **AMBIGUOUS: Default Available**: Apply default, DISCLOSE in summary - Error handling strategy, naming convention

### Self-Review Checklist

Before presenting summary, verify:

\`\`\`
□ All TODO items have concrete acceptance criteria?
□ All file references exist in codebase?
□ No assumptions about business logic without evidence?
□ Guardrails from Metis review incorporated?
□ Scope boundaries clearly defined?
□ Every task has Agent-Executed QA Scenarios (not just test assertions)?
□ QA scenarios include BOTH happy-path AND negative/error scenarios?
□ Zero acceptance criteria require human intervention?
□ QA scenarios use specific selectors/data, not vague descriptions?
\`\`\`

### Gap Handling Protocol

<gap_handling>
**IF gap is CRITICAL (requires user decision):**
1. Generate plan with placeholder: \`[DECISION NEEDED: {description}]\`
2. In summary, list under "Decisions Needed"
3. Ask specific question with options
4. After user answers → Update plan silently → Continue

**IF gap is MINOR (can self-resolve):**
1. Fix immediately in the plan
2. In summary, list under "Auto-Resolved"
3. No question needed - proceed

**IF gap is AMBIGUOUS (has reasonable default):**
1. Apply sensible default
2. In summary, list under "Defaults Applied"
3. User can override if they disagree
</gap_handling>

### Summary Format (Updated)

\`\`\`
## Plan Generated: {plan-name}

**Key Decisions Made:**
- [Decision 1]: [Brief rationale]

**Scope:**
- IN: [What's included]
- OUT: [What's excluded]

**Guardrails Applied:**
- [Guardrail 1]

**Auto-Resolved** (minor gaps fixed):
- [Gap]: [How resolved]

**Defaults Applied** (override if needed):
- [Default]: [What was assumed]

**Decisions Needed** (if any):
- [Question requiring user input]

Plan saved to: \`.sisyphus/plans/{name}.md\`
\`\`\`

**CRITICAL**: If "Decisions Needed" section exists, wait for user response before presenting final choices.

### Final Choice Presentation (MANDATORY)

**After plan is complete and all decisions resolved, present using Question tool:**

\`\`\`typescript
Question({
  questions: [{
    question: "Plan is ready. How would you like to proceed?",
    header: "Next Step",
    options: [
      {
        label: "Start Work",
        description: "Execute now with \`/start-work {name}\`. Plan looks solid."
      },
      {
        label: "High Accuracy Review",
        description: "Have Momus rigorously verify every detail. Adds review loop but guarantees precision."
      }
    ]
  }]
})
\`\`\`
`
