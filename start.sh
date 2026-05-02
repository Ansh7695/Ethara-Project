#!/bin/bash

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..

# Build client
cd client
npm run build
cd ..

# Start server
cd server
npm start
