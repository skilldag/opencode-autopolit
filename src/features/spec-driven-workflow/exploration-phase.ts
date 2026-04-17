export interface ExplorationState {
  explorationRequired: boolean
  explorationCompleted: boolean
  codeStructure?: CodeStructure
  keyComponents?: string[]
  integrationPoints?: string[]
}

export interface CodeStructure {
  nodes: number
  edges: number
  communities: number
  hubNodes: string[]
}

export class ExplorationPhaseManager {
  private state: ExplorationState = {
    explorationRequired: false,
    explorationCompleted: false,
  }

  requiresExploration(message: string): boolean {
    const implementationKeywords = [
      "implement",
      "add",
      "create",
      "fix",
      "refactor",
      "build",
      "开发",
      "实现",
      "添加",
      "创建",
      "修复",
    ]
    return implementationKeywords.some((kw) =>
      message.toLowerCase().includes(kw)
    )
  }

  async startExploration(): Promise<ExplorationState> {
    this.state.explorationRequired = true
    return this.state
  }

  completeExploration(structure: CodeStructure): void {
    this.state.explorationCompleted = true
    this.state.codeStructure = structure
  }

  getState(): ExplorationState {
    return { ...this.state }
  }

  reset(): void {
    this.state = {
      explorationRequired: false,
      explorationCompleted: false,
    }
  }
}

export const explorationPhaseManager = new ExplorationPhaseManager()