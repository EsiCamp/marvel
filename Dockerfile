# Use Node.js LTS as the base image for building
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the Nuxt app
RUN npm run build

# Use a minimal runtime image for production
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary built files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.output .output

# Install only production dependencies (optional)
RUN npm install --omit=dev --ignore-scripts

# Expose the port Nuxt runs on
EXPOSE 3000

