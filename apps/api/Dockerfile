FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install pnpm
RUN npm install -g pnpm

# Copy source code
COPY . .

# Build the application
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]