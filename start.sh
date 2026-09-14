#!/bin/sh

# Start the Spring Boot backend in the background
echo "Starting Spring Boot backend on port 8083..."
java -jar backend.jar &
BACKEND_PID=$!

# Wait for backend to be healthy
echo "Waiting for backend to bind to port 8083..."
MAX_RETRIES=25
COUNT=0
while [ $COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://localhost:8083/ > /dev/null 2>&1; then
    echo "Backend is up and responsive on port 8083!"
    break
  fi
  sleep 1
  COUNT=$((COUNT + 1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo "Warning: Backend did not respond within ${MAX_RETRIES}s. Proceeding with frontend startup..."
fi

# Determine port for Next.js (Render provides $PORT, fallback to 8082)
APP_PORT="${PORT:-8082}"
echo "Starting Next.js frontend on port ${APP_PORT}..."
exec npx next start -p "${APP_PORT}"

