/**
 * Bun development server for MCP-UI Playground
 * 
 * Serves the playground with on-the-fly bundling
 * Run with: bun serve.ts
 * 
 * Change port with: PORT=4000 bun serve.ts
 */

const PORT = parseInt(process.env.PORT || '4567');

// Build the app first
console.log('Building playground...');

const buildResult = await Bun.build({
  entrypoints: ['./app.tsx'],
  outdir: './dist',
  target: 'browser',
  format: 'esm',
  minify: false,
  sourcemap: 'inline',
  external: [], // Bundle everything
});

if (!buildResult.success) {
  console.error('Build failed:');
  for (const log of buildResult.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log('Build complete!');

// Read the built file
const builtJS = await Bun.file('./dist/app.js').text();

// Create the HTML with inlined JS
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCP-UI Playground</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #root {
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
${builtJS}
  </script>
</body>
</html>`;

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);
    
    // Serve the app
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Serve built JS if requested directly
    if (url.pathname === '/app.js' || url.pathname === '/dist/app.js') {
      return new Response(builtJS, {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🚀 MCP-UI Playground is running!                     ║
  ║                                                        ║
  ║   Local:   http://localhost:${server.port}                     ║
  ║                                                        ║
  ║   Press Ctrl+C to stop                                 ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
`);
