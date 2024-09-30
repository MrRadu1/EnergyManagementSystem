package utcn.ds.devices.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utcn.ds.devices.domain.Device;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {
    Optional<ArrayList<Device>> findByPersonUsername(String username);

    @Modifying
    @Query("UPDATE Device d SET d.personUsername = '' WHERE d.personUsername = :paramValue")
    void updatePersonUsernameToEmpty(@Param("paramValue") String paramValue);
    @Modifying
    @Query("UPDATE Device d SET d.personUsername = :newUsername WHERE d.personUsername = :username")
    void updatePesonUsernameToNew(@Param("username") String username, @Param("newUsername") String newUsername);
}
