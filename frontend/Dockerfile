FROM node:22-alpine

WORKDIR /app

# Copy package.json only since package-lock.json does not exist yet
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 5173

# Start the application with --host to expose to network
CMD ["npm", "run", "dev", "--", "--host"]
