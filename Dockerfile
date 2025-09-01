FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install client dependencies and build
RUN mkdir -p ./public ./data \
    && cd client \
    && npm install

# Build with legacy OpenSSL provider for Node 18+
RUN npm run build:client:linux \
    && npm run build:tsc

# Clean up src files
RUN rm -rf src/ ./client \
    && npm prune --production

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "build/server.js"]