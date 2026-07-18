# Stage 1: Build Backend (Java)
FROM maven:3.8.5-openjdk-17-slim AS backend-builder
WORKDIR /build/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Build Frontend (Next.js)
FROM node:20-alpine AS frontend-builder
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ENV NEXT_PUBLIC_API_URL=/api
RUN npm run build

# Stage 3: Runner (Java + Node)
FROM eclipse-temurin:17-jdk-alpine
# Install Node.js and npm in Alpine
RUN apk add --no-cache nodejs npm

WORKDIR /app

# Copy Backend files
COPY --from=backend-builder /build/backend/target/livio-backend-0.0.1-SNAPSHOT.jar backend.jar

# Copy Frontend files
COPY --from=frontend-builder /build/frontend/package*.json ./
COPY --from=frontend-builder /build/frontend/node_modules ./node_modules
COPY --from=frontend-builder /build/frontend/.next ./.next
COPY --from=frontend-builder /build/frontend/public ./public
COPY --from=frontend-builder /build/frontend/next.config.mjs ./next.config.mjs

# Expose Next.js port
EXPOSE 8082

# Script to start both
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
