# Cursor MCP 配置指南

本文档说明如何将此 MCP 测试项目配置到 Cursor 编辑器中。

## 配置步骤

### 1. 确保项目已构建

首先确保项目已经构建完成：

```bash
npm run build
```

### 2. 配置 Cursor MCP

#### 方法一：使用配置文件

1. 在项目根目录找到 `mcp-config.json` 文件
2. 将此文件的内容复制到 Cursor 的 MCP 配置中

#### 方法二：直接在 Cursor 中配置

在 Cursor 的设置中，找到 MCP 配置部分，添加以下配置：

```json
{
  "mcpServers": {
    "mcp-test-project": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/Users/yutou-air/code/mcp-test",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**注意**: 请将 `cwd` 路径替换为你的实际项目路径。

### 3. 重启 Cursor

配置完成后，重启 Cursor 编辑器以使配置生效。

## 可用功能

配置成功后，你可以在 Cursor 中使用以下 MCP 功能：

### 📄 Resources (资源)
- `test://users` - 获取所有用户数据
- `test://todos` - 获取所有待办事项数据  
- `test://config` - 系统配置信息
- `test://logs` - 查看系统操作日志

### 🔧 Tools (工具)
- `add_user` - 添加新用户
- `search_users` - 搜索用户（支持按姓名、邮箱和角色筛选）
- `create_todo` - 创建待办事项
- `calculate` - 执行数学计算（支持表达式和基本运算）

### 💬 Prompts (提示模板)
- `user_analysis` - 用户数据分析提示
- `todo_summary` - 待办事项摘要提示
- `system_report` - 系统状态报告提示
- `code_review` - 代码审查提示模板

## 使用示例

配置成功后，你可以在 Cursor 中这样使用：

1. **查看用户数据**: 询问 "显示所有用户信息"
2. **添加用户**: 说 "添加一个新用户，姓名是张三，邮箱是zhangsan@example.com"
3. **数学计算**: 问 "计算 10 + 5 * 2"
4. **代码审查**: 请求 "帮我审查这段代码的质量"

## 故障排除

### 常见问题

1. **MCP 服务器无法启动**
   - 检查 Node.js 是否已安装
   - 确保项目已正确构建 (`npm run build`)
   - 验证路径配置是否正确

2. **权限问题**
   - 确保 `dist/index.js` 文件有执行权限
   - 检查项目目录的读写权限

3. **端口冲突**
   - 如果有端口冲突，可以修改 `src/index.ts` 中的端口配置

### 调试方法

1. **手动测试 MCP 服务器**:
   ```bash
   npm start
   ```

2. **运行测试客户端**:
   ```bash
   npm test
   ```

3. **查看 Cursor 日志**:
   在 Cursor 的开发者工具中查看 MCP 相关的日志信息

## 高级配置

### 环境变量

你可以在配置中添加更多环境变量：

```json
{
  "mcpServers": {
    "mcp-test-project": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/Users/yutou-air/code/mcp-test",
      "env": {
        "NODE_ENV": "production",
        "DEBUG": "mcp:*",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### 多个 MCP 服务器

你可以配置多个 MCP 服务器：

```json
{
  "mcpServers": {
    "mcp-test-project": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/Users/yutou-air/code/mcp-test"
    },
    "another-mcp-server": {
      "command": "python",
      "args": ["server.py"],
      "cwd": "/path/to/another/project"
    }
  }
}
```

## 更新和维护

当你修改了 MCP 服务器代码后：

1. 重新构建项目: `npm run build`
2. 重启 Cursor 编辑器
3. 测试功能是否正常工作

## 支持

如果遇到问题，可以：

1. 查看项目的 README.md 文件
2. 运行 `npm test` 验证 MCP 服务器功能
3. 检查 Cursor 的 MCP 配置是否正确 