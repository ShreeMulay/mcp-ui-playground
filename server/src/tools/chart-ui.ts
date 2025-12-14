/**
 * Chart UI Tool
 * 
 * A data visualization tool that renders bar and line charts.
 * Demonstrates how to create interactive data visualizations.
 */

import { z } from 'zod';
import { createHtmlResource, wrapWithStyles } from '../lib/ui-helpers';

// Data point schema
const dataPointSchema = z.object({
  label: z.string().describe('Data point label'),
  value: z.number().describe('Numeric value'),
  color: z.string().optional().describe('Bar color (CSS color)'),
});

// Tool definition
export const chartUITool = {
  name: 'chart_ui',
  description: 'Display a data visualization chart (bar or line)',
  inputSchema: z.object({
    title: z.string().optional().describe('Chart title'),
    type: z.enum(['bar', 'line', 'horizontal-bar']).optional().describe('Chart type'),
    data: z.array(dataPointSchema).optional().describe('Data points'),
    showValues: z.boolean().optional().describe('Show values on chart'),
    height: z.number().optional().describe('Chart height in pixels'),
  }),
};

export type ChartUIInput = z.infer<typeof chartUITool.inputSchema>;

// Default sample data
const defaultData = [
  { label: 'Jan', value: 12000, color: '#6366f1' },
  { label: 'Feb', value: 16000, color: '#6366f1' },
  { label: 'Mar', value: 10000, color: '#6366f1' },
  { label: 'Apr', value: 18000, color: '#6366f1' },
  { label: 'May', value: 20000, color: '#22c55e' },
  { label: 'Jun', value: 15000, color: '#6366f1' },
];

// Tool handler
export function handleChartUI(input: ChartUIInput) {
  const title = input.title || 'Data Visualization';
  const chartType = input.type || 'bar';
  const data = input.data || defaultData;
  const showValues = input.showValues !== false;
  const height = input.height || 200;

  const maxValue = Math.max(...data.map(d => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const formatValue = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  let chartHtml = '';

  if (chartType === 'bar') {
    chartHtml = `
      <div style="display: flex; align-items: flex-end; gap: 12px; height: ${height}px; padding: 0 8px;">
        ${data.map((d, i) => {
          const barHeight = (d.value / maxValue) * height;
          return `
            <div style="flex: 1; text-align: center;">
              <div 
                style="
                  background: linear-gradient(to top, ${d.color || '#6366f1'}, ${d.color || '#8b5cf6'});
                  height: ${barHeight}px;
                  border-radius: 4px 4px 0 0;
                  transition: height 0.3s, transform 0.2s;
                  cursor: pointer;
                "
                onmouseover="this.style.transform='scaleY(1.02)'"
                onmouseout="this.style.transform='scaleY(1)'"
                onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'chart_click', params: {label: '${d.label}', value: ${d.value}, index: ${i}}}}, '*')"
              ></div>
              <span style="display: block; margin-top: 8px; font-size: 12px; color: #64748b;">${d.label}</span>
              ${showValues ? `<span style="font-weight: 600; color: #1e293b; font-size: 13px;">${formatValue(d.value)}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (chartType === 'horizontal-bar') {
    chartHtml = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${data.map((d, i) => {
          const barWidth = (d.value / maxValue) * 100;
          return `
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="min-width: 60px; font-size: 13px; color: #64748b;">${d.label}</span>
              <div style="flex: 1; background: #e2e8f0; border-radius: 4px; height: 28px; overflow: hidden;">
                <div 
                  style="
                    background: linear-gradient(to right, ${d.color || '#6366f1'}, ${d.color || '#8b5cf6'});
                    width: ${barWidth}%;
                    height: 100%;
                    border-radius: 4px;
                    cursor: pointer;
                  "
                  onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'chart_click', params: {label: '${d.label}', value: ${d.value}, index: ${i}}}}, '*')"
                ></div>
              </div>
              ${showValues ? `<span style="min-width: 60px; font-weight: 600; color: #1e293b; font-size: 13px;">${formatValue(d.value)}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (chartType === 'line') {
    // Simple line chart using SVG
    const svgWidth = 400;
    const svgHeight = height;
    const padding = 40;
    const chartWidth = svgWidth - padding * 2;
    const chartHeight = svgHeight - padding * 2;
    
    const points = data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * chartWidth,
      y: padding + chartHeight - (d.value / maxValue) * chartHeight
    }));
    
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${padding} ${svgHeight - padding} Z`;

    chartHtml = `
      <svg width="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible;">
        <!-- Grid lines -->
        ${[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = padding + chartHeight * (1 - ratio);
          return `<line x1="${padding}" y1="${y}" x2="${svgWidth - padding}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="4"/>`;
        }).join('')}
        
        <!-- Area fill -->
        <path d="${areaD}" fill="url(#gradient)" opacity="0.2"/>
        
        <!-- Line -->
        <path d="${pathD}" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Points -->
        ${points.map((p, i) => `
          <circle 
            cx="${p.x}" cy="${p.y}" r="6" 
            fill="white" stroke="#6366f1" stroke-width="3"
            style="cursor: pointer;"
            onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'chart_click', params: {label: '${data[i].label}', value: ${data[i].value}, index: ${i}}}}, '*')"
          />
        `).join('')}
        
        <!-- Labels -->
        ${points.map((p, i) => `
          <text x="${p.x}" y="${svgHeight - 10}" text-anchor="middle" font-size="12" fill="#64748b">${data[i].label}</text>
        `).join('')}
        
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  const html = wrapWithStyles(`
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #1e293b; font-size: 20px;">${title}</h2>
        <div style="display: flex; gap: 8px;">
          ${['bar', 'line', 'horizontal-bar'].map(type => `
            <button 
              class="btn ${type === chartType ? 'btn-primary' : 'btn-secondary'}"
              style="padding: 6px 12px; font-size: 12px;"
              onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'chart_ui', params: {type: '${type}', title: '${title}'}}}, '*')"
            >${type.replace('-', ' ')}</button>
          `).join('')}
        </div>
      </div>
      
      ${chartHtml}
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 20px; display: flex; justify-content: space-between;">
        <span style="font-size: 14px; color: #64748b;">Total: <strong style="color: #1e293b;">${formatValue(total)}</strong></span>
        <span style="font-size: 14px; color: #22c55e;">+15% from last period</span>
      </div>
    </div>
  `);

  return createHtmlResource({
    uri: `ui://chart/${chartType}`,
    html,
    title: `${title} (${chartType})`,
    description: `${chartType} chart with ${data.length} data points`
  });
}
