# Example 05: Remote DOM

## What You'll Learn

- Using `application/vnd.mcp-ui.remote-dom` mimeType
- Creating dynamic components with JavaScript
- Working with the Remote DOM framework

## The Concept

Remote DOM is the most powerful MCP-UI content type. Instead of sending static HTML, you send JavaScript that dynamically creates and manipulates the DOM:

```typescript
{
  type: 'resource',
  resource: {
    uri: 'ui://dynamic/component',
    mimeType: 'application/vnd.mcp-ui.remote-dom',
    text: `
      // JavaScript that runs in the client
      const button = document.createElement('button');
      button.textContent = 'Click me!';
      button.onclick = () => alert('Hello!');
      root.appendChild(button);
    `
  }
}
```

## Server Code

```typescript
// server.ts
import { createUIResource } from '@mcp-ui/server';

export function dynamicListTool(items: string[]) {
  const script = `
    // Create container
    const container = document.createElement('div');
    container.style.cssText = 'padding: 16px; font-family: system-ui;';
    
    // Create header
    const header = document.createElement('h2');
    header.textContent = 'Dynamic List';
    container.appendChild(header);
    
    // Create list
    const list = document.createElement('ul');
    list.style.cssText = 'list-style: none; padding: 0;';
    
    const items = ${JSON.stringify(items)};
    
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.cssText = 'padding: 8px; margin: 4px 0; background: #f0f0f0; border-radius: 4px; display: flex; justify-content: space-between;';
      
      const span = document.createElement('span');
      span.textContent = item;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.style.cssText = 'border: none; background: #ef4444; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;';
      deleteBtn.onclick = () => {
        li.remove();
        window.parent.postMessage({
          type: 'mcp-ui-action',
          action: 'tool',
          payload: { toolName: 'delete_item', params: { index } }
        }, '*');
      };
      
      li.appendChild(span);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
    
    container.appendChild(list);
    
    // Add new item input
    const addForm = document.createElement('div');
    addForm.style.cssText = 'display: flex; gap: 8px; margin-top: 12px;';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'New item...';
    input.style.cssText = 'flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;';
    
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.style.cssText = 'padding: 8px 16px; background: #22c55e; color: white; border: none; border-radius: 4px; cursor: pointer;';
    addBtn.onclick = () => {
      if (input.value.trim()) {
        const li = document.createElement('li');
        li.style.cssText = 'padding: 8px; margin: 4px 0; background: #f0f0f0; border-radius: 4px;';
        li.textContent = input.value;
        list.appendChild(li);
        
        window.parent.postMessage({
          type: 'mcp-ui-action',
          action: 'tool',
          payload: { toolName: 'add_item', params: { text: input.value } }
        }, '*');
        
        input.value = '';
      }
    };
    
    addForm.appendChild(input);
    addForm.appendChild(addBtn);
    container.appendChild(addForm);
    
    // Append to root (provided by MCP-UI client)
    root.appendChild(container);
  `;

  return createUIResource({
    uri: 'ui://list/dynamic',
    content: {
      type: 'remoteDom',
      script,
      framework: 'react' // or 'webcomponents'
    },
    encoding: 'text'
  });
}
```

## Client Setup

For Remote DOM, you need to configure the component library:

```tsx
import { 
  UIResourceRenderer,
  basicComponentLibrary,
  remoteButtonDefinition,
  remoteTextDefinition
} from '@mcp-ui/client';

function App({ resource }) {
  return (
    <UIResourceRenderer
      resource={resource}
      onUIAction={handleAction}
      remoteDomProps={{
        library: basicComponentLibrary,
        remoteElements: [
          remoteButtonDefinition,
          remoteTextDefinition
          // Add more custom elements as needed
        ]
      }}
    />
  );
}
```

## When to Use Remote DOM

| Use Case | Best Choice |
|----------|-------------|
| Static content | `text/html` |
| Interactive but known structure | `text/html` with postMessage |
| Dynamic/complex UI | `application/vnd.mcp-ui.remote-dom` |
| External dashboards | `text/uri-list` |

## Advantages of Remote DOM

1. **Dynamic content** - Build UI based on runtime data
2. **Full JavaScript** - Loops, conditionals, DOM APIs
3. **Event handling** - Attach event listeners easily
4. **Component reuse** - Create reusable UI patterns

## Security Considerations

Remote DOM scripts run in a sandboxed environment with:
- No access to parent window (except postMessage)
- No access to cookies/storage
- Limited API surface

## Try It Yourself

1. Run the playground: `bun run dev:playground`
2. Look at the todo example (it simulates Remote DOM patterns)
3. Observe how items can be added/removed dynamically

## Key Takeaways

1. **Script instead of HTML** - Send JavaScript, not markup
2. **`root` variable** - Append your DOM to this element
3. **JSON.stringify for data** - Embed data in the script
4. **postMessage still works** - Same action pattern

## Next Steps

→ [Example 06: Full Chat Integration](../06-full-chat/README.md)
