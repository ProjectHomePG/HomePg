# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy dependency configuration and go offline to cache maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR file from compilation stage
COPY --from=build /app/target/livio-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose server port (configured to 8083 in application.properties)
EXPOSE 8083

# Define entrypoint to execute Java runtime
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
