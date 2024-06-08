# Use an official Node.js 18 (latest) runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

RUN mkdir -p /usr/src/app/public/file && chmod -R 755 /usr/src/app/public
# Expose the port the app runs on
EXPOSE 4000

# Define the environment variables
ENV MONGO_URI=""
ENV PORT=3000

# Command to run the application
CMD [ "npm", "start" ]
