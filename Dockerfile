FROM node:22-alpine AS build   ← debe decir exactamente esto

WORKDIR /app

# Herramientas necesarias para compilar módulos nativos (better-sqlite3) en Alpine/musl
RUN apk add --no-cache python3 make g++

# Install server dependencies (production only)
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev && npm rebuild better-sqlite3 --build-from-source

# Copy server source
COPY server/ ./server/

# Copy built React app from build stage
COPY --from=build /app/client/dist ./client/dist

# Create persistent db directory
RUN mkdir -p /app/server/db

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/webhooks || exit 1

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server/app.js"]