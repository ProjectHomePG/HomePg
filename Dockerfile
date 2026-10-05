# Stage 1: Build Backend (Java)
FROM maven:3.8.5-openjdk-17-slim AS backend-builder
WORKDIR /build/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src

# Package the application into a single executable JAR
RUN mvn clean package -DskipTests

# Stage 2: Runner (Java Only)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Create data directory with proper permissions for SQLite DB
RUN mkdir -p /app/data

# Seed the embedded H2 database and uploaded images from the git-tracked snapshot
COPY data ./data

# Copy the single JAR which now contains the backend API
COPY --from=backend-builder /build/backend/target/livio-backend-0.0.1-SNAPSHOT.jar app.jar

# Start the Spring Boot application directly
CMD ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]
