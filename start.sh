#!/bin/sh

# Ensure data directory exists
mkdir -p /app/data

# JVM tuning: free instances have 512MB total (Node + JVM share it).
# Default max heap is only 25% of that (~128MB) which is too small for Spring Boot.
JAVA_OPTS="${JAVA_OPTS:--XX:MaxRAMPercentage=65.0 -XX:+UseSerialGC}"

# Start the Spring Boot backend in the background (IPv4 only)
echo "Starting Spring Boot backend on port 8083..."
java $JAVA_OPTS -Djava.net.preferIPv4Stack=true -jar backend.jar &
JAVA_PID=$!

# Wait for backend to be ready (check IPv4 explicitly)
echo "Waiting for backend to bind to port 8083..."
RETRIES=90
until curl -sf http://127.0.0.1:8083/ > /dev/null 2>&1; do
  # Fail fast if the JVM already died (crash / OOM)
  if ! kill -0 $JAVA_PID 2>/dev/null; then
    echo "ERROR: Backend process exited during startup (code below)"
    wait $JAVA_PID
    echo "ERROR: JVM exit code: $?"
    exit 1
  fi
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -le 0 ]; then
    echo "ERROR: Backend failed to start within timeout (180s)"
    kill $JAVA_PID 2>/dev/null
    exit 1
  fi
  echo "  Backend not ready, waiting... ($RETRIES retries left)"
  sleep 2
done

echo "Backend is ready on port 8083"

# Start Next.js frontend in the foreground
echo "Starting Next.js frontend on port ${PORT:-8082}..."
npm run start
