FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package -DskipTests

FROM openjdk:17
WORKDIR /app
COPY --from=build /app/target/devices-0.0.1-SNAPSHOT.jar /app/devices-0.0.1-SNAPSHOT.jar
EXPOSE 8081
CMD ["java", "-jar", "devices-0.0.1-SNAPSHOT.jar"]
