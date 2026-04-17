import { explorationPhaseManager } from "./exploration-phase"
import { specificationPhaseManager } from "./specification-phase"
import { tddPhaseManager } from "./tdd-phase"

export type WorkflowPhase = "EXPLORE" | "SPEC" | "DEV" | "VERIFY" | "ARCHIVE" | "IDLE"

export interface WorkflowState {
  currentPhase: WorkflowPhase
  featureName?: string
  explorationState: ReturnType<typeof explorationPhaseManager.getState>
  specificationState: ReturnType<typeof specificationPhaseManager.getState>
  tddState: ReturnType<typeof tddPhaseManager.getState>
}

export class WorkflowOrchestrator {
  private state: WorkflowState = {
    currentPhase: "IDLE",
    explorationState: explorationPhaseManager.getState(),
    specificationState: specificationPhaseManager.getState(),
    tddState: tddPhaseManager.getState(),
  }

  private phaseOrder: WorkflowPhase[] = ["EXPLORE", "SPEC", "DEV", "VERIFY", "ARCHIVE"]

  canTransitionTo(phase: WorkflowPhase): boolean {
    const currentIndex = this.phaseOrder.indexOf(this.state.currentPhase)
    const targetIndex = this.phaseOrder.indexOf(phase)
    return targetIndex === currentIndex + 1
  }

  transitionTo(phase: WorkflowPhase) {
    if (!this.canTransitionTo(phase)) {
      throw new Error(`Cannot transition from ${this.state.currentPhase} to ${phase}`)
    }
    this.state.currentPhase = phase
  }

  getState() {
    return { ...this.state }
  }
}

export const workflowOrchestrator = new WorkflowOrchestrator()