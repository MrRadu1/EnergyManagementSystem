package utcn.ds.monitoring.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import utcn.ds.monitoring.controller.WebSocketController;
import utcn.ds.monitoring.domain.HourMeasurement;
import utcn.ds.monitoring.domain.Measurement;
import utcn.ds.monitoring.repository.DeviceRepository;
import utcn.ds.monitoring.repository.MeasurementRepository;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MeasurementService {

    private final MeasurementRepository measurementRepository;

    private final DeviceRepository deviceRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();



    private final WebSocketController webSocketController;

    public static HashMap<UUID, List<Measurement>> values = new HashMap<>();

    public MeasurementService(MeasurementRepository measurementRepository, DeviceRepository deviceRepository, WebSocketController webSocketController) {
        this.measurementRepository = measurementRepository;
        this.deviceRepository = deviceRepository;
        this.webSocketController =  webSocketController;
    }


    public void checkMeasurement(UUID deviceId) {

        if (values.get(deviceId).size() == 6) {
            Measurement firstM = values.get(deviceId).get(0);
            Measurement lastM = values.get(deviceId).get(5);
            double value = lastM.getMeasurementValue()-firstM.getMeasurementValue();
            HourMeasurement hourMeasurement = HourMeasurement.builder()
                            .deviceId(deviceId)
                            .hour(lastM.getTimestamp())
                            .measurementValue(value)
                            .build();
            measurementRepository.save(hourMeasurement);
            sendMessageOverWebSocket(hourMeasurement);
            values.get(deviceId).clear();
        }
    }

    public List<HourMeasurement> getbyDeviceId(UUID deviceId) {
        List<HourMeasurement> hourMeasurements = measurementRepository.findByDeviceId(deviceId);
        Collections.sort(hourMeasurements, Comparator.comparing(HourMeasurement::getHour));
        return hourMeasurements;
    }

    public List<HourMeasurement> findAll() {
        return measurementRepository.findAll();
    }

    public void sendMessageOverWebSocket(HourMeasurement message) {
        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("id", message.getId());
        messageMap.put("deviceId", message.getDeviceId());
        messageMap.put("hour", message.getHour());
        messageMap.put("measurementValue", message.getMeasurementValue());
        String jsonMessage = null;
        try {
            jsonMessage = objectMapper.writeValueAsString(messageMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        webSocketController.send(jsonMessage);
    }

}
