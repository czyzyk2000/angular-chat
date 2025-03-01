#!/bin/bash

# Build the frontend
echo "Building frontend..."
npm install --legacy-peer-deps
npm run build

# Success message
echo "Build completed successfully!"
