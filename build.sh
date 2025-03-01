#!/bin/bash

echo "🔧 Installing dependencies..."
npm install

echo "🔨 Building TypeScript..."
npx tsc

echo "🚀 Build complete!"
