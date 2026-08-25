# ──────────────────────────────────────────────
# Stage 1: Build the React client
# ──────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install client dependencies
COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm install && chmod +x node_modules/.bin/*

# Copy client source and build
COPY client/ ./client/
RUN cd client && npm run build

# ──────────────────────────────────────────────
# Stage 2: Runtime — Node server + built client
# ──────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

# Install server dependencies (production only)
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev

# Copy server source
COPY server/ ./server/

# Copy built React app from build stage
COPY --from=build /app/client/dist ./client/dist

# Create persistent db directory
RUN mkdir -p /app/server/db

# Expose the API/static server port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/webhooks || exit 1

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server/app.js"]
