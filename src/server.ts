// =============================================================================
// BioR Platform - Node.js Standalone Server Entry
// =============================================================================
// This adapter allows the Hono app to run as a standalone Node.js server.
// Use this for: local development, on-premise hosting, Docker containers,
// VPS deployment, or any Node.js hosting platform.
//
// Usage:
//   npm run build:node
//   PORT=3000 node dist-node/index.js
// =============================================================================

import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import app from './index'

// Serve static files from public/ directory for Node.js hosting
// (Cloudflare Pages handles this automatically via pages_build_output_dir)
app.use('/static/*', serveStatic({ root: './' }))
app.use('/js/*', serveStatic({ root: './' }))
app.use('/login.html', serveStatic({ root: './', path: '/login.html' }))

const port = parseInt(process.env.PORT || '3000', 10)
const hostname = process.env.HOST || '0.0.0.0'

console.log(`
 ____  _       ____    ____  _       _    __
| __ )(_) ___ |  _ \\  |  _ \\| | __ _| |_ / _| ___  _ __ _ __ ___
|  _ \\| |/ _ \\| |_) | | |_) | |/ _\` | __| |_ / _ \\| '__| '_ \` _ \\
| |_) | | (_) |  _ <  |  __/| | (_| | |_|  _| (_) | |  | | | | | |
|____/|_|\\___/|_| \\_\\ |_|   |_|\\__,_|\\__|_|  \\___/|_|  |_| |_| |_|

  Mode:        Node.js Standalone Server
  Address:     http://${hostname}:${port}
  API:         http://${hostname}:${port}/api
  Environment: ${process.env.NODE_ENV || 'development'}
`)

serve({
  fetch: app.fetch,
  port,
  hostname,
})
