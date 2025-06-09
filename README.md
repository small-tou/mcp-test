# MCP 测试项目

这是一个基于 [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/typescript-sdk) TypeScript SDK 的测试项目，用于演示和测试 MCP 的不同机制，包括 Resources、Tools 和 Prompts。

## 项目特性

### 📄 Resources (资源)
- **用户列表** (`test://users`) - 获取所有用户数据
- **待办事项** (`test://todos`) - 获取所有待办事项数据  
- **配置信息** (`test://config`) - 系统配置信息
- **系统日志** (`test://logs`) - 查看系统操作日志

### 🔧 Tools (工具)
- **add_user** - 添加新用户
- **search_users** - 搜索用户（支持按姓名、邮箱和角色筛选）
- **create_todo** - 创建待办事项
- **calculate** - 执行数学计算（支持表达式和基本运算）

### 💬 Prompts (提示模板)
- **user_analysis** - 用户数据分析提示
- **todo_summary** - 待办事项摘要提示
- **system_report** - 系统状态报告提示
- **code_review** - 代码审查提示模板

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 启动 MCP 服务器

```bash
npm start
```

### 4. 运行测试客户端

在另一个终端中运行：

```bash
npm test
```

## 项目结构

```
mcp-test-project/
├── src/
│   ├── index.ts          # MCP 服务器主文件
│   └── test-client.ts    # 测试客户端
├── dist/                 # 编译后的文件
├── package.json
├── tsconfig.json
└── README.md
```

## 使用示例

### Resources 示例

```typescript
// 列出所有资源
const resources = await client.listResources();

// 读取用户资源
const usersResource = await client.readResource({ 
  uri: "test://users" 
});
```

### Tools 示例

```typescript
// 添加用户
const result = await client.callTool({
  name: "add_user",
  arguments: {
    name: "张三",
    email: "zhangsan@example.com",
    role: "admin"
  }
});

// 计算
const calcResult = await client.callTool({
  name: "calculate",
  arguments: {
    expression: "10 + 5 * 2"
  }
});
```

### Prompts 示例

```typescript
// 获取用户分析提示
const userAnalysis = await client.getPrompt({
  name: "user_analysis",
  arguments: {
    user_id: "1",
    analysis_type: "detailed"
  }
});

// 获取代码审查提示
const codeReview = await client.getPrompt({
  name: "code_review",
  arguments: {
    language: "typescript",
    code_snippet: "function hello() { return 'world'; }",
    focus_areas: "代码质量、性能"
  }
});
```

## 测试数据

项目包含以下测试数据：

### 用户数据
```json
[
  { "id": 1, "name": "张三", "email": "zhangsan@example.com", "role": "admin" },
  { "id": 2, "name": "李四", "email": "lisi@example.com", "role": "user" },
  { "id": 3, "name": "王五", "email": "wangwu@example.com", "role": "user" }
]
```

### 待办事项数据
```json
[
  { "id": 1, "title": "完成MCP测试项目", "completed": false, "userId": 1 },
  { "id": 2, "title": "学习TypeScript", "completed": true, "userId": 2 },
  { "id": 3, "title": "测试MCP功能", "completed": false, "userId": 1 }
]
```

## 开发脚本

- `npm run build` - 编译 TypeScript 代码
- `npm start` - 启动 MCP 服务器
- `npm run dev` - 构建并启动服务器
- `npm test` - 运行测试客户端
- `npm run clean` - 清理构建文件

## MCP 协议说明

Model Context Protocol (MCP) 是一个标准化协议，用于在大型语言模型和外部数据源/工具之间建立安全、可控的连接。

### 核心概念

1. **Resources** - 静态数据或文档，模型可以读取但不能修改
2. **Tools** - 模型可以调用的函数，用于执行操作或获取动态数据
3. **Prompts** - 可重用的提示模板，支持参数化

## 技术栈

- [TypeScript](https://www.typescriptlang.org/) - 主要编程语言
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - MCP 协议实现
- [Node.js](https://nodejs.org/) - 运行时环境

## 许可证

MIT License

## 参考链接

- [MCP 官方文档](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP 规范](https://spec.modelcontextprotocol.io/) 