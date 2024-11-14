# Use a Node.js image
FROM node:18

# Create a working directory
WORKDIR /app

# Copy application files
COPY package*.json ./
RUN npm install
COPY . .

# Expose the application port
EXPOSE 8100

# Command to start the application
CMD ["node", "src/app.js"]
