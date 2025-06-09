# 快速配置到 Cursor

## 1. 复制以下配置到 Cursor 的 MCP 设置中：

```json
{
  "mcpServers": {
    "mcp-test-project": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/Users/yutou-air/code/mcp-test"
    }
  }
}
```

## 2. 重启 Cursor

## 3. 开始使用

配置成功后，你可以：

- 📄 **查看数据**: "显示所有用户" 或 "显示待办事项"
- ➕ **添加用户**: "添加用户张三，邮箱zhangsan@example.com"  
- 🔍 **搜索用户**: "搜索管理员用户"
- 📝 **创建任务**: "为用户1创建一个待办事项：学习MCP"
- 🧮 **计算**: "计算 10 + 5 * 2"
- 📊 **分析**: "分析用户1的数据"

就这么简单！🎉 