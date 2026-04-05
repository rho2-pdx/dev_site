FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first for better layer caching
RUN mvn dependency:resolve -B
COPY src ./src
RUN mvn package -DskipTests -B

FROM jetty:12.0-jdk17
COPY --from=build /app/target/airline.war /var/lib/jetty/webapps/ROOT.war
EXPOSE 8080
