package utcn.ds.monitoring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utcn.ds.monitoring.domain.HourMeasurement;
import utcn.ds.monitoring.service.MeasurementService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/monitoring")
@CrossOrigin(origins = "http://localhost:3000")
public class MeasurementController {

    @Autowired
    public MeasurementService measurementService;

    public MeasurementController(MeasurementService measurementService) {
        this.measurementService = measurementService;
    }

    @RequestMapping("/getHourlyEnergyConsumption")
    public List<HourMeasurement> getHourlyEnergyConsumption() {
        return measurementService.findAll();
    }

}
