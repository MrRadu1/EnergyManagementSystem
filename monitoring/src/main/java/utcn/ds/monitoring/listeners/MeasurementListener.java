package utcn.ds.monitoring.listeners;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utcn.ds.monitoring.domain.Measurement;
import utcn.ds.monitoring.repository.MeasurementRepository;
import utcn.ds.monitoring.service.MeasurementService;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

import static utcn.ds.monitoring.service.MeasurementService.values;

@Component
public class MeasurementListener {

    @Autowired
    private MeasurementService meausementService;


    @RabbitListener(queues = "measurementQueue")
    public void receiveMeasurement(byte[] message) {
        try {
            String decoded = new String(message, StandardCharsets.UTF_8);
            ObjectMapper objectMapper = new ObjectMapper();
            Measurement measurement = objectMapper.readValue(decoded.replace("\\", ""), Measurement.class);
            System.out.println("Received message: " + measurement.toString());
            if(!values.containsKey(measurement.getDeviceId())) {
                ArrayList<Measurement> list = new ArrayList<>();
                list.add(measurement);
                values.put(measurement.getDeviceId(), list);
            }
            else {
                values.get(measurement.getDeviceId()).add(measurement);
            }
            meausementService.checkMeasurement(measurement.getDeviceId());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
