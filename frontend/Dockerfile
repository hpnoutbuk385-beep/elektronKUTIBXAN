# Base image
FROM node:18-alpine

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
