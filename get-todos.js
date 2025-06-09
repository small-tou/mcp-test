#!/usr/bin/env node

const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");

async function getTodosFromMcp() {
  console.log("🔗 连接到 MCP 服务器获取待办事项...\n");
  
  // 创建客户端传输
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"]
  });

  // 创建客户端
  const client = new Client({
    name: "todos-client",
    version: "1.0.0"
  });

  try {
    // 连接到服务器
    await client.connect(transport);
    console.log("✅ 连接成功!\n");

    // 读取待办事项资源
    console.log("📋 从 MCP 资源获取待办事项:");
    console.log("=" .repeat(50));
    
    const todosResource = await client.readResource({ uri: "test://todos" });
    const todosData = JSON.parse(todosResource.contents[0].text);
    
    console.log("📊 待办事项数据:");
    console.log(JSON.stringify(todosData, null, 2));
    
    console.log("\n📈 数据分析:");
    console.log(`总数: ${todosData.length}个`);
    console.log(`已完成: ${todosData.filter(t => t.completed).length}个`);
    console.log(`待完成: ${todosData.filter(t => !t.completed).length}个`);
    console.log(`完成率: ${((todosData.filter(t => t.completed).length / todosData.length) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error("❌ 获取待办事项时出现错误:", error);
  } finally {
    // 关闭连接
    await client.close();
    console.log("\n👋 客户端已关闭连接");
  }
}

// 运行脚本
getTodosFromMcp().catch(error => {
  console.error("❌ 脚本执行失败:", error);
  process.exit(1);
}); 