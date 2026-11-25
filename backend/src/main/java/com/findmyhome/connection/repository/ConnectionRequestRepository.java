package com.findmyhome.connection.repository;

import com.findmyhome.connection.model.ConnectionRequest;
import com.findmyhome.connection.model.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    List<ConnectionRequest> findByTenantId(Long tenantId);

    @Query("""
        SELECT cr FROM ConnectionRequest cr
        WHERE cr.property.owner.id = :ownerId
    """)
    List<ConnectionRequest> findByOwnerId(@Param("ownerId") Long ownerId);

    boolean existsByTenantIdAndPropertyIdAndStatus(Long tenantId, Long propertyId, ConnectionStatus status);

    @Query("""
        SELECT COUNT(cr) > 0 FROM ConnectionRequest cr
        WHERE ((cr.tenant.id = :user1Id AND cr.property.owner.id = :user2Id)
           OR  (cr.tenant.id = :user2Id AND cr.property.owner.id = :user1Id))
          AND cr.status = 'ACCEPTED'
    """)
    boolean areUsersConnected(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}
