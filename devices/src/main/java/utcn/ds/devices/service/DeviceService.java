package utcn.ds.devices.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utcn.ds.devices.domain.Device;
import utcn.ds.devices.repository.DeviceRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class DeviceService {
    private final DeviceRepository deviceRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public Device createDevice(Device device) {
        Device savedDevice = deviceRepository.save(device);
        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("id", savedDevice.getId());
        messageMap.put("maxHourlyEnergyConsumption", savedDevice.getMaxHourlyEnergyConsumption());
        String jsonMessage = null;
        try {
            jsonMessage = objectMapper.writeValueAsString(messageMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        System.out.println("Sending message: " + jsonMessage);
        rabbitTemplate.convertAndSend("exchange", "device_routingKey", jsonMessage.getBytes());
        return savedDevice;
    }

    public Optional<Device> getDeviceById(UUID id) {
        return deviceRepository.findById(id);
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Device updateDevice(UUID id, Device updatedDevice) {
        Optional<Device> existingDevice = deviceRepository.findById(id);
        if (existingDevice.isPresent()) {
            updatedDevice.setId(existingDevice.get().getId());

            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("id", updatedDevice.getId());
            messageMap.put("maxHourlyEnergyConsumption", updatedDevice.getMaxHourlyEnergyConsumption());
            String jsonMessage = null;
            try {
                jsonMessage = objectMapper.writeValueAsString(messageMap);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            System.out.println("Sending message: " + jsonMessage);
            rabbitTemplate.convertAndSend("exchange", "device_routingKey", jsonMessage.getBytes());
            return deviceRepository.save(updatedDevice);
        }
        return null;
    }

    public void deleteDevice(UUID id) {
        deviceRepository.deleteById(id);
    }

    public ArrayList<Device> findByPersonUsername(String username) {
        Optional <ArrayList<Device>> devices = deviceRepository.findByPersonUsername(username);
        return devices.orElseGet(ArrayList::new);
    }

    public void updatePersonUsernameToEmpty(String username) {
        deviceRepository.updatePersonUsernameToEmpty(username);
    }

    public void updatePersonUsernameToNew(String username, String newUsername) {
        deviceRepository.updatePesonUsernameToNew(username, newUsername);
    }
}