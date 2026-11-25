package com.findmyhome.review.service;

import com.findmyhome.common.exception.BadRequestException;
import com.findmyhome.common.exception.ResourceNotFoundException;
import com.findmyhome.common.exception.UnauthorizedException;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.review.dto.ReviewCreateRequest;
import com.findmyhome.review.dto.ReviewResponse;
import com.findmyhome.review.model.Review;
import com.findmyhome.review.model.ReviewTargetType;
import com.findmyhome.review.repository.ReviewRepository;
import com.findmyhome.stay.model.Stay;
import com.findmyhome.stay.model.StayStatus;
import com.findmyhome.stay.repository.StayRepository;
import com.findmyhome.user.model.User;
import com.findmyhome.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final StayRepository stayRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse submitReview(Long stayId, ReviewCreateRequest request, UserPrincipal principal) {
        Stay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Stay not found"));

        if (!stay.isEligibleForReview()) {
            throw new BadRequestException("Reviews can only be submitted for COMPLETED stays (current status: " + stay.getStatus() + ")");
        }

        User author = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isTenant = stay.getTenant().getId().equals(author.getId());
        boolean isOwner = stay.getOwner().getId().equals(author.getId());

        if (!isTenant && !isOwner) {
            throw new UnauthorizedException("You were not a verified participant in this stay");
        }

        // Validate target eligibility based on role
        Review.ReviewBuilder reviewBuilder = Review.builder()
                .stay(stay)
                .author(author)
                .targetType(request.getTargetType())
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .cleanlinessRating(request.getCleanlinessRating())
                .communicationRating(request.getCommunicationRating());

        if (isTenant) {
            if (request.getTargetType() == ReviewTargetType.PROPERTY) {
                reviewBuilder.targetProperty(stay.getProperty());
            } else if (request.getTargetType() == ReviewTargetType.OWNER) {
                reviewBuilder.targetUser(stay.getOwner());
            } else {
                throw new BadRequestException("As a tenant, you may only review the PROPERTY or the OWNER");
            }
        } else {
            // isOwner
            if (request.getTargetType() == ReviewTargetType.TENANT) {
                reviewBuilder.targetUser(stay.getTenant());
            } else {
                throw new BadRequestException("As an owner, you may only review the TENANT");
            }
        }

        // Duplicate prevention check
        if (reviewRepository.existsByStayIdAndAuthorIdAndTargetType(stayId, author.getId(), request.getTargetType())) {
            throw new BadRequestException("You have already submitted a review for this target regarding this stay");
        }

        Review saved = reviewRepository.save(reviewBuilder.build());
        return ReviewResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getPropertyReviews(Long propertyId) {
        List<Review> reviews = reviewRepository.findByTargetPropertyId(propertyId);
        return reviews.stream().map(ReviewResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getUserReviews(Long userId) {
        List<Review> reviews = reviewRepository.findByTargetUserId(userId);
        return reviews.stream().map(ReviewResponse::fromEntity).toList();
    }
}
