export type ConfigLevel = "system" | "user" | "project"

export interface ConfigValue {
  key: string
  value: unknown
  level: ConfigLevel
}

export class ConfigManager {
  private configs: Map<string, ConfigValue> = new Map()

  load(level: ConfigLevel) {}

  get(key: string): unknown {
    const config = this.configs.get(key)
    return config?.value
  }

  set(key: string, value: unknown, level: ConfigLevel = "project") {
    this.configs.set(key, { key, value, level })
  }

  async migrate() {}

  loadEnv() {}
}

export const configManager = new ConfigManager()

export function createConfigHook() {
  return null
}