#!/bin/sh

# Start the Spring Boot backend in the background
echo "Starting Spring Boot backend on port 8083..."
java -jar backend.jar &

# Wait for backend to start
echo "Waiting for backend to bind to port 8083..."
sleep 5

# Start Next.js frontend in the foreground
echo "Starting Next.js frontend on port 8082..."
npm run start
