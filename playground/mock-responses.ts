/**
 * Mock UIResource responses for the playground
 * These simulate what an MCP server would return
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

// Example 1: Basic HTML Greeting
export const helloUIResource: UIResource = {
  type: 'resource',
  resource: {
    uri: 'ui://hello/greeting',
    mimeType: 'text/html',
    text: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; text-align: center;">
        <h1 style="margin: 0 0 8px 0; font-size: 28px;">Hello from MCP-UI!</h1>
        <p style="margin: 0; opacity: 0.9;">This is an interactive UI rendered from an MCP tool response.</p>
        <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.2); border-radius: 8px;">
          <code style="font-size: 14px;">mimeType: text/html</code>
        </div>
      </div>
    `,
    _meta: {
      title: 'Hello UI',
      description: 'A simple greeting component'
    }
  }
};

// Example 2: Interactive Counter with Buttons
export const counterUIResource: UIResource = {
  type: 'resource',
  resource: {
    uri: 'ui://counter/interactive',
    mimeType: 'text/html',
    text: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="margin: 0 0 16px 0; color: #1e293b;">Interactive Counter</h2>
        <div style="display: flex; align-items: center; gap: 16px; justify-content: center;">
          <button 
            onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'decrement', params: {}}}, '*')"
            style="width: 48px; height: 48px; font-size: 24px; border: none; background: #ef4444; color: white; border-radius: 8px; cursor: pointer; transition: transform 0.1s;"
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          >-</button>
          <span style="font-size: 48px; font-weight: bold; min-width: 80px; text-align: center; color: #1e293b;" id="counter">0</span>
          <button 
            onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'increment', params: {}}}, '*')"
            style="width: 48px; height: 48px; font-size: 24px; border: none; background: #22c55e; color: white; border-radius: 8px; cursor: pointer; transition: transform 0.1s;"
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          >+</button>
        </div>
        <p style="margin: 16px 0 0 0; text-align: center; color: #64748b; font-size: 14px;">
          Click the buttons to trigger <code>onUIAction</code> callbacks
        </p>
      </div>
    `,
    _meta: {
      title: 'Counter',
      description: 'Interactive counter with button actions'
    }
  }
};

// Example 3: Contact Form
export const formUIResource: UIResource = {
  type: 'resource',
  resource: {
    uri: 'ui://form/contact',
    mimeType: 'text/html',
    text: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 400px;">
        <h2 style="margin: 0 0 16px 0; color: #1e293b;">Contact Form</h2>
        <form onsubmit="event.preventDefault(); window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'submitForm', params: {name: this.name.value, email: this.email.value, message: this.message.value}}}, '*');">
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151;">Name</label>
            <input 
              name="name" 
              type="text" 
              placeholder="Your name"
              style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
              required
            />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151;">Email</label>
            <input 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
              required
            />
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151;">Message</label>
            <textarea 
              name="message" 
              placeholder="Your message..."
              rows="3"
              style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical; box-sizing: border-box;"
              required
            ></textarea>
          </div>
          <button 
            type="submit"
            style="width: 100%; padding: 12px; background: #6366f1; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s;"
            onmouseover="this.style.background='#4f46e5'"
            onmouseout="this.style.background='#6366f1'"
          >Submit</button>
        </form>
      </div>
    `,
    _meta: {
      title: 'Contact Form',
      description: 'Form with input fields and submit action'
    }
  }
};

// Example 4: Chart Visualization (using inline SVG for simplicity)
export const chartUIResource: UIResource = {
  type: 'resource',
  resource: {
    uri: 'ui://chart/bar',
    mimeType: 'text/html',
    text: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="margin: 0 0 16px 0; color: #1e293b;">Sales Data</h2>
        <div style="display: flex; align-items: flex-end; gap: 12px; height: 200px; padding: 16px 0;">
          <div style="flex: 1; text-align: center;">
            <div style="background: linear-gradient(to top, #6366f1, #8b5cf6); height: 120px; border-radius: 4px 4px 0 0; transition: height 0.3s;"></div>
            <span style="display: block; margin-top: 8px; font-size: 12px; color: #64748b;">Jan</span>
            <span style="font-weight: 600; color: #1e293b;">$12k</span>
          </div>
          <div style="flex: 1; text-align: center;">
            <div style="background: linear-gradient(to top, #6366f1, #8b5cf6); height: 160px; border-radius: 4px 4px 0 0; transition: height 0.3s;"></div>
            <span style="display: block; margin-top: 8px; font-size: 12px; color: #64748b;">Feb</span>
            <span style="font-weight: 600; color: #1e293b;">$16k</span>
          </div>
          <div style="flex: 1; text-align: center;">
            <div style="background: linear-gradient(to top, #6366f1, #8b5cf6); height: 100px; border-radius: 4px 4px 0 0; transition: height 0.3s;"></div>
            <span style="display: block; margin-top: 8px; font-size: 12px; color: #64748b;">Mar</span>
            <span style="font-weight: 600; color: #1e293b;">$10k</span>
          </div>
          <div style="flex: 1; text-align: center;">
            <div style="background: linear-gradient(to top, #6366f1, #8b5cf6); height: 180px; border-radius: 4px 4px 0 0; transition: height 0.3s;"></div>
            <span style="display: block; margin-top: 8px; font-size: 12px; color: #64748b;">Apr</span>
            <span style="font-weight: 600; color: #1e293b;">$18k</span>
          </div>
          <div style="flex: 1; text-align: center;">
            <div style="background: linear-gradient(to top, #22c55e, #16a34a); height: 200px; border-radius: 4px 4px 0 0; transition: height 0.3s;"></div>
            <span style="display: block; margin-top: 8px; font-size: 12px; color: #64748b;">May</span>
            <span style="font-weight: 600; color: #22c55e;">$20k</span>
          </div>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 8px;">
          <span style="font-size: 14px; color: #64748b;">Total: </span>
          <span style="font-weight: 600; color: #1e293b;">$76,000</span>
          <span style="margin-left: 8px; color: #22c55e; font-size: 14px;">+15% from last period</span>
        </div>
      </div>
    `,
    _meta: {
      title: 'Bar Chart',
      description: 'Sales data visualization'
    }
  }
};

// Example 5: External URL (iframe embed)
export const dashboardUIResource: UIResource = {
  type: 'resource',
  resource: {
    uri: 'ui://dashboard/external',
    mimeType: 'text/uri-list',
    text: 'https://example.com',
    _meta: {
      title: 'External Dashboard',
      description: 'Embedded external content via iframe'
    }
  }
};

// Example 6: Todo List (simulating Remote DOM)
export const todoUIResource: UIResource = {
  type: 'resource',
  resource: {
    uri: 'ui://todo/list',
    mimeType: 'text/html',
    text: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 400px;">
        <h2 style="margin: 0 0 16px 0; color: #1e293b; display: flex; align-items: center; gap: 8px;">
          <span>Todo List</span>
          <span style="background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 12px; font-size: 12px;">3 items</span>
        </h2>
        <ul style="list-style: none; padding: 0; margin: 0 0 16px 0;">
          <li style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px;">
            <input type="checkbox" checked style="width: 18px; height: 18px; cursor: pointer;" onchange="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'toggleTodo', params: {id: 1}}}, '*')"/>
            <span style="flex: 1; text-decoration: line-through; color: #94a3b8;">Learn MCP-UI basics</span>
          </li>
          <li style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px;">
            <input type="checkbox" style="width: 18px; height: 18px; cursor: pointer;" onchange="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'toggleTodo', params: {id: 2}}}, '*')"/>
            <span style="flex: 1; color: #1e293b;">Build interactive server tools</span>
          </li>
          <li style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px;">
            <input type="checkbox" style="width: 18px; height: 18px; cursor: pointer;" onchange="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'toggleTodo', params: {id: 3}}}, '*')"/>
            <span style="flex: 1; color: #1e293b;">Create React client app</span>
          </li>
        </ul>
        <div style="display: flex; gap: 8px;">
          <input 
            type="text" 
            id="newTodo"
            placeholder="Add a new task..."
            style="flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;"
          />
          <button 
            onclick="const input = document.getElementById('newTodo'); window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'addTodo', params: {text: input.value}}}, '*'); input.value = '';"
            style="padding: 10px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;"
          >Add</button>
        </div>
      </div>
    `,
    _meta: {
      title: 'Todo List',
      description: 'Interactive todo list with add/toggle actions'
    }
  }
};

// Example 7: Weather Widget
export const weatherUIResource: UIResource = {
  type: 'resource',
  resource: {
    uri: 'ui://weather/current',
    mimeType: 'text/html',
    text: `
      <div style="font-family: system-ui, sans-serif; padding: 24px; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 12px; color: white; max-width: 300px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="margin: 0; font-size: 14px; opacity: 0.9;">San Francisco, CA</h3>
            <p style="margin: 4px 0 0 0; font-size: 48px; font-weight: 300;">72°F</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Partly Cloudy</p>
          </div>
          <div style="font-size: 64px; opacity: 0.9;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          </div>
        </div>
        <div style="display: flex; gap: 16px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2);">
          <div style="text-align: center; flex: 1;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">Humidity</p>
            <p style="margin: 4px 0 0 0; font-weight: 600;">65%</p>
          </div>
          <div style="text-align: center; flex: 1;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">Wind</p>
            <p style="margin: 4px 0 0 0; font-weight: 600;">12 mph</p>
          </div>
          <div style="text-align: center; flex: 1;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">UV Index</p>
            <p style="margin: 4px 0 0 0; font-weight: 600;">6</p>
          </div>
        </div>
        <button 
          onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'refreshWeather', params: {}}}, '*')"
          style="width: 100%; margin-top: 16px; padding: 10px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; transition: background 0.2s;"
          onmouseover="this.style.background='rgba(255,255,255,0.3)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'"
        >Refresh</button>
      </div>
    `,
    _meta: {
      title: 'Weather Widget',
      description: 'Current weather display with refresh action'
    }
  }
};

// Collection of all mock responses
export const mockUIResources = {
  hello: helloUIResource,
  counter: counterUIResource,
  form: formUIResource,
  chart: chartUIResource,
  dashboard: dashboardUIResource,
  todo: todoUIResource,
  weather: weatherUIResource,
};

export type MockResourceKey = keyof typeof mockUIResources;
