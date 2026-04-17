export type RollbackType = "proposal" | "specs" | "design" | "tasks" | "implementation"

export interface RollbackPoint {
  type: RollbackType
  timestamp: Date
  snapshot?: string
}

export class RollbackManager {
  private rollbackPoints: Map<string, RollbackPoint[]> = new Map()

  createCheckpoint(type: RollbackType, featureName: string) {
    const key = featureName
    const points = this.rollbackPoints.get(key) ?? []
    points.push({ type, timestamp: new Date() })
    this.rollbackPoints.set(key, points)
  }

  async rollback(type: RollbackType, featureName: string): Promise<boolean> {
    const points = this.rollbackPoints.get(featureName)
    if (!points || points.length === 0) return false

    const lastPoint = points.pop()
    return lastPoint?.type === type
  }

  suggestRollback(error: Error): RollbackType | null {
    const message = error.message.toLowerCase()
    if (message.includes("spec")) return "specs"
    if (message.includes("design")) return "design"
    if (message.includes("task")) return "tasks"
    return "implementation"
  }
}

export const rollbackManager = new RollbackManager()