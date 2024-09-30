package utcn.ds.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static java.lang.Thread.sleep;

@Component
public class Simulator {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${device.id}")
    private UUID deviceId;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private BufferedReader br;

    public Simulator() {
        try {
            br = new BufferedReader(new FileReader("app/sensor.csv"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @Scheduled(fixedDelay = 10000) // Every 10 minutes
    public void simulateMeterReading() {
        try {
            String line = br.readLine();
            long timestamp = Instant.now().toEpochMilli();

            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("timestamp", timestamp);
            messageMap.put("deviceId", deviceId);
            messageMap.put("measurementValue", Double.parseDouble(line));

            String jsonMessage = objectMapper.writeValueAsString(messageMap);
            System.out.println("Sending message: " + jsonMessage);
            rabbitTemplate.convertAndSend("exchange", "measurement_routingKey", jsonMessage.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
