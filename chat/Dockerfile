FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package -DskipTests

FROM openjdk:17
WORKDIR /app
COPY --from=build /app/target/chat-0.0.1-SNAPSHOT.jar /app/chat-0.0.1-SNAPSHOT.jar
EXPOSE 8085
CMD ["java", "-jar", "chat-0.0.1-SNAPSHOT.jar"]
