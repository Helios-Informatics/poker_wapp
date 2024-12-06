FROM hseeberger/scala-sbt:17.0.2_1.6.2_3.1.1
WORKDIR /app

# Copy build definition files
COPY build.sbt .
COPY project ./project
COPY conf ./conf
COPY lib ./lib

# Resolve dependencies
RUN sbt update

# Copy the rest of the application code
COPY . .

ENV JAVA_OPTS="-Xms128M -Xmx256M -XX:+UseG1GC"
# Set the default command to run the backend
CMD ["sbt", "run"]
