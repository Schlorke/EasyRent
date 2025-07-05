FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema BEFORE npm install (needed for postinstall script)
COPY prisma ./prisma/

# Install ALL dependencies (this will run prisma generate via postinstall)
RUN npm install --frozen-lockfile

# Copy source code
COPY src ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 4000

# Use the start script
CMD ["./start.sh"] 