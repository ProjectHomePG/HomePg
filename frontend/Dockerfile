# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency configs
COPY package*.json ./
RUN npm ci

# Copy source code and compile optimized static assets
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:8083/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Stage 2: Production runner container
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy build artifacts and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port (configured to 8082 in package.json start script)
EXPOSE 8082

# Command to run Next.js production server
CMD ["npm", "run", "start"]
