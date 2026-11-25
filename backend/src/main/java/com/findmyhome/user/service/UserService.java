package com.findmyhome.user.service;

import com.findmyhome.common.exception.ResourceNotFoundException;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.connection.repository.ConnectionRequestRepository;
import com.findmyhome.user.dto.UserResponse;
import com.findmyhome.user.model.User;
import com.findmyhome.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final com.findmyhome.review.repository.ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Double avgRating = reviewRepository.getAverageRatingForUser(user.getId());
        int reviewCount = reviewRepository.findByTargetUserId(user.getId()).size();
        return UserResponse.fromEntity(user, false, avgRating, reviewCount);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long targetUserId, UserPrincipal principal) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Double avgRating = reviewRepository.getAverageRatingForUser(targetUser.getId());
        int reviewCount = reviewRepository.findByTargetUserId(targetUser.getId()).size();

        if (principal == null) {
            // Unauthenticated: always mask
            return UserResponse.fromEntity(targetUser, true, avgRating, reviewCount);
        }

        if (principal.getId().equals(targetUserId)) {
            // Self: never mask
            return UserResponse.fromEntity(targetUser, false, avgRating, reviewCount);
        }

        // Check if an accepted connection exists between them
        boolean connected = connectionRequestRepository.areUsersConnected(principal.getId(), targetUserId);
        return UserResponse.fromEntity(targetUser, !connected, avgRating, reviewCount);
    }
}
