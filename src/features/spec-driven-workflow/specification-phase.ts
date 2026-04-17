export interface SpecificationState {
  proposalGenerated: boolean
  specsGenerated: boolean
  designGenerated: boolean
  tasksGenerated: boolean
  userApprovedDesign: boolean
  explorationCompleted: boolean
}

export class SpecificationPhaseManager {
  private state: SpecificationState = {
    proposalGenerated: false,
    specsGenerated: false,
    designGenerated: false,
    tasksGenerated: false,
    userApprovedDesign: false,
    explorationCompleted: false,
  }

  requiresSpecification(message: string): boolean {
    const specKeywords = ["spec", "proposal", "design", "规范", "设计", "文档"]
    return specKeywords.some((kw) => message.toLowerCase().includes(kw))
  }

  async generateProposal() {
    this.state.proposalGenerated = true
    return { status: "proposal_created" }
  }

  async generateSpecs() {
    this.state.specsGenerated = true
    return { status: "specs_created" }
  }

  async generateDesign() {
    this.state.designGenerated = true
    return { status: "design_created" }
  }

  async generateTasks() {
    this.state.tasksGenerated = true
    return { status: "tasks_created" }
  }

  markDesignApproved() {
    this.state.userApprovedDesign = true
  }

  markExplorationCompleted() {
    this.state.explorationCompleted = true
  }

  getState() {
    return { ...this.state }
  }

  reset() {
    this.state = {
      proposalGenerated: false,
      specsGenerated: false,
      designGenerated: false,
      tasksGenerated: false,
      userApprovedDesign: false,
      explorationCompleted: false,
    }
  }
}

export const specificationPhaseManager = new SpecificationPhaseManager()