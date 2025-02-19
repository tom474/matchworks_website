FROM node:lts-alpine

WORKDIR /client

COPY . /client

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# Expose the port
EXPOSE 8080

# Start the application
ENTRYPOINT ["npm"]
CMD ["start", "--" , "--port", "8080"]
