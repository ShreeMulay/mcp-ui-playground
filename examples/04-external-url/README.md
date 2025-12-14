# Example 04: External URLs (iframe Embedding)

## What You'll Learn

- Using `text/uri-list` mimeType
- Embedding external websites and dashboards
- Security considerations with iframes

## The Concept

Sometimes you want to embed existing web content rather than building HTML from scratch. MCP-UI supports this with the `text/uri-list` mimeType:

```typescript
{
  type: 'resource',
  resource: {
    uri: 'ui://dashboard/analytics',
    mimeType: 'text/uri-list',     // Key difference!
    text: 'https://example.com/dashboard'  // URL to embed
  }
}
```

## Server Code

```typescript
// server.ts
import { createUIResource } from '@mcp-ui/server';

export function dashboardTool(dashboardUrl: string) {
  return createUIResource({
    uri: `ui://dashboard/${encodeURIComponent(dashboardUrl)}`,
    content: {
      type: 'externalUrl',
      iframeUrl: dashboardUrl
    },
    encoding: 'text',
    metadata: {
      title: 'Analytics Dashboard',
      description: 'Embedded external dashboard'
    }
  });
}
```

## Alternative: HTML Wrapper with Controls

For a better UX, wrap the iframe in HTML with controls:

```typescript
export function dashboardWithControlsTool(url: string) {
  return createUIResource({
    uri: `ui://dashboard-enhanced/${encodeURIComponent(url)}`,
    content: {
      type: 'rawHtml',
      htmlString: `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <!-- Browser-like header -->
          <div style="padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px;">
            <div style="display: flex; gap: 4px;">
              <span style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%;"></span>
              <span style="width: 10px; height: 10px; background: #f59e0b; border-radius: 50%;"></span>
              <span style="width: 10px; height: 10px; background: #22c55e; border-radius: 50%;"></span>
            </div>
            <span style="flex: 1; padding: 4px 8px; background: white; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 12px; color: #64748b; font-family: monospace;">
              ${url}
            </span>
            <button onclick="window.open('${url}', '_blank')" style="padding: 4px 8px; font-size: 12px; cursor: pointer;">
              Open ↗
            </button>
          </div>
          
          <!-- Iframe -->
          <iframe 
            src="${url}" 
            style="width: 100%; height: 500px; border: none;"
            sandbox="allow-scripts allow-same-origin allow-forms"
          ></iframe>
        </div>
      `
    },
    encoding: 'text'
  });
}
```

## Client Rendering

The client SDK handles both mimeTypes:

```tsx
import { UIResourceRenderer } from '@mcp-ui/client';

// For text/uri-list, it automatically creates an iframe
// For text/html, it renders the HTML (which may contain an iframe)

<UIResourceRenderer
  resource={resource}
  onUIAction={handleAction}
/>
```

## Security: Sandbox Attributes

Always use sandbox on iframes:

```html
<iframe 
  src="https://external-site.com"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
></iframe>
```

| Attribute | Purpose |
|-----------|---------|
| `allow-scripts` | Allow JavaScript |
| `allow-same-origin` | Allow same-origin access |
| `allow-forms` | Allow form submissions |
| `allow-popups` | Allow opening new windows |

## Common Issues

### X-Frame-Options

Many sites block iframe embedding:

```
Refused to display 'https://example.com' in a frame because it set 'X-Frame-Options' to 'deny'.
```

**Solutions:**
1. Use sites that allow embedding (most dashboards do)
2. Show a fallback with a link to open in new tab
3. Proxy through your own server (advanced)

## Try It Yourself

1. Run the playground: `bun run dev:playground`
2. Select "dashboard" from the resource picker
3. Observe the iframe embedding
4. Note: example.com may block embedding - that's expected!

## Key Takeaways

1. **text/uri-list for URLs** - Different from text/html
2. **Sandbox iframes** - Always use security attributes
3. **Not all sites embed** - Handle X-Frame-Options gracefully
4. **Add controls** - Browser-like UI improves UX

## Next Steps

→ [Example 05: Remote DOM](../05-remote-dom/README.md)
