# Example 06: Full Chat Integration

## What You'll Learn

- Integrating MCP-UI in a complete chat application
- Connecting to an MCP server
- Handling tool responses with UIResources
- Building a production-ready chat UI

## The Big Picture

A complete MCP-UI application has two parts:

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
│                                                             │
│   ┌─────────────────────┐     ┌─────────────────────────┐  │
│   │     MCP Server      │     │      React Client       │  │
│   │                     │     │                         │  │
│   │  • Uses @mcp-ui/    │────▶│  • Uses @mcp-ui/client  │  │
│   │    server           │     │  • UIResourceRenderer   │  │
│   │  • Returns          │     │  • onUIAction handlers  │  │
│   │    UIResources      │     │                         │  │
│   └─────────────────────┘     └─────────────────────────┘  │
│           │                              │                   │
│           │         MCP Protocol         │                   │
│           └──────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Architecture Components

### 1. MCP Server (Backend)

See `server/src/index.ts` for a complete implementation.

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { createUIResource } from '@mcp-ui/server';

const server = new Server({
  name: 'my-mcp-server',
  version: '1.0.0'
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Your tool returns a UIResource
  const uiResource = createUIResource({
    uri: 'ui://my-tool/result',
    content: {
      type: 'rawHtml',
      htmlString: '<h1>Hello!</h1>'
    },
    encoding: 'text'
  });
  
  return { content: [uiResource] };
});
```

### 2. React Client (Frontend)

```tsx
// ChatApp.tsx
import { useState } from 'react';
import { UIResourceRenderer, isUIResource } from '@mcp-ui/client';
import { callMCPTool } from './mcp-client';

interface Message {
  role: 'user' | 'assistant';
  content: string | UIResource;
}

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Call MCP tool (simplified)
    const response = await callMCPTool('hello_ui', { name: input });
    
    // Check if response contains UIResource
    if (response.content[0] && isUIResource(response.content[0])) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content[0] 
      }]);
    }
    
    setInput('');
  };

  const handleUIAction = async (action) => {
    if (action.type === 'tool') {
      // User clicked a button in the UI
      const response = await callMCPTool(
        action.payload.toolName,
        action.payload.params
      );
      // Handle response...
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {typeof msg.content === 'string' ? (
              <p>{msg.content}</p>
            ) : (
              <UIResourceRenderer
                resource={msg.content.resource}
                onUIAction={handleUIAction}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
```

### 3. MCP Client Connection

```typescript
// mcp-client.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

let client: Client;

export async function initMCPClient() {
  const transport = new StdioClientTransport({
    command: 'bun',
    args: ['run', './server/src/index.ts']
  });
  
  client = new Client({ name: 'chat-client', version: '1.0.0' }, {});
  await client.connect(transport);
  
  return client;
}

export async function callMCPTool(name: string, args: Record<string, unknown>) {
  return await client.callTool({ name, arguments: args });
}
```

## Complete Example

See the full implementation in:
- `server/` - MCP server with 7 tools
- `client/` - React client (coming soon)
- `playground/` - Simplified demo without MCP connection

## Running the Full Stack

```bash
# Terminal 1: Start MCP server
cd server
bun run dev

# Terminal 2: Start React client
cd client
bun run dev

# Open http://localhost:3000
```

## Production Considerations

### 1. Error Handling

```tsx
const handleUIAction = async (action) => {
  try {
    const response = await callMCPTool(action.payload.toolName, action.payload.params);
    // Handle success
  } catch (error) {
    // Show error UI
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Error: ${error.message}`
    }]);
  }
};
```

### 2. Loading States

```tsx
const [loading, setLoading] = useState(false);

const handleSend = async () => {
  setLoading(true);
  try {
    const response = await callMCPTool('hello_ui', { name: input });
    // ...
  } finally {
    setLoading(false);
  }
};
```

### 3. Streaming Responses

For long-running tools, implement streaming:

```tsx
// Server sends partial results
// Client updates UI incrementally
```

## Key Takeaways

1. **Separation of concerns** - Server creates UI, client renders it
2. **MCP protocol** - Standard communication between server and client
3. **UIResource detection** - Use `isUIResource()` to check response type
4. **Action loop** - User action → tool call → new UI response

## What's Next?

You've completed all the examples! Here's what to explore:

1. **Build your own tools** - Start with the server examples
2. **Customize the client** - Add your own styling and features
3. **Deploy to production** - Use Cloud Run, Vercel, etc.
4. **Join the community** - [MCP-UI Discord](https://discord.gg/CEAG4KW7ZH)

## Resources

- [MCP-UI Documentation](https://mcpui.dev)
- [MCP Protocol Spec](https://modelcontextprotocol.io)
- [GitHub Repository](https://github.com/idosal/mcp-ui)
