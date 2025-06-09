import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 创建服务器实例
const server = new McpServer({
  name: "mcp-test-server",
  version: "1.0.0"
}, {
  capabilities: {
    resources: {},
    tools: {},
    prompts: {}
  }
});

// 存储测试数据
const testData = {
  users: [
    { id: 1, name: "张三", email: "zhangsan@example.com", role: "admin" },
    { id: 2, name: "李四", email: "lisi@example.com", role: "user" },
    { id: 3, name: "王五", email: "wangwu@example.com", role: "user" }
  ],
  todos: [
    { id: 1, title: "完成MCP测试项目", completed: false, userId: 1 },
    { id: 2, title: "学习TypeScript", completed: true, userId: 2 },
    { id: 3, title: "测试MCP功能", completed: false, userId: 1 }
  ],
  logs: [] as string[]
};

// === RESOURCES 测试 ===
// 注册用户资源
server.resource("用户列表", "test://users", {
  description: "获取所有用户数据",
  mimeType: "application/json"
}, async () => {
  return {
    contents: [{
      uri: "test://users",
      mimeType: "application/json",
      text: JSON.stringify(testData.users, null, 2)
    }]
  };
});

// 注册待办事项资源
server.resource("待办事项", "test://todos", {
  description: "获取所有待办事项数据",
  mimeType: "application/json"
}, async () => {
  return {
    contents: [{
      uri: "test://todos",
      mimeType: "application/json",
      text: JSON.stringify(testData.todos, null, 2)
    }]
  };
});

// 注册配置资源
server.resource("配置信息", "test://config", {
  description: "系统配置信息",
  mimeType: "text/plain"
}, async () => {
  return {
    contents: [{
      uri: "test://config",
      mimeType: "text/plain",
      text: `# MCP测试服务器配置
服务器名称: mcp-test-server
版本: 1.0.0
启动时间: ${new Date().toISOString()}
功能: resources, tools, prompts
`
    }]
  };
});

// 注册日志资源
server.resource("系统日志", "test://logs", {
  description: "查看系统操作日志",
  mimeType: "application/json"
}, async () => {
  return {
    contents: [{
      uri: "test://logs",
      mimeType: "application/json",
      text: JSON.stringify(testData.logs, null, 2)
    }]
  };
});

// === TOOLS 测试 ===
// 添加用户工具
server.tool("add_user", "添加新用户", {
  name: z.string().describe("用户姓名"),
  email: z.string().describe("邮箱地址"),
  role: z.enum(["admin", "user"]).optional().default("user").describe("用户角色")
}, async (args) => {
  const { name, email, role = "user" } = args;
  const newUser = {
    id: Math.max(...testData.users.map(u => u.id)) + 1,
    name,
    email,
    role
  };
  
  testData.users.push(newUser);
  testData.logs.push(`添加用户: ${name} (${email})`);
  
  return {
    content: [{
      type: "text",
      text: `✅ 成功添加用户: ${JSON.stringify(newUser, null, 2)}`
    }]
  };
});

// 搜索用户工具
server.tool("search_users", "搜索用户", {
  query: z.string().describe("搜索关键词"),
  role: z.enum(["admin", "user"]).optional().describe("按角色筛选")
}, async (args) => {
  const { query, role } = args;
  let results = testData.users.filter(user => 
    user.name.includes(query) || user.email.includes(query)
  );
  
  if (role) {
    results = results.filter(user => user.role === role);
  }
  
  testData.logs.push(`搜索用户: "${query}" ${role ? `(角色: ${role})` : ""}`);
  
  return {
    content: [{
      type: "text",
      text: `🔍 搜索结果 (${results.length}个):\n${JSON.stringify(results, null, 2)}`
    }]
  };
});

// 创建待办事项工具
server.tool("create_todo", "创建待办事项", {
  title: z.string().describe("待办事项标题"),
  userId: z.number().describe("用户ID")
}, async (args) => {
  const { title, userId } = args;
  
  // 检查用户是否存在
  const user = testData.users.find(u => u.id === userId);
  if (!user) {
    return {
      content: [{
        type: "text",
        text: `❌ 错误: 用户ID ${userId} 不存在`
      }]
    };
  }
  
  const newTodo = {
    id: Math.max(...testData.todos.map(t => t.id)) + 1,
    title,
    completed: false,
    userId
  };
  
  testData.todos.push(newTodo);
  testData.logs.push(`创建待办事项: "${title}" (用户: ${user.name})`);
  
  return {
    content: [{
      type: "text",
      text: `✅ 成功创建待办事项: ${JSON.stringify(newTodo, null, 2)}`
    }]
  };
});

// 计算工具
server.tool("calculate", "执行数学计算", {
  expression: z.string().optional().describe("数学表达式，如 '2 + 3 * 4'"),
  operation: z.enum(["add", "subtract", "multiply", "divide"]).optional().describe("基本运算操作"),
  a: z.number().optional().describe("第一个数字"),
  b: z.number().optional().describe("第二个数字")
}, async (args) => {
  let result: number;
  let operation: string;
  
  if (args.expression) {
    // 简单的表达式求值（仅支持基本运算）
    try {
      // 安全的数学表达式求值
      const sanitized = args.expression.replace(/[^0-9+\-*/().\s]/g, '');
      result = Function(`"use strict"; return (${sanitized})`)();
      operation = args.expression;
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ 无效的数学表达式: ${args.expression}`
        }]
      };
    }
  } else if (args.operation && args.a !== undefined && args.b !== undefined) {
    const { operation: op, a, b } = args;
    switch (op) {
      case "add":
        result = a + b;
        operation = `${a} + ${b}`;
        break;
      case "subtract":
        result = a - b;
        operation = `${a} - ${b}`;
        break;
      case "multiply":
        result = a * b;
        operation = `${a} * ${b}`;
        break;
      case "divide":
        if (b === 0) {
          return {
            content: [{
              type: "text",
              text: "❌ 错误: 除数不能为零"
            }]
          };
        }
        result = a / b;
        operation = `${a} / ${b}`;
        break;
      default:
        return {
          content: [{
            type: "text",
            text: `❌ 未知的运算操作: ${op}`
          }]
        };
    }
  } else {
    return {
      content: [{
        type: "text",
        text: "❌ 请提供数学表达式或运算操作参数"
      }]
    };
  }
  
  testData.logs.push(`计算: ${operation} = ${result}`);
  
  return {
    content: [{
      type: "text",
      text: `🧮 计算结果: ${operation} = ${result}`
    }]
  };
});

// === PROMPTS 测试 ===
// 用户分析提示
server.prompt("user_analysis", "用户数据分析提示", {
  user_id: z.string().describe("要分析的用户ID"),
  analysis_type: z.enum(["basic", "detailed"]).optional().describe("分析类型")
}, async (args) => {
  const userId = parseInt(args.user_id);
  const analysisType = args.analysis_type || "basic";
  const user = testData.users.find(u => u.id === userId);
  const userTodos = testData.todos.filter(t => t.userId === userId);
  
  if (!user) {
    throw new Error(`用户ID ${userId} 不存在`);
  }
  
  let prompt = `请分析以下用户数据：

用户信息：
- ID: ${user.id}
- 姓名: ${user.name}
- 邮箱: ${user.email}
- 角色: ${user.role}

待办事项 (${userTodos.length}个):
${userTodos.map(todo => `- [${todo.completed ? '✓' : ' '}] ${todo.title}`).join('\n')}`;

  if (analysisType === "detailed") {
    prompt += `

请从以下角度进行详细分析：
1. 用户活跃度评估
2. 任务完成率分析
3. 工作效率建议
4. 潜在改进点`;
  } else {
    prompt += `

请提供基本的用户概况分析。`;
  }
  
  return {
    description: `${user.name}的${analysisType === "detailed" ? "详细" : "基本"}分析`,
    messages: [{
      role: "user",
      content: { type: "text", text: prompt }
    }]
  };
});

// 待办事项摘要提示
server.prompt("todo_summary", "待办事项摘要提示", {
  status: z.enum(["all", "completed", "pending"]).optional().describe("状态筛选")
}, async (args) => {
  const status = args.status || "all";
  let filteredTodos = testData.todos;
  
  if (status === "completed") {
    filteredTodos = testData.todos.filter(t => t.completed);
  } else if (status === "pending") {
    filteredTodos = testData.todos.filter(t => !t.completed);
  }
  
  const todoPrompt = `请为以下待办事项列表生成摘要报告：

状态筛选: ${status}
总数: ${filteredTodos.length}个

待办事项列表：
${filteredTodos.map(todo => {
  const user = testData.users.find(u => u.id === todo.userId);
  return `- [${todo.completed ? '✓' : ' '}] ${todo.title} (负责人: ${user?.name || '未知'})`;
}).join('\n')}

请分析：
1. 完成情况统计
2. 负责人分布
3. 优先级建议`;

  return {
    description: `待办事项摘要 (${status})`,
    messages: [{
      role: "user",
      content: { type: "text", text: todoPrompt }
    }]
  };
});

// 系统报告提示
server.prompt("system_report", "系统状态报告提示", async () => {
  const systemPrompt = `请基于以下系统数据生成状态报告：

系统信息：
- 服务器: mcp-test-server v1.0.0
- 启动时间: ${new Date().toISOString()}
- 当前时间: ${new Date().toISOString()}

数据统计：
- 用户总数: ${testData.users.length}
- 管理员数量: ${testData.users.filter(u => u.role === 'admin').length}
- 普通用户数量: ${testData.users.filter(u => u.role === 'user').length}
- 待办事项总数: ${testData.todos.length}
- 已完成任务: ${testData.todos.filter(t => t.completed).length}
- 待完成任务: ${testData.todos.filter(t => !t.completed).length}
- 操作日志条数: ${testData.logs.length}

最近操作日志：
${testData.logs.slice(-5).map(log => `- ${log}`).join('\n') || '- 暂无操作记录'}

请生成详细的系统健康状况报告。`;

  return {
    description: "系统状态报告",
    messages: [{
      role: "user",
      content: { type: "text", text: systemPrompt }
    }]
  };
});

// 代码审查提示
server.prompt("code_review", "代码审查提示模板", {
  language: z.string().describe("编程语言"),
  code_snippet: z.string().describe("代码片段"),
  focus_areas: z.string().optional().describe("重点关注领域")
}, async (args) => {
  const { language, code_snippet } = args;
  const focus_areas = args.focus_areas || "代码质量、性能、安全性";
  
  const codeReviewPrompt = `请对以下${language}代码进行审查：

\`\`\`${language}
${code_snippet}
\`\`\`

重点关注领域：${focus_areas}

请从以下角度进行分析：
1. 代码质量和可读性
2. 性能优化建议
3. 安全性考虑
4. 最佳实践遵循情况
5. 潜在bug或问题
6. 改进建议

请提供具体的修改建议和示例代码。`;

  return {
    description: `${language}代码审查`,
    messages: [{
      role: "user",
      content: { type: "text", text: codeReviewPrompt }
    }]
  };
});

// 启动服务器
async function main() {
  console.log("🚀 启动 MCP 测试服务器...");
  console.log("功能包括:");
  console.log("  📄 Resources: users, todos, config, logs");
  console.log("  🔧 Tools: add_user, search_users, create_todo, calculate");
  console.log("  💬 Prompts: user_analysis, todo_summary, system_report, code_review");
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.log("✅ MCP 测试服务器已启动并等待连接...");
}

// 错误处理
process.on('SIGINT', () => {
  console.log("\n👋 MCP 测试服务器正在关闭...");
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error("❌ 未捕获的异常:", error);
  process.exit(1);
});

// 启动服务器
main().catch(error => {
  console.error("❌ 服务器启动失败:", error);
  process.exit(1);
}); 