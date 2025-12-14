# Example 02: Buttons & Actions

## What You'll Learn

- How to create interactive buttons
- Using `postMessage` to communicate with the parent
- Handling `onUIAction` callbacks in the client

## The Concept

Interactive UI needs a way to communicate user actions back to the client. MCP-UI uses the standard `postMessage` API:

```javascript
// In your HTML button
window.parent.postMessage({
  type: 'mcp-ui-action',
  action: 'tool',          // Action type: 'tool', 'prompt', or 'link'
  payload: {
    toolName: 'my_action',
    params: { key: 'value' }
  }
}, '*');
```

## Server Code

```typescript
// server.ts
import { createUIResource } from '@mcp-ui/server';

export function counterTool(initialValue = 0) {
  return createUIResource({
    uri: 'ui://counter/main',
    content: {
      type: 'rawHtml',
      htmlString: `
        <div style="text-align: center; padding: 24px;">
          <span id="count" style="font-size: 48px; font-weight: bold;">
            ${initialValue}
          </span>
          <div style="margin-top: 16px;">
            <button onclick="
              const el = document.getElementById('count');
              el.textContent = parseInt(el.textContent) - 1;
              window.parent.postMessage({
                type: 'mcp-ui-action',
                action: 'tool',
                payload: { toolName: 'decrement', params: {} }
              }, '*');
            " style="padding: 12px 24px; font-size: 24px; margin-right: 8px;">
              -
            </button>
            <button onclick="
              const el = document.getElementById('count');
              el.textContent = parseInt(el.textContent) + 1;
              window.parent.postMessage({
                type: 'mcp-ui-action',
                action: 'tool',
                payload: { toolName: 'increment', params: {} }
              }, '*');
            " style="padding: 12px 24px; font-size: 24px;">
              +
            </button>
          </div>
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
import { UIResourceRenderer, UIActionResult } from '@mcp-ui/client';

function App({ mcpResponse }) {
  const handleAction = (result: UIActionResult) => {
    switch (result.type) {
      case 'tool':
        console.log('Tool called:', result.payload.toolName);
        console.log('With params:', result.payload.params);
        // Call the MCP tool here
        break;
      case 'prompt':
        console.log('User prompt:', result.payload.prompt);
        break;
      case 'link':
        window.open(result.payload.url, '_blank');
        break;
    }
  };

  return (
    <UIResourceRenderer
      resource={mcpResponse.resource}
      onUIAction={handleAction}
    />
  );
}
```

## Action Types

| Type | Purpose | Payload |
|------|---------|---------|
| `tool` | Call an MCP tool | `{ toolName, params }` |
| `prompt` | Send a text prompt | `{ prompt }` |
| `link` | Open a URL | `{ url }` |

## Try It Yourself

1. Run the playground: `bun run dev:playground`
2. Select "counter" from the resource picker
3. Click the +/- buttons
4. Watch the Action Log panel to see callbacks

## Key Takeaways

1. **postMessage for communication** - Secure cross-origin messaging
2. **Three action types** - tool, prompt, link
3. **Client handles actions** - Decide what to do with each action
4. **Local state is OK** - You can update the UI locally before sending action

## Next Steps

→ [Example 03: Forms & Input](../03-forms-input/README.md)
