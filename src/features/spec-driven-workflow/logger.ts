export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "AUDIT" | "PERF"

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  metadata?: Record<string, unknown>
}

export class Logger {
  private logs: LogEntry[] = []
  private logDir: string

  constructor(logDir: string = "~/opencode-autopolis/logs") {
    this.logDir = logDir
  }

  log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    this.logs.push({ timestamp: new Date(), level, message, metadata })
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.log("ERROR", message, metadata)
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log("WARN", message, metadata)
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log("INFO", message, metadata)
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.log("DEBUG", message, metadata)
  }

  audit(message: string, metadata?: Record<string, unknown>) {
    this.log("AUDIT", message, metadata)
  }

  perf(message: string, metadata?: Record<string, unknown>) {
    this.log("PERF", message, metadata)
  }

  async rotate() {
    this.logs = []
  }

  getMetrics() {
    const total = this.logs.length
    const errorCount = this.logs.filter((l) => l.level === "ERROR").length
    return { total, errorCount, completionRate: 1 - errorCount / total }
  }
}

export const logger = new Logger()

export type ErrorCategory = "Agent" | "Hook" | "Skill" | "MCP" | "Workflow"

export class ErrorHandler {
  private errorCounts: Map<ErrorCategory, number> = new Map()

  classify(error: Error): ErrorCategory {
    const message = error.message.toLowerCase()
    if (message.includes("agent")) return "Agent"
    if (message.includes("hook")) return "Hook"
    if (message.includes("skill")) return "Skill"
    if (message.includes("mcp")) return "MCP"
    return "Workflow"
  }

  async retry(error: Error, category: ErrorCategory): Promise<boolean> {
    const count = this.errorCounts.get(category) ?? 0
    if (count < 3) {
      this.errorCounts.set(category, count + 1)
      return true
    }
    return false
  }

  reset(category?: ErrorCategory) {
    if (category) {
      this.errorCounts.delete(category)
    } else {
      this.errorCounts.clear()
    }
  }
}

export const errorHandler = new ErrorHandler()