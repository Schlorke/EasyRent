# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Fix for Rollup on ARM64 architecture
RUN rm -rf node_modules package-lock.json && \
    npm install

# Copy source code
COPY . .

# Ensure public folder is included
COPY public ./public

# Build the app
RUN npm run build

# Verify that public folders exist and copy them manually if needed
RUN if [ ! -d "/app/dist/images" ]; then \
      mkdir -p /app/dist/images && \
      cp -r /app/public/images/* /app/dist/images/ 2>/dev/null || true; \
    fi

RUN if [ ! -d "/app/dist/assets" ]; then \
      mkdir -p /app/dist/assets && \
      cp -r /app/public/assets/* /app/dist/assets/ 2>/dev/null || true; \
    fi

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy public images and assets (ensure they are included)
COPY --from=build /app/public/images /usr/share/nginx/html/images
COPY --from=build /app/public/assets /usr/share/nginx/html/assets

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 