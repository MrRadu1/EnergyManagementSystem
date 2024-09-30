package utcn.ds.monitoring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utcn.ds.monitoring.domain.Device;

import java.util.UUID;

@Repository
public interface  DeviceRepository extends JpaRepository<Device, UUID> {
}
