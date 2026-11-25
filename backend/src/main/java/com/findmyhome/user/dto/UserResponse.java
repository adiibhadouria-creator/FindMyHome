package com.findmyhome.user.dto;

import com.findmyhome.user.model.Role;
import com.findmyhome.user.model.User;
import com.findmyhome.user.model.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private VerificationStatus verificationStatus;
    private String bio;
    private String profilePhotoUrl;
    private Double averageRating;
    private Integer totalReviews;
    private Instant createdAt;

    public static UserResponse fromEntity(User user, boolean masked, Double averageRating, Integer totalReviews) {
        if (user == null) return null;
        String email = masked ? maskEmail(user.getEmail()) : user.getEmail();
        String phone = masked ? maskPhone(user.getPhoneNumber()) : user.getPhoneNumber();

        return UserResponse.builder()
                .id(user.getId())
                .email(email)
                .fullName(user.getFullName())
                .phoneNumber(phone)
                .role(user.getRole())
                .verificationStatus(user.getVerificationStatus())
                .bio(user.getBio())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .averageRating(averageRating != null ? averageRating : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static UserResponse fromEntity(User user, boolean masked) {
        return fromEntity(user, masked, 0.0, 0);
    }

    private static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***@***.com";
        String[] parts = email.split("@");
        String name = parts[0];
        String visible = name.length() > 2 ? name.substring(0, 2) : name.substring(0, 1);
        return visible + "****@" + parts[1];
    }

    private static String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "******";
        return "******" + phone.substring(phone.length() - 4);
    }
}
