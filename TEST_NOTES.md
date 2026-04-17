# Autopolit 插件测试记录

## 测试时间
2026-04-17

## 配置
- 插件路径: `file:///Users/meetai/opencode-autopolit/dist/index.js`
- 位置: `~/.config/opencode/opencode.json`

## 测试步骤
1. 重启 OpenCode
2. 打开新会话
3. 输入: `implement test` 或 `tdd`
4. 观察是否触发 autopolit workflow 提示

## 失败回滚

### 方案 1: 移除插件配置
编辑 `~/.config/opencode/opencode.json`，删除这行:
```json
"file:///Users/meetai/opencode-autopolit/dist/index.js",
```

### 方案 2: 恢复复制方式
```bash
# 复制 keyword-detector 改动到 oh-my-openagent
cp ~/opencode-autopolit/src/hooks/keyword-detector/constants.ts \
   /Users/meetai/source/opencode-flow/oh-my-openagent/src/hooks/keyword-detector/

# 重新构建
cd /Users/meetai/source/opencode-flow/oh-my-openagent
npm run build
```

## 成功标志
看到类似这样的提示:
```
🤖 AUTOPOLIT WORKFLOW ACTIVATED

🔄 WORKFLOW SEQUENCE (MANDATORY):
1. EXPLORE → 2. SPEC → 3. DEV → 4. VERIFY → 5. ARCHIVE
```