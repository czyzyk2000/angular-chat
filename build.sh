#!/bin/bash

# Build the frontend
echo "Building frontend..."
npm install
npm run build

# Success message
echo "Build completed successfully!"
