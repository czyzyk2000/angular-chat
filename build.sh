#!/bin/bash

# Build backend
cd chat-backend
npm install
npm run build

# Build frontend
cd ../chat-frontend
npm install
npm run build

# Create public directory in backend/dist
mkdir -p ../chat-backend/public

# Copy frontend build to backend/public
cp -r dist/chat-frontend/* ../chat-backend/public/

echo "Build completed successfully!"
