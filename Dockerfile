# Use the official Node.js image from the Docker Hub
FROM node:18-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the project files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the environment variables
ENV MONGODB_URL=""
ENV PORT=3000

# Command to run the application
CMD ["node", "app.js"]
