/**
 * Bun development server for MCP-UI Playground
 * 
 * Serves the playground with hot reloading support
 * Run with: bun --hot serve.ts
 */

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Serve index.html for root
    if (path === '/') {
      path = '/index.html';
    }
    
    // Try to serve the file
    const filePath = `.${path}`;
    const file = Bun.file(filePath);
    
    if (await file.exists()) {
      // Set appropriate content type
      let contentType = 'text/plain';
      if (path.endsWith('.html')) contentType = 'text/html';
      else if (path.endsWith('.css')) contentType = 'text/css';
      else if (path.endsWith('.js')) contentType = 'application/javascript';
      else if (path.endsWith('.tsx') || path.endsWith('.ts')) {
        // Transpile TypeScript/TSX on the fly
        const transpiler = new Bun.Transpiler({
          loader: path.endsWith('.tsx') ? 'tsx' : 'ts',
        });
        const source = await file.text();
        const result = transpiler.transformSync(source);
        return new Response(result, {
          headers: { 
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      else if (path.endsWith('.json')) contentType = 'application/json';
      
      return new Response(file, {
        headers: { 
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 404 for not found
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
