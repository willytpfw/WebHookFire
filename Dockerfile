# ──────────────────────────────────────────────
# Stage 1: Build the React client
# ──────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && node node_modules/vite/bin/vite.js build

# ──────────────────────────────────────────────
# Stage 2: Runtime — Node server + built client
# ──────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev && npm rebuild better-sqlite3 --build-from-source

COPY server/ ./server/

COPY --from=build /app/client/dist ./client/dist

# Persistent data directory managed automatically by HA Supervisor (/data)
RUN mkdir -p /data

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/webhooks || exit 1

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/webhookfire.sqlite

CMD ["node", "server/app.js"]