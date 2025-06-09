import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testMcpServer() {
  console.log("🧪 开始测试 MCP 服务器功能...\n");
  
  // 创建客户端传输
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"]
  });

  // 创建客户端
  const client = new Client({
    name: "mcp-test-client",
    version: "1.0.0"
  });

  try {
    // 连接到服务器
    console.log("🔗 连接到 MCP 服务器...");
    await client.connect(transport);
    console.log("✅ 连接成功!\n");

    // === 测试 RESOURCES ===
    console.log("📄 测试 Resources 功能:");
    console.log("=" .repeat(40));
    
    // 列出资源
    console.log("📋 列出所有资源:");
    const resources = await client.listResources();
    resources.resources.forEach((resource: any) => {
      console.log(`  - ${resource.name}: ${resource.uri}`);
      console.log(`    ${resource.description}`);
    });
    console.log();

    // 读取用户资源
    console.log("👥 读取用户资源:");
    const usersResource = await client.readResource({ uri: "test://users" });
    console.log(usersResource.contents[0].text);
    console.log();

    // 读取配置资源
    console.log("⚙️ 读取配置资源:");
    const configResource = await client.readResource({ uri: "test://config" });
    console.log(configResource.contents[0].text);
    console.log();

    // === 测试 TOOLS ===
    console.log("🔧 测试 Tools 功能:");
    console.log("=" .repeat(40));

    // 列出工具
    console.log("🛠️ 列出所有工具:");
    const tools = await client.listTools();
    tools.tools.forEach((tool: any) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // 测试添加用户
    console.log("➕ 测试添加用户:");
    const addUserResult = await client.callTool({
      name: "add_user",
      arguments: {
        name: "赵六",
        email: "zhaoliu@example.com",
        role: "admin"
      }
    });
    console.log((addUserResult.content as any)[0].text);
    console.log();

    // 测试搜索用户
    console.log("🔍 测试搜索用户:");
    const searchResult = await client.callTool({
      name: "search_users",
      arguments: {
        query: "张",
        role: "admin"
      }
    });
    console.log((searchResult.content as any)[0].text);
    console.log();

    // 测试创建待办事项
    console.log("📝 测试创建待办事项:");
    const createTodoResult = await client.callTool({
      name: "create_todo",
      arguments: {
        title: "测试 MCP SDK 功能",
        userId: 1
      }
    });
    console.log((createTodoResult.content as any)[0].text);
    console.log();

    // 测试计算工具
    console.log("🧮 测试计算工具:");
    const calcResult1 = await client.callTool({
      name: "calculate",
      arguments: {
        expression: "10 + 5 * 2"
      }
    });
    console.log((calcResult1.content as any)[0].text);

    const calcResult2 = await client.callTool({
      name: "calculate",
      arguments: {
        operation: "divide",
        a: 100,
        b: 4
      }
    });
    console.log((calcResult2.content as any)[0].text);
    console.log();

    // === 测试 PROMPTS ===
    console.log("💬 测试 Prompts 功能:");
    console.log("=" .repeat(40));

    // 列出提示模板
    console.log("📝 列出所有提示模板:");
    const prompts = await client.listPrompts();
    prompts.prompts.forEach((prompt: any) => {
      console.log(`  - ${prompt.name}: ${prompt.description}`);
      if (prompt.arguments && prompt.arguments.length > 0) {
        console.log(`    参数: ${prompt.arguments.map((arg: any) => 
          `${arg.name}${arg.required ? '*' : ''}`).join(', ')}`);
      }
    });
    console.log();

    // 测试用户分析提示
    console.log("📊 测试用户分析提示:");
    const userAnalysis = await client.getPrompt({
      name: "user_analysis",
      arguments: {
        user_id: "1",
        analysis_type: "detailed"
      }
    });
    console.log(`描述: ${userAnalysis.description}`);
    console.log("提示内容:");
    console.log(userAnalysis.messages[0].content.text);
    console.log();

    // 测试待办事项摘要提示
    console.log("📋 测试待办事项摘要提示:");
    const todoSummary = await client.getPrompt({
      name: "todo_summary",
      arguments: {
        status: "pending"
      }
    });
    console.log(`描述: ${todoSummary.description}`);
    console.log("提示内容:");
    console.log(todoSummary.messages[0].content.text);
    console.log();

    // 测试系统报告提示
    console.log("📈 测试系统报告提示:");
    const systemReport = await client.getPrompt({
      name: "system_report",
      arguments: {}
    });
    console.log(`描述: ${systemReport.description}`);
    console.log("提示内容:");
    console.log(systemReport.messages[0].content.text);
    console.log();

    // 测试代码审查提示
    console.log("🔍 测试代码审查提示:");
    const codeReview = await client.getPrompt({
      name: "code_review",
      arguments: {
        language: "typescript",
        code_snippet: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        focus_areas: "性能优化、递归深度"
      }
    });
    console.log(`描述: ${codeReview.description}`);
    console.log("提示内容:");
    console.log(codeReview.messages[0].content.text);
    console.log();

    // 查看操作日志
    console.log("📋 查看操作日志:");
    const logsResource = await client.readResource({ uri: "test://logs" });
    console.log(logsResource.contents[0].text);

    console.log("\n🎉 所有测试完成!");

  } catch (error) {
    console.error("❌ 测试过程中出现错误:", error);
  } finally {
    // 关闭连接
    await client.close();
    console.log("👋 客户端已关闭连接");
  }
}

// 运行测试
testMcpServer().catch(error => {
  console.error("❌ 测试失败:", error);
  process.exit(1);
}); 