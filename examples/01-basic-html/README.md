# Example 01: Basic HTML Rendering

## What You'll Learn

- How to create a simple UIResource with `text/html`
- The structure of a UIResource object
- How the client renders HTML content

## The Concept

MCP-UI allows your MCP tools to return rich HTML content instead of just plain text. The simplest form is a `text/html` UIResource:

```typescript
{
  type: 'resource',
  resource: {
    uri: 'ui://hello/greeting',     // Unique identifier
    mimeType: 'text/html',          // Tell client it's HTML
    text: '<h1>Hello World!</h1>'   // The actual HTML
  }
}
```

## Server Code

```typescript
// server.ts
import { createUIResource } from '@mcp-ui/server';

export function helloTool() {
  return createUIResource({
    uri: 'ui://hello/greeting',
    content: {
      type: 'rawHtml',
      htmlString: `
        <div style="padding: 20px; background: #f0f4f8; border-radius: 8px;">
          <h1 style="color: #1a365d; margin: 0;">Hello from MCP-UI!</h1>
          <p style="color: #4a5568; margin-top: 8px;">
            This HTML was returned by an MCP tool.
          </p>
        </div>
      `
    },
    encoding: 'text'
  });
}
```

## Client Code

```tsx
// client.tsx
import { UIResourceRenderer } from '@mcp-ui/client';

function App({ mcpResponse }) {
  return (
    <UIResourceRenderer
      resource={mcpResponse.resource}
      onUIAction={(action) => console.log('Action:', action)}
    />
  );
}
```

## Try It Yourself

1. Run the playground: `bun run dev:playground`
2. Select "hello" from the resource picker
3. Observe the rendered HTML and the UIResource structure

## Key Takeaways

1. **UIResource is a wrapper** - It contains the HTML in the `text` field
2. **mimeType matters** - `text/html` tells the client how to render
3. **Sandboxed rendering** - Client renders HTML in a secure iframe
4. **Inline styles work** - Use inline CSS for styling (no external stylesheets)

## Next Steps

→ [Example 02: Buttons & Actions](../02-buttons-actions/README.md)
