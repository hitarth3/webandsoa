# ==============================================================================
# Lab 6: User Service Dockerfile (Port 3001)
# ==============================================================================
FROM node:22-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose User Service internal/external port
EXPOSE 3001

# Environment variable defaults
ENV PORT=3001
ENV NODE_ENV=production

# Start the User Service
CMD ["node", "server.js"]
