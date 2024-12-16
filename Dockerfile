# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --chown=node:node package.json yarn.lock .env ./
COPY --chown=node:node ./build ./build

# Install prod dependencies
RUN yarn install 
# --production

# Expose the port your Express app runs on (default: 3000)
EXPOSE 5001

# Define the command to run your application
CMD ["yarn", "start"]
