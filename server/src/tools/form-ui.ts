/**
 * Form UI Tool
 * 
 * A customizable form that demonstrates form inputs and submission handling.
 * Supports multiple field types and validation.
 */

import { z } from 'zod';
import { createHtmlResource, wrapWithStyles } from '../lib/ui-helpers';

// Field type definition
const fieldSchema = z.object({
  name: z.string().describe('Field name (used as form key)'),
  label: z.string().describe('Display label'),
  type: z.enum(['text', 'email', 'password', 'number', 'textarea', 'select']).describe('Input type'),
  placeholder: z.string().optional().describe('Placeholder text'),
  required: z.boolean().optional().describe('Whether field is required'),
  options: z.array(z.string()).optional().describe('Options for select type'),
});

// Tool definition
export const formUITool = {
  name: 'form_ui',
  description: 'Display a customizable form with various input types',
  inputSchema: z.object({
    title: z.string().optional().describe('Form title'),
    description: z.string().optional().describe('Form description'),
    fields: z.array(fieldSchema).optional().describe('Form fields (default: contact form)'),
    submitLabel: z.string().optional().describe('Submit button text'),
    submitToolName: z.string().optional().describe('Tool to call on submit'),
  }),
};

export type FormUIInput = z.infer<typeof formUITool.inputSchema>;

// Default contact form fields
const defaultFields = [
  { name: 'name', label: 'Name', type: 'text' as const, placeholder: 'Your name', required: true },
  { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'you@example.com', required: true },
  { name: 'subject', label: 'Subject', type: 'select' as const, options: ['General Inquiry', 'Support', 'Feedback', 'Other'], required: true },
  { name: 'message', label: 'Message', type: 'textarea' as const, placeholder: 'Your message...', required: true },
];

// Tool handler
export function handleFormUI(input: FormUIInput) {
  const title = input.title || 'Contact Form';
  const description = input.description || 'Fill out the form below and we\'ll get back to you.';
  const fields = input.fields || defaultFields;
  const submitLabel = input.submitLabel || 'Submit';
  const submitToolName = input.submitToolName || 'form_submit';

  const renderField = (field: typeof fields[number]) => {
    const baseStyle = `
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    `;

    switch (field.type) {
      case 'textarea':
        return `
          <textarea 
            name="${field.name}"
            placeholder="${field.placeholder || ''}"
            rows="4"
            ${field.required ? 'required' : ''}
            style="${baseStyle} resize: vertical;"
          ></textarea>
        `;
      case 'select':
        return `
          <select 
            name="${field.name}"
            ${field.required ? 'required' : ''}
            style="${baseStyle}"
          >
            <option value="">Select an option...</option>
            ${(field.options || []).map(opt => 
              `<option value="${opt}">${opt}</option>`
            ).join('')}
          </select>
        `;
      default:
        return `
          <input 
            type="${field.type}"
            name="${field.name}"
            placeholder="${field.placeholder || ''}"
            ${field.required ? 'required' : ''}
            style="${baseStyle}"
          />
        `;
    }
  };

  const html = wrapWithStyles(`
    <div class="card" style="max-width: 420px;">
      <h2 style="margin: 0 0 8px 0; color: #1e293b; font-size: 24px;">
        ${title}
      </h2>
      <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px;">
        ${description}
      </p>
      
      <form onsubmit="
        event.preventDefault();
        const formData = {};
        new FormData(this).forEach((value, key) => formData[key] = value);
        window.parent.postMessage({
          type: 'mcp-ui-action', 
          action: 'tool', 
          payload: {
            toolName: '${submitToolName}', 
            params: formData
          }
        }, '*');
        
        // Show success message
        const btn = this.querySelector('button[type=submit]');
        const originalText = btn.textContent;
        btn.textContent = 'Submitted!';
        btn.style.background = '#22c55e';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#6366f1';
          this.reset();
        }, 2000);
      ">
        ${fields.map(field => `
          <div style="margin-bottom: 16px;">
            <label class="label">
              ${field.label}
              ${field.required ? '<span style="color: #ef4444;">*</span>' : ''}
            </label>
            ${renderField(field)}
          </div>
        `).join('')}
        
        <button 
          type="submit"
          class="btn btn-primary"
          style="width: 100%; padding: 12px; font-size: 16px; margin-top: 8px;"
        >
          ${submitLabel}
        </button>
      </form>
    </div>
  `);

  return createHtmlResource({
    uri: `ui://form/${title.toLowerCase().replace(/\s+/g, '-')}`,
    html,
    title,
    description: `Form with ${fields.length} fields`
  });
}
