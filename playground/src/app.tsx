import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { mockUIResources, type MockResourceKey, type UIResource } from './mock-responses';

// Note: In a real app, you'd import from @mcp-ui/client
// For the playground, we render the UIResource HTML directly in an iframe

interface UIActionResult {
  type: 'tool' | 'prompt' | 'link';
  payload: {
    toolName?: string;
    params?: Record<string, unknown>;
    prompt?: string;
    url?: string;
  };
}

interface ActionLogEntry {
  id: number;
  timestamp: Date;
  action: UIActionResult;
}

// Simple UIResource renderer using iframe
function UIResourceRenderer({ 
  resource, 
  onAction 
}: { 
  resource: UIResource['resource'];
  onAction: (action: UIActionResult) => void;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'mcp-ui-action') {
        onAction({
          type: event.data.action || 'tool',
          payload: event.data.payload || {}
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAction]);

  // Handle different mimeTypes
  if (resource.mimeType === 'text/uri-list') {
    return (
      <div style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: 12, 
        overflow: 'hidden',
        background: '#f8fafc'
      }}>
        <div style={{ 
          padding: '12px 16px', 
          background: '#f1f5f9', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 14,
          color: '#64748b'
        }}>
          External URL: <code style={{ color: '#6366f1' }}>{resource.text}</code>
        </div>
        <iframe
          src={resource.text}
          style={{ 
            width: '100%', 
            height: 400, 
            border: 'none',
            display: 'block'
          }}
          sandbox="allow-scripts allow-same-origin allow-forms"
          title={resource._meta?.title || 'External content'}
        />
      </div>
    );
  }

  // text/html - render in sandboxed iframe
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
        </style>
      </head>
      <body>${resource.text || ''}</body>
    </html>
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={htmlContent}
      style={{ 
        width: '100%', 
        minHeight: 200,
        border: 'none',
        borderRadius: 12,
        background: 'white'
      }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      title={resource._meta?.title || 'UI Resource'}
      onLoad={() => {
        // Auto-resize iframe to content
        if (iframeRef.current?.contentWindow) {
          const height = iframeRef.current.contentWindow.document.body.scrollHeight;
          iframeRef.current.style.height = `${height + 20}px`;
        }
      }}
    />
  );
}

// Action Log component
function ActionLog({ actions }: { actions: ActionLogEntry[] }) {
  if (actions.length === 0) {
    return (
      <div style={{
        padding: 24,
        background: '#f8fafc',
        borderRadius: 12,
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <p style={{ margin: 0 }}>No actions yet. Interact with the UI above to see callbacks!</p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: 12,
      padding: 16,
      maxHeight: 300,
      overflowY: 'auto'
    }}>
      {actions.map((entry) => (
        <div 
          key={entry.id}
          style={{
            padding: '8px 12px',
            background: '#334155',
            borderRadius: 6,
            marginBottom: 8,
            fontFamily: 'monospace',
            fontSize: 13
          }}
        >
          <div style={{ color: '#94a3b8', marginBottom: 4 }}>
            {entry.timestamp.toLocaleTimeString()}
          </div>
          <div style={{ color: '#a5b4fc' }}>
            onUIAction({JSON.stringify(entry.action, null, 2)})
          </div>
        </div>
      ))}
    </div>
  );
}

// Main App
function App() {
  const [selectedResource, setSelectedResource] = useState<MockResourceKey>('hello');
  const [actions, setActions] = useState<ActionLogEntry[]>([]);
  const [actionCounter, setActionCounter] = useState(0);

  const handleAction = useCallback((action: UIActionResult) => {
    setActionCounter(prev => prev + 1);
    setActions(prev => [{
      id: actionCounter,
      timestamp: new Date(),
      action
    }, ...prev].slice(0, 20)); // Keep last 20 actions
  }, [actionCounter]);

  const currentResource = mockUIResources[selectedResource];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <header style={{
          textAlign: 'center',
          marginBottom: 32
        }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0'
          }}>
            MCP-UI Playground
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Interactive examples of UIResource components
          </p>
        </header>

        {/* Resource Selector */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          marginBottom: 24
        }}>
          {(Object.keys(mockUIResources) as MockResourceKey[]).map((key) => {
            const isSelected = selectedResource === key;
            return (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Selector clicked:', key);
                  setSelectedResource(key);
                }}
                style={{
                  padding: '8px 16px',
                  border: isSelected ? '2px solid #6366f1' : '2px solid #e2e8f0',
                  borderRadius: 8,
                  background: isSelected ? '#eef2ff' : 'white',
                  color: isSelected ? '#6366f1' : '#475569',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: 14,
                  textTransform: 'capitalize'
                }}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24
        }}>
          {/* UI Renderer Panel */}
          <div>
            <h2 style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 12
            }}>
              Rendered UI
            </h2>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)'
            }}>
              <UIResourceRenderer 
                resource={currentResource.resource}
                onAction={handleAction}
              />
            </div>
            
            {/* Metadata */}
            {currentResource.resource._meta && (
              <div style={{
                marginTop: 12,
                padding: '12px 16px',
                background: '#f1f5f9',
                borderRadius: 8,
                fontSize: 13
              }}>
                <strong style={{ color: '#475569' }}>
                  {currentResource.resource._meta.title}
                </strong>
                <span style={{ color: '#94a3b8', marginLeft: 8 }}>
                  {currentResource.resource._meta.description}
                </span>
              </div>
            )}
          </div>

          {/* Code & Actions Panel */}
          <div>
            <h2 style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 12
            }}>
              UIResource Object
            </h2>
            <div style={{
              background: '#1e293b',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              maxHeight: 250,
              overflowY: 'auto'
            }}>
              <pre style={{
                margin: 0,
                fontSize: 12,
                color: '#e2e8f0',
                fontFamily: '"SF Mono", "Fira Code", monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify({
                  type: currentResource.type,
                  resource: {
                    uri: currentResource.resource.uri,
                    mimeType: currentResource.resource.mimeType,
                    text: currentResource.resource.text?.substring(0, 100) + '...',
                    _meta: currentResource.resource._meta
                  }
                }, null, 2)}
              </pre>
            </div>

            <h2 style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 12
            }}>
              Action Log
              {actions.length > 0 && (
                <span style={{
                  marginLeft: 8,
                  background: '#6366f1',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 10,
                  fontSize: 11
                }}>
                  {actions.length}
                </span>
              )}
            </h2>
            <ActionLog actions={actions} />
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 48,
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 14
        }}>
          <p>
            Built with <code>@mcp-ui/client</code> and <code>@mcp-ui/server</code>
          </p>
          <p style={{ marginTop: 8 }}>
            <a href="https://github.com/idosal/mcp-ui" style={{ color: '#6366f1' }}>
              GitHub
            </a>
            {' | '}
            <a href="https://mcpui.dev" style={{ color: '#6366f1' }}>
              Documentation
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
  console.log('MCP-UI Playground: Mounting React app...');
  const root = createRoot(container);
  root.render(<App />);
  console.log('MCP-UI Playground: App mounted successfully!');
} else {
  console.error('MCP-UI Playground: Could not find root element!');
}

export default App;
