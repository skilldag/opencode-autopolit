export type TDDPhase = "RED" | "GREEN" | "REFACTOR" | "IDLE"

export interface TDDState {
  currentPhase: TDDPhase
  testFilePath?: string
  implementationFilePath?: string
  testCases: string[]
}

export class TDDPhaseManager {
  private state: TDDState = {
    currentPhase: "IDLE",
    testCases: [],
  }

  startRED(testFile: string) {
    this.state.currentPhase = "RED"
    this.state.testFilePath = testFile
  }

  moveToGREEN() {
    this.state.currentPhase = "GREEN"
  }

  moveToREFACTOR() {
    this.state.currentPhase = "REFACTOR"
  }

  reset() {
    this.state = { currentPhase: "IDLE", testCases: [] }
  }

  getState() {
    return { ...this.state }
  }
}

export const tddPhaseManager = new TDDPhaseManager()