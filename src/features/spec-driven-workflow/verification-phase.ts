export interface VerificationResult {
  passed: boolean
  checklistItems: ChecklistItem[]
  issues: string[]
}

export interface ChecklistItem {
  id: string
  description: string
  passed: boolean
}

export class VerificationManager {
  private checklists: Map<string, ChecklistItem[]> = new Map()

  generateChecklist(phase: string): ChecklistItem[] {
    const baseChecklist: ChecklistItem[] = [
      { id: "no-todos", description: "代码中无 TODO 注释", passed: false },
      { id: "no-placeholders", description: "无 placeholder 代码", passed: false },
      { id: "no-ai-slop", description: "无 AI 生成痕迹", passed: false },
      { id: "tests-pass", description: "所有测试通过", passed: false },
      { id: "typecheck", description: "TypeScript 类型检查通过", passed: false },
    ]
    this.checklists.set(phase, baseChecklist)
    return baseChecklist
  }

  async verify(phase: string): Promise<VerificationResult> {
    const checklist = this.checklists.get(phase) || this.generateChecklist(phase)
    const issues: string[] = []

    for (const item of checklist) {
      if (!item.passed) {
        issues.push(`未通过检查: ${item.description}`)
      }
    }

    return {
      passed: issues.length === 0,
      checklistItems: checklist,
      issues,
    }
  }

  markChecklistItem(phase: string, itemId: string, passed: boolean) {
    const checklist = this.checklists.get(phase)
    if (checklist) {
      const item = checklist.find((i) => i.id === itemId)
      if (item) item.passed = passed
    }
  }

  requestUserVerification(phase: string, message: string) {
    return {
      type: "user-verification" as const,
      phase,
      message,
      required: true,
    }
  }
}

export const verificationManager = new VerificationManager()