FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm ci

# Copy all files
COPY . .

# Build TypeScript
RUN npm run build

# Make start.sh executable
RUN chmod +x start.sh

EXPOSE 4000

# Use the start script
CMD ["./start.sh"] 