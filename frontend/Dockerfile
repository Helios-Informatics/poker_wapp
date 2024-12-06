# Stage 1: Build the Vue app
FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files and build
COPY . .
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:stable-alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
