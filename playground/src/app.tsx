import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createHelloUI, 
  createCounterUI, 
  createFormUI, 
  createChartUI, 
  createTodoUI, 
  createWeatherUI, 
  createDashboardUI,
  type MockResourceKey, 
  type UIResource 
} from './mock-responses';

// --- Types ---

interface UIActionResult {
  type: 'tool' | 'prompt' | 'link';
  payload: {
    toolName?: string;
    params?: Record<string, any>;
    prompt?: string;
    url?: string;
  };
}

interface ActionLogEntry {
  id: number;
  timestamp: Date;
  action: UIActionResult;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

// --- Components ---

// 1. Toast Notification Component
function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{
          background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: 14,
          fontWeight: 500,
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 200
        }}>
          {toast.type === 'success' && '✓'}
          {toast.type === 'info' && 'ℹ'}
          {toast.type === 'error' && '✕'}
          {toast.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// 2. State Inspector Component
function StateInspector({ state }: { state: any }) {
  return (
    <div style={{
      background: '#0f172a',
      borderRadius: 12,
      padding: 16,
      border: '1px solid #334155',
      marginTop: 24
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12,
        borderBottom: '1px solid #334155',
        paddingBottom: 8
      }}>
        <h3 style={{ margin: 0, fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Live Application State
        </h3>
        <span style={{ fontSize: 10, color: '#64748b' }}>Read-only</span>
      </div>
      <pre style={{
        margin: 0,
        fontSize: 12,
        color: '#a5b4fc',
        fontFamily: '"SF Mono", "Fira Code", monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        maxHeight: 200,
        overflowY: 'auto'
      }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

// 3. UI Renderer
function UIResourceRenderer({ resource, onAction }: { resource: UIResource['resource']; onAction: (action: UIActionResult) => void; }) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    // Update iframe content when resource.text changes
    if (iframeRef.current && resource.mimeType === 'text/html' && resource.text) {
      // We need to re-inject the HTML to update the view
      // Just setting srcDoc updates it, but we want to preserve scroll if possible?
      // Actually for this demo, full re-render ensures state consistency.
    }
  });

  if (resource.mimeType === 'text/uri-list') {
    return (
      <iframe
        src={resource.text}
        style={{ width: '100%', height: 500, border: 'none', borderRadius: 12, background: '#f8fafc' }}
        title="External Content"
      />
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: transparent; }
          /* Hide scrollbar for cleaner look */
          ::-webkit-scrollbar { width: 0px; background: transparent; }
        </style>
      </head>
      <body>${resource.text || ''}</body>
    </html>
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={htmlContent}
      style={{ width: '100%', minHeight: 300, border: 'none', borderRadius: 12, background: 'transparent' }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      title="UI Resource"
      onLoad={(e) => {
        // Auto-resize
        const iframe = e.target as HTMLIFrameElement;
        if (iframe.contentWindow) {
          const height = iframe.contentWindow.document.body.scrollHeight;
          iframe.style.height = `${Math.max(300, height + 20)}px`;
        }
      }}
    />
  );
}

// 4. Action Log
function ActionLog({ actions }: { actions: ActionLogEntry[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [actions]);

  return (
    <div 
      ref={scrollRef}
      style={{
        background: '#1e293b',
        borderRadius: 12,
        padding: 16,
        height: 200,
        overflowY: 'auto',
        border: '1px solid #334155'
      }}
    >
      {actions.length === 0 ? (
        <div style={{ color: '#64748b', textAlign: 'center', marginTop: 60, fontSize: 13 }}>
          Waiting for interactions...
        </div>
      ) : (
        actions.map((entry) => (
          <div key={entry.id} style={{
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.05)',
            borderLeft: '3px solid #6366f1',
            borderRadius: 4,
            marginBottom: 8,
            fontFamily: 'monospace',
            fontSize: 12,
            animation: 'fadeIn 0.2s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#94a3b8' }}>{entry.timestamp.toLocaleTimeString()}</span>
              <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{entry.action.payload.toolName}</span>
            </div>
            <div style={{ color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {JSON.stringify(entry.action.payload.params)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// --- Main Application ---

function App() {
  const [selectedResource, setSelectedResource] = useState<MockResourceKey>('hello');
  const [actions, setActions] = useState<ActionLogEntry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // --- Application State ---
  const [helloState, setHelloState] = useState({ name: 'User', theme: 'gradient' as 'gradient' | 'light' | 'dark' });
  const [counterValue, setCounterValue] = useState(0);
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn MCP-UI', completed: true },
    { id: 2, text: 'Build a cool tool', completed: false }
  ]);
  const [formState, setFormState] = useState({ submitted: false, data: null as any });
  const [chartData, setChartData] = useState([
    { label: 'Jan', value: 4000 }, { label: 'Feb', value: 3000 }, 
    { label: 'Mar', value: 5500 }, { label: 'Apr', value: 4500 }, 
    { label: 'May', value: 6000 }, { label: 'Jun', value: 7000 }
  ]);
  const [chartSelected, setChartSelected] = useState<number | null>(null);
  const [weatherState, setWeatherState] = useState({ 
    unit: 'f' as 'f'|'c', 
    loading: false,
    data: { city: 'San Francisco', tempF: 72, condition: 'Partly Cloudy', humidity: 45, wind: 12 } 
  });

  // --- Helper: Add Toast ---
  const addToast = useCallback((message: string, type: 'success'|'info'|'error' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // --- Main Action Handler (The Brain) ---
  const handleAction = useCallback((action: UIActionResult) => {
    const { toolName, params } = action.payload;
    console.log('⚡ Action received:', toolName, params);

    // Logging
    setActions(prev => [{ id: Date.now(), timestamp: new Date(), action }, ...prev].slice(0, 50));

    // Logic Switch
    switch (toolName) {
      // Hello
      case 'hello_name':
        setHelloState(prev => ({ ...prev, name: params?.name }));
        break;
      case 'hello_theme':
        setHelloState(prev => ({ ...prev, theme: params?.theme }));
        addToast(`Theme changed to ${params?.theme}`);
        break;

      // Counter
      case 'increment':
        setCounterValue(prev => {
          const newVal = prev + 1;
          // addToast(`Counter: ${newVal}`, 'success'); // Optional: too noisy?
          return newVal;
        });
        break;
      case 'decrement':
        setCounterValue(prev => prev - 1);
        break;
      case 'counter_reset':
        setCounterValue(0);
        addToast('Counter reset', 'info');
        break;

      // Todo
      case 'addTodo':
        setTodos(prev => [...prev, { id: Date.now(), text: params?.text, completed: false }]);
        addToast('Task added!', 'success');
        break;
      case 'toggleTodo':
        setTodos(prev => prev.map(t => t.id === params?.id ? { ...t, completed: !t.completed } : t));
        break;
      case 'deleteTodo':
        setTodos(prev => prev.filter(t => t.id !== params?.id));
        addToast('Task deleted', 'info');
        break;

      // Form
      case 'submitForm':
        setFormState({ submitted: true, data: params });
        addToast('Form submitted successfully!', 'success');
        break;
      case 'form_reset':
        setFormState({ submitted: false, data: null });
        break;

      // Chart
      case 'chart_click':
        setChartSelected(params?.index);
        addToast(`Selected: ${chartData[params?.index].label}`, 'info');
        break;
      case 'chart_reset':
        setChartSelected(null);
        break;

      // Weather
      case 'toggleUnits':
        setWeatherState(prev => ({ ...prev, unit: prev.unit === 'f' ? 'c' : 'f' }));
        break;
      case 'refreshWeather':
        setWeatherState(prev => ({ ...prev, loading: true }));
        // Simulate API call
        setTimeout(() => {
          setWeatherState(prev => ({ 
            ...prev, 
            loading: false,
            data: { 
              ...prev.data, 
              tempF: 65 + Math.floor(Math.random() * 20), // Random temp
              humidity: 30 + Math.floor(Math.random() * 50) 
            }
          }));
          addToast('Weather updated', 'success');
        }, 800);
        break;
        
      default:
        console.warn('Unknown tool:', toolName);
    }
  }, [chartData, addToast]);

  // --- Resource Generation (Reactive) ---
  const currentResource = useMemo(() => {
    switch (selectedResource) {
      case 'hello': return createHelloUI(helloState.name, helloState.theme);
      case 'counter': return createCounterUI(counterValue);
      case 'form': return createFormUI(formState.data, formState.submitted);
      case 'chart': return createChartUI(chartData, chartSelected);
      case 'todo': return createTodoUI(todos);
      case 'weather': return createWeatherUI(weatherState.data, weatherState.unit, weatherState.loading);
      case 'dashboard': return createDashboardUI();
      default: return createHelloUI();
    }
  }, [selectedResource, helloState, counterValue, todos, formState, chartData, chartSelected, weatherState]);

  // --- Render ---
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#f8fafc',
      padding: '32px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <ToastContainer toasts={toasts} />
      
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 12, 
            background: 'rgba(255,255,255,0.05)', 
            padding: '8px 16px', 
            borderRadius: 32,
            marginBottom: 16
          }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <span style={{ fontWeight: 600, color: '#818cf8' }}>MCP-UI</span>
          </div>
          <h1 style={{ fontSize: 42, margin: 0, fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Interactive Playground
          </h1>
          <p style={{ color: '#64748b', marginTop: 12, fontSize: 16 }}>
            Experience rich, dynamic UI components generated for AI agents.
          </p>
        </header>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 8, 
          flexWrap: 'wrap', 
          marginBottom: 40,
          background: 'rgba(255,255,255,0.03)',
          padding: 8,
          borderRadius: 16,
          backdropFilter: 'blur(8px)'
        }}>
          {(['hello', 'counter', 'todo', 'form', 'chart', 'weather', 'dashboard'] as MockResourceKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSelectedResource(key)}
              style={{
                padding: '8px 20px',
                borderRadius: 10,
                border: 'none',
                background: selectedResource === key ? '#6366f1' : 'transparent',
                color: selectedResource === key ? 'white' : '#94a3b8',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                fontSize: 14
              }}
            >
              {key}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 350px', gap: 32, alignItems: 'start' }}>
          
          {/* Left Column: UI Renderer */}
          <div>
            <div style={{ 
              background: '#1e293b', 
              borderRadius: 24, 
              padding: 8,
              border: '1px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ 
                background: 'white', // Creating a "browser window" look inside
                borderRadius: 16,
                overflow: 'hidden',
                minHeight: 400,
                position: 'relative'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f1f5f9', 
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex', 
                  gap: 6
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                  <div style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    background: 'white', 
                    borderRadius: 4, 
                    height: 20, 
                    fontSize: 10, 
                    display: 'flex', 
                    alignItems: 'center', 
                    paddingLeft: 8, 
                    color: '#94a3b8' 
                  }}>
                    {currentResource.resource.uri}
                  </div>
                </div>
                <UIResourceRenderer 
                  resource={currentResource.resource} 
                  onAction={handleAction} 
                />
              </div>
            </div>

            <div style={{ marginTop: 24, padding: '0 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>State Inspector</h3>
                <span style={{ fontSize: 12, color: '#6366f1' }}>Live Updates</span>
              </div>
              <StateInspector state={{ 
                currentView: selectedResource, 
                // Only show relevant state slice
                [selectedResource]: selectedResource === 'counter' ? { counterValue } : 
                                  selectedResource === 'todo' ? { todos: todos.length } :
                                  selectedResource === 'weather' ? weatherState :
                                  selectedResource === 'hello' ? helloState :
                                  '...'
              }} />
            </div>
          </div>

          {/* Right Column: Logs & Protocol */}
          <div style={{ paddingTop: 8 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Protocol Traffic
            </h3>
            
            <ActionLog actions={actions} />

            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Resource Payload
              </h3>
              <div style={{
                background: '#1e293b',
                borderRadius: 12,
                padding: 16,
                border: '1px solid #334155',
                maxHeight: 300,
                overflowY: 'auto'
              }}>
                <pre style={{
                  margin: 0,
                  fontSize: 11,
                  color: '#e2e8f0',
                  fontFamily: '"SF Mono", "Fira Code", monospace',
                  lineHeight: 1.5
                }}>
                  {JSON.stringify(currentResource, null, 2)}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Ensure proper mounting
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
