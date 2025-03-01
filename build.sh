#!/bin/bash

# Build the backend
echo "Building backend..."
cd chat-backend
npm install
npm run build
cd ..

# Build the frontend
echo "Building frontend..."
npm install
npm run build

# Success message
echo "Build completed successfully!"
