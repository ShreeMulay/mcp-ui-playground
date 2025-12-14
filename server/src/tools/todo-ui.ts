/**
 * Todo UI Tool
 * 
 * An interactive todo list that demonstrates state management in UI.
 * Shows how to handle multiple action types (add, toggle, delete).
 */

import { z } from 'zod';
import { createHtmlResource, wrapWithStyles } from '../lib/ui-helpers';

// Todo item schema
const todoItemSchema = z.object({
  id: z.string().describe('Unique identifier'),
  text: z.string().describe('Todo text'),
  completed: z.boolean().describe('Completion status'),
  priority: z.enum(['low', 'medium', 'high']).optional().describe('Priority level'),
});

// Tool definition
export const todoUITool = {
  name: 'todo_ui',
  description: 'Display an interactive todo list with add, toggle, and delete actions',
  inputSchema: z.object({
    title: z.string().optional().describe('List title'),
    items: z.array(todoItemSchema).optional().describe('Initial todo items'),
    showPriority: z.boolean().optional().describe('Show priority badges'),
    allowAdd: z.boolean().optional().describe('Allow adding new items'),
  }),
};

export type TodoUIInput = z.infer<typeof todoUITool.inputSchema>;

// Default sample todos
const defaultTodos = [
  { id: '1', text: 'Learn MCP-UI basics', completed: true, priority: 'high' as const },
  { id: '2', text: 'Build interactive server tools', completed: false, priority: 'high' as const },
  { id: '3', text: 'Create React client app', completed: false, priority: 'medium' as const },
  { id: '4', text: 'Write documentation', completed: false, priority: 'low' as const },
];

// Tool handler
export function handleTodoUI(input: TodoUIInput) {
  const title = input.title || 'Todo List';
  const items = input.items || defaultTodos;
  const showPriority = input.showPriority !== false;
  const allowAdd = input.allowAdd !== false;

  const completedCount = items.filter(t => t.completed).length;
  const totalCount = items.length;

  const priorityColors = {
    low: { bg: '#dbeafe', text: '#1d4ed8' },
    medium: { bg: '#fef3c7', text: '#d97706' },
    high: { bg: '#fee2e2', text: '#dc2626' },
  };

  const html = wrapWithStyles(`
    <div class="card" style="max-width: 420px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #1e293b; font-size: 20px; display: flex; align-items: center; gap: 8px;">
          ${title}
          <span style="
            background: #dbeafe;
            color: #1d4ed8;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          ">${completedCount}/${totalCount}</span>
        </h2>
        <button 
          class="btn btn-secondary"
          style="padding: 6px 12px; font-size: 12px;"
          onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'todo_clear_completed', params: {}}}, '*')"
        >Clear done</button>
      </div>
      
      <!-- Progress bar -->
      <div style="
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        margin-bottom: 20px;
        overflow: hidden;
      ">
        <div style="
          height: 100%;
          width: ${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 3px;
          transition: width 0.3s;
        "></div>
      </div>
      
      <!-- Todo items -->
      <ul style="list-style: none; margin: 0 0 20px 0; padding: 0;">
        ${items.map((todo, index) => `
          <li style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            background: ${todo.completed ? '#f8fafc' : 'white'};
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 8px;
            transition: all 0.2s;
          ">
            <input 
              type="checkbox" 
              ${todo.completed ? 'checked' : ''}
              style="
                width: 20px;
                height: 20px;
                cursor: pointer;
                accent-color: #22c55e;
              "
              onchange="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'todo_toggle', params: {id: '${todo.id}', completed: !${todo.completed}}}}, '*')"
            />
            <span style="
              flex: 1;
              color: ${todo.completed ? '#94a3b8' : '#1e293b'};
              text-decoration: ${todo.completed ? 'line-through' : 'none'};
              font-size: 15px;
            ">${todo.text}</span>
            ${showPriority && todo.priority ? `
              <span style="
                padding: 2px 8px;
                background: ${priorityColors[todo.priority].bg};
                color: ${priorityColors[todo.priority].text};
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
              ">${todo.priority}</span>
            ` : ''}
            <button 
              style="
                width: 28px;
                height: 28px;
                border: none;
                background: transparent;
                color: #94a3b8;
                cursor: pointer;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
              "
              onmouseover="this.style.background='#fee2e2'; this.style.color='#ef4444';"
              onmouseout="this.style.background='transparent'; this.style.color='#94a3b8';"
              onclick="this.parentElement.style.transform='translateX(100%)'; this.parentElement.style.opacity='0'; setTimeout(() => window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'todo_delete', params: {id: '${todo.id}'}}}, '*'), 200);"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </li>
        `).join('')}
      </ul>
      
      ${allowAdd ? `
        <!-- Add new item -->
        <form onsubmit="
          event.preventDefault();
          const input = this.querySelector('input[name=text]');
          const priority = this.querySelector('select[name=priority]');
          if (input.value.trim()) {
            window.parent.postMessage({
              type: 'mcp-ui-action', 
              action: 'tool', 
              payload: {
                toolName: 'todo_add', 
                params: {
                  text: input.value.trim(),
                  priority: priority.value
                }
              }
            }, '*');
            input.value = '';
          }
        " style="display: flex; gap: 8px;">
          <input 
            type="text"
            name="text"
            class="input"
            placeholder="Add a new task..."
            style="flex: 1;"
          />
          ${showPriority ? `
            <select name="priority" class="input" style="width: 100px;">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          ` : ''}
          <button type="submit" class="btn btn-primary" style="padding: 10px 20px;">Add</button>
        </form>
      ` : ''}
    </div>
  `);

  return createHtmlResource({
    uri: `ui://todo/${title.toLowerCase().replace(/\s+/g, '-')}`,
    html,
    title,
    description: `Todo list with ${totalCount} items (${completedCount} completed)`
  });
}
