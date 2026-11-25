package com.findmyhome.property.service;

import com.findmyhome.common.exception.ResourceNotFoundException;
import com.findmyhome.common.exception.UnauthorizedException;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.connection.repository.ConnectionRequestRepository;
import com.findmyhome.property.dto.PropertyCreateRequest;
import com.findmyhome.property.dto.PropertyResponse;
import com.findmyhome.property.model.Property;
import com.findmyhome.property.model.PropertyStatus;
import com.findmyhome.property.repository.PropertyRepository;
import com.findmyhome.review.repository.ReviewRepository;
import com.findmyhome.user.model.Role;
import com.findmyhome.user.model.User;
import com.findmyhome.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public PropertyResponse createProperty(PropertyCreateRequest request, UserPrincipal principal) {
        User owner = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (owner.getRole() != Role.ROLE_OWNER && owner.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("Only property owners can create property listings");
        }

        Property property = Property.builder()
                .owner(owner)
                .title(request.getTitle())
                .description(request.getDescription())
                .propertyType(request.getPropertyType())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .rentAmount(request.getRentAmount())
                .depositAmount(request.getDepositAmount())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .furnishingStatus(request.getFurnishingStatus())
                .genderPreference(request.getGenderPreference())
                .bachelorFriendly(request.getBachelorFriendly())
                .amenities(request.getAmenities())
                .photoUrls(request.getPhotoUrls())
                .status(PropertyStatus.AVAILABLE)
                .build();

        Property saved = propertyRepository.save(property);
        return PropertyResponse.fromEntity(saved, false, false, 0.0);
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id, UserPrincipal principal) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        boolean isOwner = principal != null && property.getOwner().getId().equals(principal.getId());
        boolean isConnected = false;
        if (principal != null && !isOwner) {
            isConnected = connectionRequestRepository.areUsersConnected(principal.getId(), property.getOwner().getId());
        }

        boolean maskAddress = !isOwner && !isConnected;
        boolean maskOwnerContact = !isOwner && !isConnected;
        Double averageRating = reviewRepository.getAverageRatingForProperty(property.getId());

        return PropertyResponse.fromEntity(property, maskAddress, maskOwnerContact, averageRating);
    }

    @Transactional(readOnly = true)
    public Page<PropertyResponse> searchProperties(
            String city,
            BigDecimal minRent,
            BigDecimal maxRent,
            Boolean bachelorFriendly,
            Pageable pageable) {

        Page<Property> properties = propertyRepository.searchProperties(
                PropertyStatus.AVAILABLE,
                city,
                minRent,
                maxRent,
                bachelorFriendly,
                pageable
        );

        return properties.map(p -> {
            Double avgRating = reviewRepository.getAverageRatingForProperty(p.getId());
            return PropertyResponse.fromEntity(p, true, true, avgRating);
        });
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getMyProperties(UserPrincipal principal) {
        List<Property> properties = propertyRepository.findByOwnerId(principal.getId());
        return properties.stream().map(p -> {
            Double avgRating = reviewRepository.getAverageRatingForProperty(p.getId());
            return PropertyResponse.fromEntity(p, false, false, avgRating);
        }).toList();
    }
}
