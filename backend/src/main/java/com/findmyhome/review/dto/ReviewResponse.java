package com.findmyhome.review.dto;

import com.findmyhome.review.model.Review;
import com.findmyhome.review.model.ReviewTargetType;
import com.findmyhome.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Long stayId;
    private UserResponse author;
    private ReviewTargetType targetType;
    private Long targetPropertyId;
    private Long targetUserId;
    private Integer rating;
    private String title;
    private String comment;
    private Integer cleanlinessRating;
    private Integer communicationRating;
    private Instant createdAt;

    public static ReviewResponse fromEntity(Review review) {
        if (review == null) return null;

        return ReviewResponse.builder()
                .id(review.getId())
                .stayId(review.getStay().getId())
                .author(UserResponse.fromEntity(review.getAuthor(), false))
                .targetType(review.getTargetType())
                .targetPropertyId(review.getTargetProperty() != null ? review.getTargetProperty().getId() : null)
                .targetUserId(review.getTargetUser() != null ? review.getTargetUser().getId() : null)
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .cleanlinessRating(review.getCleanlinessRating())
                .communicationRating(review.getCommunicationRating())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
