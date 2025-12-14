/**
 * UI Helper utilities for creating MCP-UI resources
 * 
 * These helpers wrap @mcp-ui/server functions to make it easier
 * to create consistent UI resources across tools.
 */

import { createUIResource as createResource } from '@mcp-ui/server';

export interface UIResourceOptions {
  uri: string;
  html?: string;
  url?: string;
  remoteDomScript?: string;
  title?: string;
  description?: string;
}

/**
 * Create a text/html UIResource
 */
export function createHtmlResource(options: {
  uri: string;
  html: string;
  title?: string;
  description?: string;
}) {
  return createResource({
    uri: options.uri,
    content: { 
      type: 'rawHtml', 
      htmlString: options.html 
    },
    encoding: 'text',
    metadata: {
      title: options.title,
      description: options.description
    }
  });
}

/**
 * Create a text/uri-list UIResource for embedding external URLs
 */
export function createUrlResource(options: {
  uri: string;
  externalUrl: string;
  title?: string;
  description?: string;
}) {
  return createResource({
    uri: options.uri,
    content: { 
      type: 'externalUrl', 
      iframeUrl: options.externalUrl 
    },
    encoding: 'text',
    metadata: {
      title: options.title,
      description: options.description
    }
  });
}

/**
 * Create a Remote DOM UIResource for dynamic components
 */
export function createRemoteDomResource(options: {
  uri: string;
  script: string;
  framework?: 'react' | 'webcomponents';
  title?: string;
  description?: string;
}) {
  return createResource({
    uri: options.uri,
    content: { 
      type: 'remoteDom', 
      script: options.script,
      framework: options.framework || 'react'
    },
    encoding: 'text',
    metadata: {
      title: options.title,
      description: options.description
    }
  });
}

/**
 * Common CSS styles that can be embedded in HTML resources
 */
export const commonStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; }
  .card { 
    padding: 24px; 
    background: white; 
    border-radius: 12px; 
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary { background: #6366f1; color: white; }
  .btn-primary:hover { background: #4f46e5; }
  .btn-secondary { background: #e2e8f0; color: #475569; }
  .btn-secondary:hover { background: #cbd5e1; }
  .btn-danger { background: #ef4444; color: white; }
  .btn-danger:hover { background: #dc2626; }
  .btn-success { background: #22c55e; color: white; }
  .btn-success:hover { background: #16a34a; }
  .input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
  .input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
  }
`;

/**
 * Helper to create a button that triggers an MCP tool action
 */
export function createActionButton(
  label: string,
  toolName: string,
  params: Record<string, unknown> = {},
  style: 'primary' | 'secondary' | 'danger' | 'success' = 'primary'
): string {
  const payload = JSON.stringify({ toolName, params }).replace(/"/g, '&quot;');
  return `
    <button 
      class="btn btn-${style}"
      onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: ${payload}}, '*')"
    >
      ${label}
    </button>
  `;
}

/**
 * Wrap HTML content with common styles
 */
export function wrapWithStyles(html: string): string {
  return `
    <style>${commonStyles}</style>
    ${html}
  `;
}
