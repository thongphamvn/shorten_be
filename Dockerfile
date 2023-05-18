
# Use a base image with Node.js installed
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci --only=production

# Copy the built application files to the working directory
COPY dist/ ./dist/

# Expose the port on which your NestJS application runs (change it if necessary)
EXPOSE 3000

# Set the command to start your NestJS application
CMD ["npm", "run", "start:prod"]
