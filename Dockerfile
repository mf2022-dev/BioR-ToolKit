# =============================================================================
# BioR Platform - Dockerfile
# =============================================================================
# Multi-stage build for production Node.js deployment
#
# Build: docker build -t bior-platform .
# Run:   docker run -p 3000:3000 bior-platform
#
# Environment Variables:
#   PORT       - Server port (default: 3000)
#   HOST       - Bind address (default: 0.0.0.0)
#   NODE_ENV   - Environment (default: production)
# =============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build for Node.js
RUN npx vite build --config vite.config.node.ts

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -S bior && adduser -S bior -G bior

# Copy built output
COPY --from=builder /app/dist-node ./dist-node
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Install production dependencies only
RUN npm ci --omit=dev 2>/dev/null || true

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Switch to non-root user
USER bior

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/dashboard || exit 1

# Start server
CMD ["node", "dist-node/server.js"]
