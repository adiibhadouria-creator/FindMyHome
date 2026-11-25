# Stage 1: Build JAR using Maven and Java 21
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

# Stage 2: Minimal Runtime image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/findmyhome-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
