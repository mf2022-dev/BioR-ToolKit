# =============================================================================
# BioR Platform - Hosting & Deployment Guide
# =============================================================================
# This guide covers all supported deployment targets.
# The platform is built with Hono framework, which runs on any JavaScript runtime.
# =============================================================================

## Quick Reference

| Hosting Target       | Build Command        | Start Command                   | Config File           |
|----------------------|----------------------|---------------------------------|-----------------------|
| Cloudflare Pages     | `npm run build`      | Automatic (edge deploy)         | `wrangler.jsonc`      |
| Node.js (local)      | `npm run build:node` | `node dist-node/index.js`       | `vite.config.node.ts` |
| Docker               | `docker build .`     | `docker run -p 3000:3000 bior`  | `Dockerfile`          |
| PM2 (production)     | `npm run build:node` | `pm2 start ecosystem.node.cjs`  | `ecosystem.node.cjs`  |

---

## 1. Cloudflare Pages (Current Production)

Zero-config edge deployment across 300+ global PoPs.

```bash
# Build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name bior

# Preview locally
npx wrangler pages dev dist --port 3000
```

**Pros**: Free tier, global CDN, auto-scaling, zero maintenance
**Limits**: 10ms CPU/request (free), no persistent filesystem

---

## 2. Node.js Standalone Server

Run on any machine with Node.js 18+.

```bash
# Build
npm run build:node

# Start (with custom port)
PORT=3000 node dist-node/index.js

# Or with environment variables
HOST=0.0.0.0 PORT=8080 NODE_ENV=production node dist-node/index.js
```

**Environment Variables**:
- `PORT` — Server port (default: 3000)
- `HOST` — Bind address (default: 0.0.0.0)
- `NODE_ENV` — Environment name (default: development)

---

## 3. Docker

```bash
# Build image
docker build -t bior-platform .

# Run container
docker run -d -p 3000:3000 --name bior bior-platform

# With custom port
docker run -d -p 8080:3000 -e PORT=3000 --name bior bior-platform

# Docker Compose (recommended)
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

**Health check**: Built-in at `GET /api/dashboard`

---

## 4. PM2 Process Manager (Production Linux/VPS)

```bash
# Build first
npm run build:node

# Start with PM2
pm2 start ecosystem.node.cjs

# Monitor
pm2 monit
pm2 logs bior-platform --nostream

# Auto-restart on crash + boot
pm2 startup
pm2 save
```

Create `ecosystem.node.cjs`:
```javascript
module.exports = {
  apps: [{
    name: 'bior-platform',
    script: 'dist-node/index.js',
    env: { PORT: 3000, NODE_ENV: 'production' },
    instances: 'max',     // Use all CPU cores
    exec_mode: 'cluster', // Cluster mode for multi-core
    watch: false,
    max_memory_restart: '500M',
  }]
}
```

---

## 5. Systemd Service (Linux bare metal)

Create `/etc/systemd/system/bior.service`:
```ini
[Unit]
Description=BioR Platform
After=network.target

[Service]
Type=simple
User=bior
WorkingDirectory=/opt/bior-platform
ExecStart=/usr/bin/node dist-node/index.js
Environment=PORT=3000
Environment=NODE_ENV=production
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable bior
sudo systemctl start bior
sudo systemctl status bior
```

---

## 6. AWS / GCP / Azure VPS

1. SSH into your VM
2. Install Node.js 18+ (`nvm install 20`)
3. Clone repo: `git clone https://github.com/mf2022-dev/BioR.git`
4. Build: `cd BioR && npm install && npm run build:node`
5. Start: `PORT=3000 node dist-node/index.js`
6. Use PM2 or systemd for production (see above)
7. Set up Nginx reverse proxy for HTTPS

**Nginx config** (`/etc/nginx/sites-available/bior`):
```nginx
server {
    listen 80;
    server_name bior.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 7. Vercel / Netlify / AWS Lambda

Hono supports these platforms natively. To switch:

**Vercel**: Change `vite.config.ts` to use `@hono/vite-build/vercel`
**Netlify**: Change to `@hono/vite-build/netlify-functions`
**AWS Lambda**: Change to `@hono/vite-build/aws-lambda` (via API Gateway)

Each requires only changing the Vite build adapter — the app code stays identical.

---

## 8. Acquisition / Transfer Checklist

If the platform is acquired or needs to move to a new owner:

1. **Source Code**: Full repo at GitHub (MIT license ready)
2. **No vendor lock-in**: Zero Cloudflare-specific APIs used
3. **Data layer**: Static TypeScript modules — easily swap for any database
4. **Authentication**: Stub auth — ready to integrate any provider (Auth0, Firebase, etc.)
5. **Build system**: Standard Vite — works with any CI/CD
6. **Dependencies**: Only 2 runtime deps (hono + @hono/node-server)
7. **Docker**: Ready for any container platform (ECS, GKE, AKS)

---

## Architecture Portability Matrix

| Feature          | Cloudflare | Node.js | Docker | Vercel | AWS Lambda |
|------------------|:----------:|:-------:|:------:|:------:|:----------:|
| HTML Pages       |     ✅      |    ✅    |   ✅    |   ✅    |     ✅      |
| REST API         |     ✅      |    ✅    |   ✅    |   ✅    |     ✅      |
| Static Assets    |     ✅      |    ✅    |   ✅    |   ✅    |     ✅      |
| CORS             |     ✅      |    ✅    |   ✅    |   ✅    |     ✅      |
| Custom Domain    |     ✅      |    ✅    |   ✅    |   ✅    |     ✅      |
| HTTPS            |  Auto      | Nginx   | Nginx  |  Auto  |   Auto     |
| Auto-scaling     |  Built-in  | Manual  | K8s    | Built  |  Built-in  |
| Cost (small)     |  Free      | ~$5/mo  | ~$5/mo | Free   |  Free tier |
