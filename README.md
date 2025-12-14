# MCP-UI Learning Playground

An interactive learning environment for building UI components in AI chat applications using **MCP-UI** (Model Context Protocol - User Interface).

## What is MCP-UI?

MCP-UI is an SDK that enables AI assistants to send **interactive UI components** (buttons, forms, charts) instead of just plain text. It consists of:

| Component | Purpose | Package |
|-----------|---------|---------|
| **Server SDK** | Creates UIResource objects | `@mcp-ui/server` |
| **Client SDK** | Renders UIResources in React/Web | `@mcp-ui/client` |

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0 (recommended)
- Node.js >= 18 (alternative)

### Installation

```bash
# Clone and install
cd ~/ai_projects/development/mcp_ui
bun install

# Start the playground (Option A - quickest)
bun run dev:playground
# Open http://localhost:3000
```

## Project Structure

```
mcp_ui/
├── playground/                 # Minimal self-contained demo
│   ├── index.html             # Entry point
│   ├── app.tsx                # React playground app
│   ├── mock-responses.ts      # Sample UIResource objects
│   └── serve.ts               # Bun dev server
│
├── server/                     # Full MCP Server (TypeScript)
│   └── src/
│       ├── index.ts           # MCP server entry
│       ├── tools/             # 7 example tools
│       │   ├── hello-ui.ts    # Basic HTML greeting
│       │   ├── counter-ui.ts  # Interactive counter
│       │   ├── form-ui.ts     # Contact form
│       │   ├── chart-ui.ts    # Data visualization
│       │   ├── dashboard-ui.ts # External URL embed
│       │   ├── todo-ui.ts     # Todo list
│       │   └── weather-ui.ts  # Weather widget
│       └── lib/
│           └── ui-helpers.ts  # Shared utilities
│
├── client/                     # React Client (coming soon)
├── examples/                   # Progressive tutorials (coming soon)
└── reference/                  # Documentation
    └── mcp-ui-guide-dashboard.html
```

## Available Tools

The MCP server includes 7 interactive UI tools:

| Tool | Description | UIResource Type |
|------|-------------|-----------------|
| `hello_ui` | Greeting with themes | `text/html` |
| `counter_ui` | Interactive +/- counter | `text/html` |
| `form_ui` | Customizable forms | `text/html` |
| `chart_ui` | Bar/line charts | `text/html` |
| `dashboard_ui` | External URL embed | `text/uri-list` |
| `todo_ui` | Todo list with actions | `text/html` |
| `weather_ui` | Weather widget | `text/html` |

## UIResource Object

The core data structure in MCP-UI:

```typescript
{
  type: 'resource',
  resource: {
    uri: 'ui://my-component/id',      // Unique identifier
    mimeType: 'text/html',            // Content type
    text: '<button>Click me</button>', // HTML content
    _meta: {                          // Optional metadata
      title: 'My Component',
      description: 'A button component'
    }
  }
}
```

### Supported MIME Types

| mimeType | Content | Use Case |
|----------|---------|----------|
| `text/html` | Direct HTML | Forms, buttons, widgets |
| `text/uri-list` | External URL | Embed dashboards |
| `application/vnd.mcp-ui.remote-dom` | Remote DOM script | Dynamic apps |

## Running the Server

### As a Standalone Server

```bash
cd server
bun run dev
```

### As an MCP Server (for Claude Desktop, etc.)

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "mcp-ui-playground": {
      "command": "bun",
      "args": ["run", "/path/to/mcp_ui/server/src/index.ts"]
    }
  }
}
```

## Creating Your Own Tools

### 1. Basic HTML Tool

```typescript
import { createHtmlResource } from '../lib/ui-helpers';

export function myTool(input: { message: string }) {
  const html = `
    <div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">
      <h1>${input.message}</h1>
      <button onclick="window.parent.postMessage({
        type: 'mcp-ui-action',
        action: 'tool',
        payload: { toolName: 'my_action', params: {} }
      }, '*')">Click Me</button>
    </div>
  `;

  return createHtmlResource({
    uri: 'ui://my-tool/instance',
    html,
    title: 'My Tool',
    description: 'A custom tool'
  });
}
```

### 2. Register the Tool

```typescript
// In server/src/index.ts
import { myTool } from './tools/my-tool';

// Add to tools registry
const tools = {
  // ... existing tools
  my_tool: { definition: myToolDef, handler: myTool },
};
```

## Handling User Actions

When users interact with UI components (click buttons, submit forms), actions are sent via `postMessage`:

```javascript
// In your HTML
window.parent.postMessage({
  type: 'mcp-ui-action',
  action: 'tool',           // or 'prompt' or 'link'
  payload: {
    toolName: 'my_action',
    params: { key: 'value' }
  }
}, '*');
```

The client receives these in `onUIAction`:

```typescript
<UIResourceRenderer
  resource={resource}
  onUIAction={(result) => {
    console.log('Action:', result.type, result.payload);
    // Handle the action...
  }}
/>
```

## Development Scripts

```bash
# Root level
bun install              # Install all dependencies
bun run dev              # Start all dev servers
bun run dev:playground   # Start playground only
bun run dev:server       # Start MCP server only
bun run build            # Build all packages

# Playground
cd playground
bun run dev              # Start with hot reload
bun run static           # Open static HTML directly

# Server
cd server
bun run dev              # Start with hot reload
bun run start            # Start production
```

## Resources

- [MCP-UI Documentation](https://mcpui.dev)
- [MCP-UI GitHub](https://github.com/idosal/mcp-ui)
- [MCP Protocol](https://modelcontextprotocol.io)
- [@mcp-ui/server on npm](https://www.npmjs.com/package/@mcp-ui/server)
- [@mcp-ui/client on npm](https://www.npmjs.com/package/@mcp-ui/client)

## License

MIT
