package utcn.ds.monitoring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utcn.ds.monitoring.domain.HourMeasurement;
import utcn.ds.monitoring.domain.Measurement;

import java.util.List;
import java.util.UUID;

@Repository
public interface MeasurementRepository extends JpaRepository<HourMeasurement, UUID> {

    List<HourMeasurement> findByDeviceId(UUID deviceId);
}
