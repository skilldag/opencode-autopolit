export interface Spec {
  id: string
  name: string
  requirements: string[]
  scenarios: SpecScenario[]
}

export interface Proposal {
  name: string
  why: string
  whatChanges: string[]
  capabilities: string[]
  impact: string
}

export interface SpecScenario {
  id: string
  given: string
  when: string
  then: string
}

export interface Design {
  context: string
  goals: string[]
  decisions: DesignDecision[]
  risks: string[]
}

export interface DesignDecision {
  id: string
  decision: string
  rationale: string
}

export interface Task {
  id: string
  description: string
  estimatedMinutes: number
  dependsOn?: string[]
}

export class SpecDocumentGenerator {
  async generateProposal(featureName: string): Promise<{ name: string; why: string; whatChanges: string[]; capabilities: string[]; impact: string }> {
    return {
      name: featureName,
      why: "需要实现此功能以满足用户需求",
      whatChanges: ["添加新功能模块", "创建相关配置文件"],
      capabilities: ["核心功能", "配置选项"],
      impact: "影响范围：局部",
    }
  }

  async generateSpecs(featureName: string): Promise<Spec[]> {
    return [
      {
        id: "core",
        name: `${featureName} Core`,
        requirements: ["实现核心功能"],
        scenarios: [
          {
            id: "s1",
            given: "系统初始状态",
            when: "用户触发操作",
            then: "系统响应正确",
          },
        ],
      },
    ]
  }

  async generateDesign(featureName: string): Promise<Design> {
    return {
      context: `实现 ${featureName} 功能`,
      goals: ["完成功能实现", "通过测试验证"],
      decisions: [
        {
          id: "d1",
          decision: "使用 TypeScript",
          rationale: "类型安全",
        },
      ],
      risks: [],
    }
  }

  async generateTasks(specs: Spec[]): Promise<Task[]> {
    const tasks: Task[] = []
    let id = 1
    for (const spec of specs) {
      for (const scenario of spec.scenarios) {
        tasks.push({
          id: `${id}`,
          description: `实现 scenario: ${scenario.id}`,
          estimatedMinutes: 3,
        })
        id++
      }
    }
    return tasks
  }
}

export const specDocumentGenerator = new SpecDocumentGenerator()