# FROM node:18-alpine
# WORKDIR /src
# COPY package.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# COPY .next ./.next
# CMD [ "npm", "run", "dev" ]


# Use official Node.js LTS image
FROM node:18-alpine

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project (excluding files in .dockerignore)
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Build the Next.js app
RUN npm run build

COPY .next ./.next

# Start the application
CMD ["npm", "run", "start"]
