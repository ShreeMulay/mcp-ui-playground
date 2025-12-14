/**
 * Weather UI Tool
 * 
 * A weather widget that displays current conditions.
 * Demonstrates API-driven UI with refresh capability.
 */

import { z } from 'zod';
import { createHtmlResource, wrapWithStyles } from '../lib/ui-helpers';

// Tool definition
export const weatherUITool = {
  name: 'weather_ui',
  description: 'Display a weather widget for a location',
  inputSchema: z.object({
    location: z.string().optional().describe('City name or location'),
    units: z.enum(['fahrenheit', 'celsius']).optional().describe('Temperature units'),
    showForecast: z.boolean().optional().describe('Show 5-day forecast'),
  }),
};

export type WeatherUIInput = z.infer<typeof weatherUITool.inputSchema>;

// Sample weather data (in a real app, this would come from an API)
const sampleWeather = {
  location: 'San Francisco, CA',
  temperature: 72,
  condition: 'Partly Cloudy',
  humidity: 65,
  wind: 12,
  uvIndex: 6,
  feelsLike: 70,
  forecast: [
    { day: 'Mon', high: 74, low: 58, condition: 'sunny' },
    { day: 'Tue', high: 71, low: 56, condition: 'cloudy' },
    { day: 'Wed', high: 68, low: 54, condition: 'rainy' },
    { day: 'Thu', high: 70, low: 55, condition: 'partly-cloudy' },
    { day: 'Fri', high: 73, low: 57, condition: 'sunny' },
  ]
};

// Weather icons (SVG)
const weatherIcons: Record<string, string> = {
  sunny: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>`,
  cloudy: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>`,
  rainy: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <line x1="16" y1="13" x2="16" y2="21"/>
    <line x1="8" y1="13" x2="8" y2="21"/>
    <line x1="12" y1="15" x2="12" y2="23"/>
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
  </svg>`,
  'partly-cloudy': `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 17.66l1.41 1.41M2 12h2M6.34 6.34L4.93 4.93"/>
    <circle cx="12" cy="10" r="4"/>
    <path d="M19 16h-3.26A7 7 0 1 0 6 14h5.5a4.5 4.5 0 1 0 7.5 2z"/>
  </svg>`,
};

// Tool handler
export function handleWeatherUI(input: WeatherUIInput) {
  const location = input.location || sampleWeather.location;
  const units = input.units || 'fahrenheit';
  const showForecast = input.showForecast !== false;

  const temp = units === 'celsius' 
    ? Math.round((sampleWeather.temperature - 32) * 5/9)
    : sampleWeather.temperature;
  const feelsLike = units === 'celsius'
    ? Math.round((sampleWeather.feelsLike - 32) * 5/9)
    : sampleWeather.feelsLike;
  const unitSymbol = units === 'celsius' ? 'C' : 'F';

  const conditionKey = sampleWeather.condition.toLowerCase().replace(' ', '-');
  const icon = weatherIcons[conditionKey] || weatherIcons['partly-cloudy'];

  const html = wrapWithStyles(`
    <div style="
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      border-radius: 16px;
      color: white;
      padding: 0;
      max-width: 360px;
      overflow: hidden;
    ">
      <!-- Main weather display -->
      <div style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="margin: 0; font-size: 16px; opacity: 0.9; font-weight: 500;">
              ${location}
            </h3>
            <p style="margin: 8px 0 0 0; font-size: 64px; font-weight: 300; line-height: 1;">
              ${temp}°<span style="font-size: 24px;">${unitSymbol}</span>
            </p>
            <p style="margin: 4px 0 0 0; font-size: 16px; opacity: 0.9;">
              ${sampleWeather.condition}
            </p>
            <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.7;">
              Feels like ${feelsLike}°${unitSymbol}
            </p>
          </div>
          <div style="opacity: 0.9;">
            ${icon}
          </div>
        </div>
        
        <!-- Weather details -->
        <div style="
          display: flex;
          gap: 16px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.2);
        ">
          <div style="flex: 1; text-align: center;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">Humidity</p>
            <p style="margin: 4px 0 0 0; font-weight: 600; font-size: 18px;">${sampleWeather.humidity}%</p>
          </div>
          <div style="flex: 1; text-align: center;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">Wind</p>
            <p style="margin: 4px 0 0 0; font-weight: 600; font-size: 18px;">${sampleWeather.wind} mph</p>
          </div>
          <div style="flex: 1; text-align: center;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">UV Index</p>
            <p style="margin: 4px 0 0 0; font-weight: 600; font-size: 18px;">${sampleWeather.uvIndex}</p>
          </div>
        </div>
      </div>
      
      ${showForecast ? `
        <!-- 5-day forecast -->
        <div style="
          background: rgba(0,0,0,0.1);
          padding: 16px 24px;
        ">
          <p style="margin: 0 0 12px 0; font-size: 12px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em;">
            5-Day Forecast
          </p>
          <div style="display: flex; justify-content: space-between;">
            ${sampleWeather.forecast.map(day => {
              const highC = units === 'celsius' ? Math.round((day.high - 32) * 5/9) : day.high;
              const lowC = units === 'celsius' ? Math.round((day.low - 32) * 5/9) : day.low;
              return `
                <div style="text-align: center; flex: 1;">
                  <p style="margin: 0; font-size: 12px; opacity: 0.7;">${day.day}</p>
                  <div style="margin: 8px 0; opacity: 0.8; transform: scale(0.5); height: 32px;">
                    ${weatherIcons[day.condition] || weatherIcons['sunny']}
                  </div>
                  <p style="margin: 0; font-size: 14px;">
                    <span style="font-weight: 600;">${highC}°</span>
                    <span style="opacity: 0.7;">${lowC}°</span>
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Actions -->
      <div style="
        padding: 12px 24px;
        background: rgba(0,0,0,0.15);
        display: flex;
        gap: 8px;
      ">
        <button 
          style="
            flex: 1;
            padding: 10px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.3)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'"
          onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'weather_refresh', params: {location: '${location}'}}}, '*')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Refresh
        </button>
        <button 
          style="
            flex: 1;
            padding: 10px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.3)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'"
          onclick="window.parent.postMessage({type: 'mcp-ui-action', action: 'tool', payload: {toolName: 'weather_change_units', params: {units: '${units === 'fahrenheit' ? 'celsius' : 'fahrenheit'}'}}}, '*')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
          </svg>
          °${units === 'fahrenheit' ? 'C' : 'F'}
        </button>
      </div>
    </div>
  `);

  return createHtmlResource({
    uri: `ui://weather/${location.toLowerCase().replace(/[,\s]+/g, '-')}`,
    html,
    title: `Weather - ${location}`,
    description: `Current conditions: ${temp}°${unitSymbol}, ${sampleWeather.condition}`
  });
}
