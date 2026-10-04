# Stage 1: Build Frontend (Next.js)
FROM node:20-alpine AS frontend-builder
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
# In export mode, the static files will be placed in the "out" directory
RUN STATIC_EXPORT=true npm run build

# Stage 2: Build Backend (Java)
FROM maven:3.8.5-openjdk-17-slim AS backend-builder
WORKDIR /build/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src

# Copy the statically exported frontend files into Spring Boot's static resources directory
COPY --from=frontend-builder /build/frontend/out ./src/main/resources/static

# Package the application into a single executable JAR
RUN mvn clean package -DskipTests

# Stage 3: Runner (Java Only)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Create data directory with proper permissions for SQLite DB
RUN mkdir -p /app/data

# Copy the single JAR which now contains both backend and frontend
COPY --from=backend-builder /build/backend/target/livio-backend-0.0.1-SNAPSHOT.jar app.jar

# Start the Spring Boot application directly (no separate Node process needed)
CMD ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]
