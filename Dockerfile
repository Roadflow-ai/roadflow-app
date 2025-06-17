FROM node:23.0.0

# Create app directory
WORKDIR /app



# Copy only package metadata to leverage Docker cache
COPY package*.json  ./


# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .


# Build Nuxt app
RUN npm run build

# Expose port
EXPOSE 8080

# Run Nuxt app
CMD ["node", ".output/server/index.mjs"]
