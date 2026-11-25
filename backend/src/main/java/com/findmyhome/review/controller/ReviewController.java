package com.findmyhome.review.controller;

import com.findmyhome.common.dto.ApiResponse;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.review.dto.ReviewCreateRequest;
import com.findmyhome.review.dto.ReviewResponse;
import com.findmyhome.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/stays/{stayId}/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @PathVariable Long stayId,
            @Valid @RequestBody ReviewCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ReviewResponse response = reviewService.submitReview(stayId, request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Verified review submitted successfully"));
    }

    @GetMapping("/properties/{propertyId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getPropertyReviews(
            @PathVariable Long propertyId) {
        List<ReviewResponse> reviews = reviewService.getPropertyReviews(propertyId);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getUserReviews(
            @PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }
}
