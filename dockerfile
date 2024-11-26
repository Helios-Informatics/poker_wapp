# Dockerfile for Scala backend
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy your JAR package from the /lib directory
COPY ../lib/poker_3-1.0.1.jar ./app.jar

# Expose the port your backend runs on
EXPOSE 8080

# Run the Scala application
CMD ["java", "-jar", "app.jar"]
