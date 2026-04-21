# Base image
FROM node:20-alpine

# Set work directory
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy project
COPY frontend/ ./

# Build the project
RUN npm run build

# Expose port
EXPOSE 3000

# Start application with dynamic port for Railway
CMD ["sh", "-c", "npm start -- -p ${PORT:-3000}"]
