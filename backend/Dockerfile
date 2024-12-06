FROM hseeberger/scala-sbt:17.0.2_1.6.2_3.1.1
WORKDIR /app

# Set JVM memory options for sbt during build
ENV SBT_OPTS="-Xms128M -Xmx256M -XX:+UseG1GC"

# Copy build definition files
COPY build.sbt .
COPY project ./project
COPY conf ./conf
COPY lib ./lib

# Resolve dependencies with limited memory
RUN sbt update

# Copy the rest of the application code
COPY . .

# Set the default command to run the backend
CMD ["sbt", "run"]
