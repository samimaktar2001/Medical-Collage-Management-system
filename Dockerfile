FROM node:22-bookworm-slim
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source
COPY . .

# Build API only (memory-safe, skips Next.js)
RUN npm run build:api

# Expose default port
EXPOSE 10000 4000

# Start API server with memory constraint
CMD ["node", "--max-old-space-size=380", "dist/api/main.js"]
