# Use Node.js LTS as the base image
FROM node:20.18.1-alpine3.20 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Install pnpm in a separate stage
FROM base AS pnpm
RUN for i in $(seq 1 5); do npm install -g pnpm && break || sleep 10; done

# Rebuild the source code only when needed
FROM pnpm AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client with retry logic
RUN for i in $(seq 1 ); do npx prisma generate && break || sleep 10; done

# Build the Next.js application with retry logic
RUN for i in $(seq 1 2); do npm run build && break || sleep 10; done

# Ensure the .next/standalone directory is created
RUN mkdir -p .next/standalone

# Ensure the .next/static directory is created
RUN mkdir -p .next/static

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set proper ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]