package com.findmyhome.property.dto;

import com.findmyhome.property.model.FurnishingStatus;
import com.findmyhome.property.model.GenderPreference;
import com.findmyhome.property.model.Property;
import com.findmyhome.property.model.PropertyStatus;
import com.findmyhome.property.model.PropertyType;
import com.findmyhome.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {

    private Long id;
    private UserResponse owner;
    private String title;
    private String description;
    private PropertyType propertyType;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
    private Integer bedrooms;
    private Integer bathrooms;
    private FurnishingStatus furnishingStatus;
    private GenderPreference genderPreference;
    private Boolean bachelorFriendly;
    private String amenities;
    private String photoUrls;
    private PropertyStatus status;
    private Double averageRating;
    private Instant createdAt;

    public static PropertyResponse fromEntity(Property property, boolean maskAddress, boolean maskOwnerContact, Double averageRating) {
        if (property == null) return null;

        String address = maskAddress
                ? "Locality in " + property.getCity() + " (Connect with owner to view exact address)"
                : property.getAddressLine();

        return PropertyResponse.builder()
                .id(property.getId())
                .owner(UserResponse.fromEntity(property.getOwner(), maskOwnerContact))
                .title(property.getTitle())
                .description(property.getDescription())
                .propertyType(property.getPropertyType())
                .addressLine(address)
                .city(property.getCity())
                .state(property.getState())
                .pincode(property.getPincode())
                .rentAmount(property.getRentAmount())
                .depositAmount(property.getDepositAmount())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .furnishingStatus(property.getFurnishingStatus())
                .genderPreference(property.getGenderPreference())
                .bachelorFriendly(property.getBachelorFriendly())
                .amenities(property.getAmenities())
                .photoUrls(property.getPhotoUrls())
                .status(property.getStatus())
                .averageRating(averageRating != null ? averageRating : 0.0)
                .createdAt(property.getCreatedAt())
                .build();
    }
}
