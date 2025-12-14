/**
 * Dynamic UIResource generators for the playground
 * These simulate what an MCP server would return based on current state
 */

export interface UIResource {
  type: 'resource';
  resource: {
    uri: string;
    mimeType: 'text/html' | 'text/uri-list' | 'application/vnd.mcp-ui.remote-dom';
    text?: string;
    blob?: string;
    _meta?: {
      title?: string;
      description?: string;
    };
  };
}

// ==========================================
// 1. Hello UI
// ==========================================
export function createHelloUI(name: string = 'World', theme: 'light' | 'dark' | 'gradient' = 'gradient'): UIResource {
  const themes = {
    light: { bg: '#ffffff', text: '#1e293b', border: '1px solid #e2e8f0' },
    dark: { bg: '#1e293b', text: '#ffffff', border: 'none' },
    gradient: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', border: 'none' }
  };
  const t = themes[theme];

  return {
    type: 'resource',
    resource: {
      uri: 'ui://hello/greeting',
      mimeType: 'text/html',
      text: `
        <div style="font-family: system-ui, sans-serif; padding: 32px; background: ${t.bg}; color: ${t.text}; border: ${t.border}; border-radius: 16px; text-align: center; transition: all 0.3s ease;">
          <h1 style="margin: 0 0 12px 0; font-size: 32px;">Hello, ${name}!</h1>
          <p style="margin: 0 0 24px 0; opacity: 0.9;">Welcome to the interactive MCP-UI Playground.</p>
          
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
            <input type="text" value="${name}" 
              placeholder="Enter name"
              onchange="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'hello_name', params: {name: this.value}}}, '*')"
              style="padding: 8px 12px; border-radius: 6px; border: 1px solid #ccc; width: 150px; color: #333;"
            />
          </div>

          <div style="display: flex; gap: 8px; justify-content: center;">
            <button onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'hello_theme', params: {theme: 'light'}}}, '*')" style="padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; background: white; color: #333;">Light</button>
            <button onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'hello_theme', params: {theme: 'dark'}}}, '*')" style="padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; background: #333; color: white;">Dark</button>
            <button onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'hello_theme', params: {theme: 'gradient'}}}, '*')" style="padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">Gradient</button>
          </div>
        </div>
      `,
      _meta: { title: 'Hello UI', description: 'Personalized greeting' }
    }
  };
}

// ==========================================
// 2. Counter UI
// ==========================================
export function createCounterUI(value: number): UIResource {
  return {
    type: 'resource',
    resource: {
      uri: 'ui://counter/interactive',
      mimeType: 'text/html',
      text: `
        <div style="font-family: system-ui, sans-serif; padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; text-align: center;">
          <h2 style="margin: 0 0 24px 0; color: #1e293b;">Interactive Counter</h2>
          <div style="display: flex; align-items: center; gap: 24px; justify-content: center;">
            <button 
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'decrement', params: {}}}, '*')"
              style="width: 64px; height: 64px; font-size: 32px; border: none; background: #ef4444; color: white; border-radius: 12px; cursor: pointer; transition: transform 0.1s; box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);"
              onmousedown="this.style.transform='scale(0.95)'"
              onmouseup="this.style.transform='scale(1)'"
            >-</button>
            
            <div style="font-size: 64px; font-weight: 800; min-width: 100px; color: #1e293b; font-variant-numeric: tabular-nums; transition: color 0.2s;">
              ${value}
            </div>
            
            <button 
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'increment', params: {}}}, '*')"
              style="width: 64px; height: 64px; font-size: 32px; border: none; background: #22c55e; color: white; border-radius: 12px; cursor: pointer; transition: transform 0.1s; box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3);"
              onmousedown="this.style.transform='scale(0.95)'"
              onmouseup="this.style.transform='scale(1)'"
            >+</button>
          </div>
          
          <div style="margin-top: 24px;">
            <button 
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'counter_reset', params: {}}}, '*')"
              style="padding: 8px 16px; background: #e2e8f0; color: #475569; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
            >Reset to Zero</button>
          </div>
        </div>
      `,
      _meta: { title: 'Counter', description: `Current value: ${value}` }
    }
  };
}

// ==========================================
// 3. Form UI
// ==========================================
export interface FormData {
  name: string;
  email: string;
  message: string;
}

export function createFormUI(formData: FormData | null, isSubmitted: boolean): UIResource {
  if (isSubmitted && formData) {
    return {
      type: 'resource',
      resource: {
        uri: 'ui://form/success',
        mimeType: 'text/html',
        text: `
          <div style="font-family: system-ui, sans-serif; padding: 32px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; text-align: center; animation: fadeIn 0.5s;">
            <style>@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }</style>
            <div style="width: 64px; height: 64px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style="margin: 0 0 8px 0; color: #166534;">Message Sent!</h2>
            <p style="color: #15803d; margin-bottom: 24px;">Thanks ${formData.name}, we've received your message.</p>
            
            <div style="background: white; padding: 16px; border-radius: 8px; text-align: left; margin-bottom: 24px; border: 1px solid #bbf7d0;">
              <div style="font-size: 12px; color: #86efac; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Sent Data</div>
              <pre style="margin: 8px 0 0 0; font-size: 13px; color: #166534;">${JSON.stringify(formData, null, 2)}</pre>
            </div>

            <button 
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'form_reset', params: {}}}, '*')"
              style="padding: 10px 20px; background: #166534; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;"
            >Submit Another response</button>
          </div>
        `,
        _meta: { title: 'Form Success', description: 'Submission successful' }
      }
    };
  }

  return {
    type: 'resource',
    resource: {
      uri: 'ui://form/contact',
      mimeType: 'text/html',
      text: `
        <div style="font-family: system-ui, sans-serif; padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 400px; margin: 0 auto;">
          <h2 style="margin: 0 0 8px 0; color: #1e293b;">Contact Us</h2>
          <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px;">We'd love to hear from you. Send us a message!</p>
          
          <form onsubmit="event.preventDefault(); window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'submitForm', params: {name: this.name.value, email: this.email.value, message: this.message.value}}}, '*');">
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">Name</label>
              <input 
                name="name" 
                type="text" 
                placeholder="Your name"
                style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; transition: border 0.2s;"
                onfocus="this.style.borderColor='#6366f1'; this.style.outline='none';"
                onblur="this.style.borderColor='#d1d5db'"
                required
              />
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="you@example.com"
                style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; transition: border 0.2s;"
                onfocus="this.style.borderColor='#6366f1'; this.style.outline='none';"
                onblur="this.style.borderColor='#d1d5db'"
                required
              />
            </div>
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 14px;">Message</label>
              <textarea 
                name="message" 
                placeholder="Your message..."
                rows="3"
                style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; resize: vertical; box-sizing: border-box; transition: border 0.2s;"
                onfocus="this.style.borderColor='#6366f1'; this.style.outline='none';"
                onblur="this.style.borderColor='#d1d5db'"
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              style="width: 100%; padding: 12px; background: #6366f1; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s;"
              onmouseover="this.style.background='#4f46e5'"
              onmouseout="this.style.background='#6366f1'"
            >Send Message</button>
          </form>
        </div>
      `,
      _meta: { title: 'Contact Form', description: 'Send us feedback' }
    }
  };
}

// ==========================================
// 4. Chart UI
// ==========================================
export interface ChartData {
  label: string;
  value: number;
}

export function createChartUI(data: ChartData[], selectedIndex: number | null): UIResource {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const barsHtml = data.map((d, i) => {
    const isSelected = i === selectedIndex;
    const heightPercent = (d.value / maxValue) * 100;
    const barColor = isSelected ? '#4f46e5' : '#818cf8';
    
    return `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; group: hover;">
        <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; justify-content: center;">
          
          <!-- Tooltip -->
          ${isSelected ? `
            <div style="position: absolute; bottom: ${heightPercent + 5}%; left: 50%; transform: translateX(-50%); background: #1e293b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; white-space: nowrap; pointer-events: none; z-index: 10; animation: fadeIn 0.2s;">
              $${d.value.toLocaleString()}
              <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid #1e293b;"></div>
            </div>
          ` : ''}

          <!-- Bar -->
          <div 
            onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'chart_click', params: {index: ${i}}}}, '*')"
            style="
              width: 70%; 
              height: ${heightPercent}%; 
              background: ${barColor}; 
              border-radius: 4px 4px 0 0; 
              cursor: pointer; 
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              opacity: ${selectedIndex !== null && !isSelected ? 0.6 : 1};
            "
            onmouseover="this.style.opacity='1'; this.style.transform='scaleY(1.05)';s"
            onmouseout="this.style.opacity='${selectedIndex !== null && !isSelected ? 0.6 : 1}'; this.style.transform='scaleY(1)';"
          ></div>
        </div>
        <div style="margin-top: 8px; font-size: 12px; color: ${isSelected ? '#1e293b' : '#64748b'}; font-weight: ${isSelected ? '600' : '400'};">
          ${d.label}
        </div>
      </div>
    `;
  }).join('');

  return {
    type: 'resource',
    resource: {
      uri: 'ui://chart/sales',
      mimeType: 'text/html',
      text: `
        <div style="font-family: system-ui, sans-serif; padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="margin: 0 0 24px 0; color: #1e293b;">Monthly Revenue</h2>
          
          <div style="height: 200px; display: flex; align-items: flex-end; gap: 8px; padding-top: 20px;">
            ${barsHtml}
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 14px; color: #64748b;">
              Total: <span style="color: #1e293b; font-weight: 600;">$${data.reduce((a, b) => a + b.value, 0).toLocaleString()}</span>
            </div>
            <button 
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'chart_reset', params: {}}}, '*')"
              style="font-size: 12px; color: #6366f1; background: none; border: none; cursor: pointer; text-decoration: underline;"
            >Reset Selection</button>
          </div>
        </div>
      `,
      _meta: { title: 'Sales Chart', description: 'Interactive bar chart' }
    }
  };
}

// ==========================================
// 5. Dashboard UI
// ==========================================
export function createDashboardUI(url: string = 'https://modelcontextprotocol.io'): UIResource {
  return {
    type: 'resource',
    resource: {
      uri: 'ui://dashboard/external',
      mimeType: 'text/uri-list',
      text: url,
      _meta: {
        title: 'External Dashboard',
        description: 'Embedded iframe content'
      }
    }
  };
}

// ==========================================
// 6. Todo UI
// ==========================================
export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export function createTodoUI(todos: TodoItem[]): UIResource {
  const completedCount = todos.filter(t => t.completed).length;
  
  const todoListHtml = todos.map(todo => `
    <li style="
      display: flex; align-items: center; gap: 12px; padding: 12px; 
      background: ${todo.completed ? '#f8fafc' : 'white'}; 
      border: 1px solid ${todo.completed ? '#e2e8f0' : '#cbd5e1'}; 
      border-radius: 8px; margin-bottom: 8px;
      transition: all 0.2s ease;
      opacity: ${todo.completed ? 0.7 : 1};
    ">
      <input type="checkbox" ${todo.completed ? 'checked' : ''} 
        style="width: 20px; height: 20px; cursor: pointer; accent-color: #22c55e;"
        onchange="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'toggleTodo', params: {id: ${todo.id}}}}, '*')"
      />
      
      <span style="flex: 1; text-decoration: ${todo.completed ? 'line-through' : 'none'}; color: ${todo.completed ? '#94a3b8' : '#334155'};">
        ${todo.text}
      </span>
      
      <button 
        onclick="this.parentElement.style.opacity=0; this.parentElement.style.transform='translateX(20px)'; setTimeout(() => window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'deleteTodo', params: {id: ${todo.id}}}}, '*'), 300)"
        style="width: 28px; height: 28px; border: none; background: transparent; color: #ef4444; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;"
        title="Delete"
      >
        ✕
      </button>
    </li>
  `).join('');

  return {
    type: 'resource',
    resource: {
      uri: 'ui://todo/list',
      mimeType: 'text/html',
      text: `
        <div style="font-family: system-ui, sans-serif; padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 400px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #1e293b; font-size: 20px;">Tasks</h2>
            <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
              ${completedCount}/${todos.length} Done
            </span>
          </div>
          
          <div style="display: flex; gap: 8px; margin-bottom: 20px;">
            <input 
              type="text" 
              id="newTodo"
              placeholder="Add a new task..."
              style="flex: 1; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
              onkeydown="if(event.key === 'Enter') document.getElementById('addBtn').click()"
            />
            <button 
              id="addBtn"
              onclick="const input = document.getElementById('newTodo'); if(input.value.trim()) { window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'addTodo', params: {text: input.value}}}, '*'); input.value = ''; }"
              style="padding: 10px 16px; background: #6366f1; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"
            >Add</button>
          </div>

          <ul style="list-style: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto;">
            ${todos.length > 0 ? todoListHtml : '<li style="text-align: center; color: #94a3b8; padding: 20px;">No items yet. Add one above!</li>'}
          </ul>
        </div>
      `,
      _meta: { title: 'Todo List', description: `${todos.length} items` }
    }
  };
}

// ==========================================
// 7. Weather UI
// ==========================================
export interface WeatherData {
  city: string;
  tempF: number;
  condition: string;
  humidity: number;
  wind: number;
}

export function createWeatherUI(data: WeatherData, unit: 'c' | 'f', isLoading: boolean = false): UIResource {
  const temp = unit === 'f' ? data.tempF : Math.round((data.tempF - 32) * 5/9);
  const loadingOverlay = isLoading ? `
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; border-radius: 16px; z-index: 10;">
      <div style="width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.5); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    </div>
  ` : '';

  const icon = data.condition.toLowerCase().includes('cloud') 
    ? `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`
    : `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

  return {
    type: 'resource',
    resource: {
      uri: 'ui://weather/current',
      mimeType: 'text/html',
      text: `
        <div style="font-family: system-ui, sans-serif; padding: 24px; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 16px; color: white; max-width: 320px; position: relative;">
          ${loadingOverlay}
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style="font-size: 14px; font-weight: 500;">${data.city}</span>
              </div>
              <div style="font-size: 64px; font-weight: 200; line-height: 1.1;">
                ${temp}°<span style="font-size: 24px; vertical-align: top;">${unit.toUpperCase()}</span>
              </div>
              <div style="font-size: 16px; opacity: 0.9;">${data.condition}</div>
            </div>
            <div style="opacity: 0.9;">
              ${icon}
            </div>
          </div>
          
          <div style="display: flex; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; margin-bottom: 20px;">
            <div style="flex: 1; text-align: center; border-right: 1px solid rgba(255,255,255,0.2);">
              <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">Humidity</div>
              <div style="font-weight: 600;">${data.humidity}%</div>
            </div>
            <div style="flex: 1; text-align: center;">
              <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">Wind</div>
              <div style="font-weight: 600;">${data.wind} mph</div>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button 
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'refreshWeather', params: {}}}, '*')"
              style="flex: 1; padding: 10px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; transition: background 0.2s;"
              onmouseover="this.style.background='rgba(255,255,255,0.3)'"
              onmouseout="this.style.background='rgba(255,255,255,0.2)'"
            >
              Refresh
            </button>
            <button 
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'toggleUnits', params: {}}}, '*')"
              style="width: 48px; padding: 10px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; transition: background 0.2s;"
              onmouseover="this.style.background='rgba(255,255,255,0.3)'"
              onmouseout="this.style.background='rgba(255,255,255,0.2)'"
            >
              °${unit === 'f' ? 'C' : 'F'}
            </button>
          </div>
        </div>
      `,
      _meta: { title: 'Weather', description: `Current: ${temp}°${unit.toUpperCase()}` }
    }
  };
}

export type MockResourceKey = 'hello' | 'counter' | 'form' | 'chart' | 'dashboard' | 'todo' | 'weather';
