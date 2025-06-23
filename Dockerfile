FROM node:23.0.0-alpine

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json pnpm-lock.yaml* ./

# Install pnpm globally and dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy source code (node_modules should be ignored by .dockerignore)
COPY . ./

# Build Nuxt app
RUN pnpm run build

# Remove dev dependencies to reduce image size
RUN pnpm prune --prod

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

# Change ownership of the app directory
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose port (Cloud Run will set PORT env var)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Run Nuxt app
CMD ["node", ".output/server/index.mjs"]