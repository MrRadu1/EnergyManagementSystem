package utcn.ds.devices.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utcn.ds.devices.domain.Device;
import utcn.ds.devices.service.DeviceService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/devices")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})

public class DeviceController {
    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping
    public Device createDevice(@RequestBody Device device) {
        return deviceService.createDevice(device);
    }

    @GetMapping("/{id}")
    public Optional<Device> getDeviceById(@PathVariable UUID id) {
        return deviceService.getDeviceById(id);
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @PutMapping("/{id}")
    public Device updateDevice(@PathVariable UUID id, @RequestBody Device updatedDevice) {
        return deviceService.updateDevice(id, updatedDevice);
    }

    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable UUID id) {
        deviceService.deleteDevice(id);
    }

    @GetMapping("/byPerson/{username}")
    public List<Device> findByPersonUsername(@PathVariable String username) {
        System.out.println("username: " + username);
        return deviceService.findByPersonUsername(username);
    }

    @PutMapping("/updatePersonUsernameToEmpty/{username}")
    public void updatePersonUsernameToEmpty(@PathVariable String username) {
        deviceService.updatePersonUsernameToEmpty(username);
    }

    @PutMapping("/updatePersonUsernameToNew/{username}/{newUsername}")
    public void updatePersonUsernameToNew(@PathVariable String username, @PathVariable String newUsername) {
        System.out.println("username: " + username + " newUsername: " + newUsername);
        deviceService.updatePersonUsernameToNew(username, newUsername);
    }
}
