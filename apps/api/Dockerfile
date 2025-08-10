FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy types package
COPY ../../packages/types ./packages/types

# Install and build types package
WORKDIR /app/packages/types
RUN pnpm install --frozen-lockfile && pnpm build

# Back to API directory
WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]