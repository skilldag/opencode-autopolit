import type { Spec } from "./spec-document-generator"

export interface ArchiveResult {
  success: boolean
  archivePath: string
  mergedSpecs: Spec[]
  conflicts: string[]
}

export class ArchivalManager {
  async mergeDeltaSpecs(deltaSpecs: Spec[], mainSpecs: Spec[]): Promise<Spec[]> {
    const merged = [...mainSpecs]
    const conflicts: string[] = []

    for (const delta of deltaSpecs) {
      const existingIndex = merged.findIndex((s) => s.id === delta.id)
      if (existingIndex >= 0) {
        conflicts.push(`Spec ${delta.id} 存在冲突，将覆盖现有内容`)
        merged[existingIndex] = delta
      } else {
        merged.push(delta)
      }
    }

    return merged
  }

  async archive(changeName: string, specs: Spec[]): Promise<ArchiveResult> {
    const timestamp = new Date().toISOString().split("T")[0]
    const archivePath = `archive/${timestamp}-${changeName}`

    return {
      success: true,
      archivePath,
      mergedSpecs: specs,
      conflicts: [],
    }
  }

  async cleanup(changeName: string) {
    return { removed: ["临时文件", "中间产物"] }
  }
}

export const archivalManager = new ArchivalManager()