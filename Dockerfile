FROM node:22-bookworm-slim
WORKDIR /app

# Install all dependencies including build devDependencies (typescript)
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copy application source
COPY . .

# Build API only (memory-safe, outputs to dist/api)
RUN npm run build:api

# Set production environment for container runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 10000 4000

CMD ["node", "--max-old-space-size=380", "dist/api/main.js"]
