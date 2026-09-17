#!/bin/sh

# Ensure data directory exists
mkdir -p /app/data

# Start the Spring Boot backend in the background (IPv4 only)
echo "Starting Spring Boot backend on port 8083..."
java -Djava.net.preferIPv4Stack=true -jar backend.jar &

# Wait for backend to be ready (check IPv4 explicitly)
echo "Waiting for backend to bind to port 8083..."
RETRIES=30
until curl -sf http://127.0.0.1:8083/ > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -le 0 ]; then
    echo "ERROR: Backend failed to start within timeout"
    exit 1
  fi
  echo "  Backend not ready, waiting... ($RETRIES retries left)"
  sleep 2
done

echo "Backend is ready on port 8083"

# Start Next.js frontend in the foreground
echo "Starting Next.js frontend on port ${PORT:-8082}..."
npm run start
