# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]