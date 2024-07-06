# Use official Node.js image as the base image
FROM node:18-bullseye-slim

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 8001

# Command to run the application
CMD ["npm", "run", "dev"]