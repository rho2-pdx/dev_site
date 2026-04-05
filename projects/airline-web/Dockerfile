FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first for better layer caching
RUN mvn dependency:resolve -B
COPY src ./src
RUN mvn package -DskipTests -B

# Jetty 12 does not enable any EE profile by default; WAR deployment requires EE10 modules.
# See https://github.com/jetty/jetty.docker/issues/200
FROM jetty:12.0-jdk17
RUN java -jar "$JETTY_HOME/start.jar" --add-modules=ee10-webapp,ee10-deploy,ee10-jsp,ee10-jstl
COPY --from=build /app/target/airline.war /var/lib/jetty/webapps/ROOT.war
EXPOSE 8080
