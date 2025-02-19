FROM node:lts-alpine

WORKDIR /client

COPY . /client

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# Expose the port
EXPOSE 4173

# Start the application
ENTRYPOINT ["npx"]
CMD ["vite", "preview", "--host", "0.0.0.0"]
