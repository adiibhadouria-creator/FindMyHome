package com.findmyhome.stay.repository;

import com.findmyhome.stay.model.Stay;
import com.findmyhome.stay.model.StayStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StayRepository extends JpaRepository<Stay, Long> {

    List<Stay> findByTenantId(Long tenantId);

    List<Stay> findByOwnerId(Long ownerId);

    List<Stay> findByPropertyId(Long propertyId);

    boolean existsByTenantIdAndStatus(Long tenantId, StayStatus status);

    List<Stay> findByStatus(StayStatus status);
}
