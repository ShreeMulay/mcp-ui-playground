/**
 * Dashboard UI Tool
 * 
 * Embeds external URLs in an iframe.
 * Demonstrates the text/uri-list mimeType for embedding external content.
 */

import { z } from 'zod';
import { createUrlResource, createHtmlResource, wrapWithStyles } from '../lib/ui-helpers';

// Tool definition
export const dashboardUITool = {
  name: 'dashboard_ui',
  description: 'Embed an external URL or dashboard in the chat',
  inputSchema: z.object({
    url: z.string().url().describe('URL to embed'),
    title: z.string().optional().describe('Dashboard title'),
    height: z.number().optional().describe('Iframe height in pixels'),
    showControls: z.boolean().optional().describe('Show navigation controls'),
  }),
};

export type DashboardUIInput = z.infer<typeof dashboardUITool.inputSchema>;

// Preset dashboards for demo
const presetDashboards: Record<string, { url: string; title: string }> = {
  weather: {
    url: 'https://wttr.in/?format=4',
    title: 'Weather Dashboard'
  },
  news: {
    url: 'https://lite.cnn.com',
    title: 'CNN Lite'
  },
  docs: {
    url: 'https://modelcontextprotocol.io',
    title: 'MCP Documentation'
  }
};

// Tool handler
export function handleDashboardUI(input: DashboardUIInput) {
  const { url, title, height = 500, showControls = true } = input;
  
  // Check if URL is embeddable (many sites block iframes)
  // For demo purposes, we'll show a wrapper with controls
  
  if (!showControls) {
    // Simple iframe embed using uri-list
    return createUrlResource({
      uri: `ui://dashboard/${encodeURIComponent(url)}`,
      externalUrl: url,
      title: title || 'External Dashboard',
      description: `Embedded content from ${new URL(url).hostname}`
    });
  }

  // Enhanced wrapper with controls
  const hostname = new URL(url).hostname;
  
  const html = wrapWithStyles(`
    <div class="card" style="padding: 0; overflow: hidden;">
      <!-- Header bar -->
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      ">
        <div style="display: flex; gap: 6px;">
          <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%;"></span>
          <span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></span>
          <span style="width: 12px; height: 12px; background: #22c55e; border-radius: 50%;"></span>
        </div>
        
        <div style="
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          color: #64748b;
          font-family: monospace;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${hostname}
          </span>
        </div>
        
        <div style="display: flex; gap: 4px;">
          <button 
            class="btn btn-secondary"
            style="padding: 6px 10px; font-size: 12px;"
            onclick="document.getElementById('embed-frame').src = '${url}'"
            title="Reload"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
          <button 
            class="btn btn-secondary"
            style="padding: 6px 10px; font-size: 12px;"
            onclick="window.open('${url}', '_blank')"
            title="Open in new tab"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Iframe -->
      <div style="position: relative;">
        <iframe
          id="embed-frame"
          src="${url}"
          style="
            width: 100%;
            height: ${height}px;
            border: none;
            display: block;
          "
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        ></iframe>
        
        <!-- Overlay for blocked iframes -->
        <div 
          id="embed-fallback"
          style="
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #f8fafc;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 24px;
            text-align: center;
          "
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <p style="color: #64748b; margin: 0;">
            This site doesn't allow embedding.<br/>
            <a href="${url}" target="_blank" style="color: #6366f1;">Open in new tab →</a>
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="
        padding: 8px 16px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        font-size: 12px;
        color: #94a3b8;
        display: flex;
        justify-content: space-between;
      ">
        <span>${title || 'External Content'}</span>
        <span>Embedded via MCP-UI</span>
      </div>
    </div>
    
    <script>
      // Check if iframe loaded successfully
      document.getElementById('embed-frame').onerror = function() {
        document.getElementById('embed-fallback').style.display = 'flex';
      };
    </script>
  `);

  return createHtmlResource({
    uri: `ui://dashboard/${encodeURIComponent(url)}`,
    html,
    title: title || 'External Dashboard',
    description: `Embedded content from ${hostname}`
  });
}
