/**
 * MCP-UI Playground Server
 * 
 * An MCP server that provides interactive UI tools using @mcp-ui/server.
 * Each tool returns a UIResource that can be rendered by an MCP client.
 * 
 * Run with: bun --hot src/index.ts
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { helloUITool, handleHelloUI, type HelloUIInput } from './tools/hello-ui';
import { counterUITool, handleCounterUI, type CounterUIInput } from './tools/counter-ui';
import { formUITool, handleFormUI, type FormUIInput } from './tools/form-ui';
import { chartUITool, handleChartUI, type ChartUIInput } from './tools/chart-ui';
import { dashboardUITool, handleDashboardUI, type DashboardUIInput } from './tools/dashboard-ui';
import { todoUITool, handleTodoUI, type TodoUIInput } from './tools/todo-ui';
import { weatherUITool, handleWeatherUI, type WeatherUIInput } from './tools/weather-ui';

// Create MCP server
const server = new Server(
  {
    name: 'mcp-ui-playground',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool registry for easy management
const tools = {
  hello_ui: { definition: helloUITool, handler: handleHelloUI },
  counter_ui: { definition: counterUITool, handler: handleCounterUI },
  form_ui: { definition: formUITool, handler: handleFormUI },
  chart_ui: { definition: chartUITool, handler: handleChartUI },
  dashboard_ui: { definition: dashboardUITool, handler: handleDashboardUI },
  todo_ui: { definition: todoUITool, handler: handleTodoUI },
  weather_ui: { definition: weatherUITool, handler: handleWeatherUI },
} as const;

// Handle list_tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(tools).map(([name, { definition }]) => ({
      name: definition.name,
      description: definition.description,
      inputSchema: {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(definition.inputSchema.shape || {}).map(([key, schema]: [string, any]) => [
            key,
            {
              type: getZodType(schema),
              description: schema.description,
              ...(schema._def?.values && { enum: schema._def.values }),
            },
          ])
        ),
      },
    })),
  };
});

// Handle call_tool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case 'hello_ui':
        return { content: [handleHelloUI(args as HelloUIInput)] };
      
      case 'counter_ui':
        return { content: [handleCounterUI(args as CounterUIInput)] };
      
      case 'form_ui':
        return { content: [handleFormUI(args as FormUIInput)] };
      
      case 'chart_ui':
        return { content: [handleChartUI(args as ChartUIInput)] };
      
      case 'dashboard_ui':
        return { content: [handleDashboardUI(args as DashboardUIInput)] };
      
      case 'todo_ui':
        return { content: [handleTodoUI(args as TodoUIInput)] };
      
      case 'weather_ui':
        return { content: [handleWeatherUI(args as WeatherUIInput)] };
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Helper to convert Zod types to JSON Schema types
function getZodType(schema: any): string {
  const typeName = schema._def?.typeName;
  switch (typeName) {
    case 'ZodString':
      return 'string';
    case 'ZodNumber':
      return 'number';
    case 'ZodBoolean':
      return 'boolean';
    case 'ZodArray':
      return 'array';
    case 'ZodObject':
      return 'object';
    case 'ZodEnum':
      return 'string';
    case 'ZodOptional':
      return getZodType(schema._def.innerType);
    default:
      return 'string';
  }
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP-UI Playground Server started');
  console.error('Available tools:', Object.keys(tools).join(', '));
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
