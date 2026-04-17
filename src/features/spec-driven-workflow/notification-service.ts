export type NotificationLevel = "BLOCK" | "INFO" | "URGENT"

export interface NotificationConfig {
  level: NotificationLevel
  enabled: boolean
  message: string
}

export class NotificationService {
  private config: Map<NotificationLevel, boolean> = new Map([
    ["BLOCK", true],
    ["INFO", false],
    ["URGENT", true],
  ])

  configure(level: NotificationLevel, enabled: boolean) {
    this.config.set(level, enabled)
  }

  async send(level: NotificationLevel, message: string): Promise<boolean> {
    const enabled = this.config.get(level) ?? false
    if (!enabled) return false

    console.log(`[${level}] ${message}`)
    return true
  }

  async sendBlock(message: string) {
    return this.send("BLOCK", message)
  }

  async sendInfo(message: string) {
    return this.send("INFO", message)
  }

  async sendUrgent(message: string) {
    return this.send("URGENT", message)
  }
}

export const notificationService = new NotificationService()

export function createNotificationHook() {
  return null
}