package com.findmyhome.property.repository;

import com.findmyhome.property.model.Property;
import com.findmyhome.property.model.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByOwnerId(Long ownerId);

    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);

    @Query("""
        SELECT p FROM Property p
        WHERE p.status = :status
          AND (cast(:city as string) IS NULL OR LOWER(p.city) = LOWER(cast(:city as string)))
          AND (:minRent IS NULL OR p.rentAmount >= :minRent)
          AND (:maxRent IS NULL OR p.rentAmount <= :maxRent)
          AND (:bachelorFriendly IS NULL OR p.bachelorFriendly = :bachelorFriendly)
    """)
    Page<Property> searchProperties(
        @Param("status") PropertyStatus status,
        @Param("city") String city,
        @Param("minRent") BigDecimal minRent,
        @Param("maxRent") BigDecimal maxRent,
        @Param("bachelorFriendly") Boolean bachelorFriendly,
        Pageable pageable
    );
}
