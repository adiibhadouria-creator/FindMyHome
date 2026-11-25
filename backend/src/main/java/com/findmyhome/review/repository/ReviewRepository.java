package com.findmyhome.review.repository;

import com.findmyhome.review.model.Review;
import com.findmyhome.review.model.ReviewTargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByStayIdAndAuthorIdAndTargetType(Long stayId, Long authorId, ReviewTargetType targetType);

    List<Review> findByTargetPropertyId(Long propertyId);

    List<Review> findByTargetUserId(Long userId);

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0.0)
        FROM Review r
        WHERE r.targetProperty.id = :propertyId
    """)
    Double getAverageRatingForProperty(@Param("propertyId") Long propertyId);

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0.0)
        FROM Review r
        WHERE r.targetUser.id = :userId
    """)
    Double getAverageRatingForUser(@Param("userId") Long userId);
}
