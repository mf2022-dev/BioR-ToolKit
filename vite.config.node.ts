// =============================================================================
// BioR Platform - Vite Config for Node.js Build
// =============================================================================
// This config builds the app for Node.js standalone hosting.
// The @hono/vite-build/node plugin auto-generates the serve() wrapper.
//
// Output: dist-node/index.js
//
// Usage:
//   npm run build:node
//   PORT=3000 node dist-node/index.js
//
// NOTE: The port is read from process.env.PORT at runtime.
// =============================================================================

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist-node',
    emptyOutDir: true,
    ssr: true,
    rollupOptions: {
      input: 'src/server.ts',
      output: {
        entryFileNames: 'index.js',
        format: 'esm',
      },
      external: ['node:http', 'node:https', 'node:net', 'node:events', 'node:stream', 'node:buffer', 'node:crypto', 'node:fs', 'node:path', 'node:url', 'node:util', 'node:zlib']
    },
  },
})
