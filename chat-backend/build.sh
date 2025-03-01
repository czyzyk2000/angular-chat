#!/bin/bash

# Generate Prisma client
npx prisma generate

# Build the NestJS application
npm run build

# Make sure the public directory exists
mkdir -p public

# Copy the built frontend files to the public directory
cp -r public/* dist/public/ || true
