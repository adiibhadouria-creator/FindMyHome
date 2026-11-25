package com.findmyhome.review.model;

import com.findmyhome.common.entity.BaseEntity;
import com.findmyhome.property.model.Property;
import com.findmyhome.stay.model.Stay;
import com.findmyhome.user.model.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews", uniqueConstraints = {
    @UniqueConstraint(
        name = "uk_stay_author_target_type",
        columnNames = {"stay_id", "author_id", "target_type"}
    )
}, indexes = {
    @Index(name = "idx_review_property", columnList = "target_property_id"),
    @Index(name = "idx_review_user", columnList = "target_user_id"),
    @Index(name = "idx_review_stay", columnList = "stay_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stay_id", nullable = false)
    private Stay stay;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 20)
    private ReviewTargetType targetType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user_id")
    private User targetUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_property_id")
    private Property targetProperty;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "title", length = 150)
    private String title;

    @Column(name = "comment", columnDefinition = "TEXT", nullable = false)
    private String comment;

    @Column(name = "cleanliness_rating")
    private Integer cleanlinessRating;

    @Column(name = "communication_rating")
    private Integer communicationRating;
}
