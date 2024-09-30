package utcn.ds.monitoring.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utcn.ds.monitoring.domain.Device;
import utcn.ds.monitoring.repository.DeviceRepository;


import java.nio.charset.StandardCharsets;


@Component
public class DeviceListener {

    @Autowired
    private DeviceRepository deviceRepository;

    @RabbitListener(queues = "deviceQueue")
    public void receiveDevice(byte[] message) {
        String decodedJson = new String(message, StandardCharsets.UTF_8);
        ObjectMapper objectMapper = new ObjectMapper();
        Device device = null;
        String replaced = decodedJson.replace("\\", "");
        try {
            device = objectMapper.readValue(replaced, Device.class);
            System.out.println("Received message: " + device.toString());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        deviceRepository.save(device);

    }
}
