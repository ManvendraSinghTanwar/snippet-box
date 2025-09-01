FROM node:20-alpine

WORKDIR /app

# Copy package files and install server dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Install client dependencies and build everything
RUN mkdir -p ./public ./data \
    && cd client \
    && npm install \
    && npm run build:legacy \
    && cd .. \
    && cp -r client/build/* public/ \
    && npm run build:tsc

# Clean up src files
RUN rm -rf src/ ./client \
    && npm prune --production

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "build/server.js"]