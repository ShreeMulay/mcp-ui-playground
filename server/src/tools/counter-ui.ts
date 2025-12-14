/**
 * Counter UI Tool
 * 
 * An interactive counter that demonstrates button actions
 * and how to trigger tool callbacks from the UI.
 */

import { z } from 'zod';
import { createHtmlResource, wrapWithStyles, createActionButton } from '../lib/ui-helpers';

// Tool definition
export const counterUITool = {
  name: 'counter_ui',
  description: 'Display an interactive counter with increment/decrement buttons',
  inputSchema: z.object({
    initialValue: z.number().optional().describe('Starting value (default: 0)'),
    step: z.number().optional().describe('Increment/decrement step (default: 1)'),
    min: z.number().optional().describe('Minimum value'),
    max: z.number().optional().describe('Maximum value'),
  }),
};

export type CounterUIInput = z.infer<typeof counterUITool.inputSchema>;

// Tool handler
export function handleCounterUI(input: CounterUIInput) {
  const initialValue = input.initialValue ?? 0;
  const step = input.step ?? 1;
  const min = input.min;
  const max = input.max;

  const html = wrapWithStyles(`
    <div class="card" style="max-width: 320px;">
      <h2 style="margin: 0 0 20px 0; color: #1e293b; text-align: center;">
        Interactive Counter
      </h2>
      
      <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
        <button 
          class="btn btn-danger"
          style="width: 56px; height: 56px; font-size: 28px; border-radius: 50%;"
          onclick="
            const counter = document.getElementById('counter-value');
            let val = parseInt(counter.textContent);
            val -= ${step};
            ${min !== undefined ? `if (val < ${min}) val = ${min};` : ''}
            counter.textContent = val;
            window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'counter_decrement', params: {value: val, step: ${step}}}}, '*');
          "
        >-</button>
        
        <span 
          id="counter-value"
          style="
            font-size: 56px;
            font-weight: 700;
            min-width: 100px;
            text-align: center;
            color: #1e293b;
          "
        >${initialValue}</span>
        
        <button 
          class="btn btn-success"
          style="width: 56px; height: 56px; font-size: 28px; border-radius: 50%;"
          onclick="
            const counter = document.getElementById('counter-value');
            let val = parseInt(counter.textContent);
            val += ${step};
            ${max !== undefined ? `if (val > ${max}) val = ${max};` : ''}
            counter.textContent = val;
            window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'counter_increment', params: {value: val, step: ${step}}}}, '*');
          "
        >+</button>
      </div>
      
      <div style="text-align: center; color: #64748b; font-size: 14px;">
        <p style="margin: 0;">Step: ${step}</p>
        ${min !== undefined || max !== undefined ? `
          <p style="margin: 4px 0 0 0;">
            Range: ${min ?? '-∞'} to ${max ?? '∞'}
          </p>
        ` : ''}
      </div>
      
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; justify-content: center;">
        <button 
          class="btn btn-secondary"
          onclick="
            document.getElementById('counter-value').textContent = ${initialValue};
            window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'counter_reset', params: {value: ${initialValue}}}}, '*');
          "
        >Reset</button>
      </div>
    </div>
  `);

  return createHtmlResource({
    uri: `ui://counter/${initialValue}`,
    html,
    title: 'Interactive Counter',
    description: `Counter starting at ${initialValue} with step ${step}`
  });
}
