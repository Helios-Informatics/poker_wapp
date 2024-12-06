# Use OpenJDK as the base image
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the pre-built ZIP from sbt dist
ADD target/universal/poker-1.0-SNAPSHOT.zip /app/

# Extract the ZIP file
RUN apt-get update && apt-get install -y unzip && \
    unzip poker-1.0-SNAPSHOT.zip && \
    rm poker-1.0-SNAPSHOT.zip && \
    apt-get remove -y unzip && apt-get autoremove -y

# Set the working directory to the extracted app
WORKDIR /app/poker-1.0-SNAPSHOT

# Expose the backend port
EXPOSE 9000

# Run the Play app
CMD ["bin/poker", "-Dplay.http.secret.key=8Z9yVMO7gJHSeZle3VsXUEJuzUk5LFne", "-Dhttp.port=9000"]
