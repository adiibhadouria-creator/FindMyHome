package com.findmyhome.property.dto;

import com.findmyhome.property.model.FurnishingStatus;
import com.findmyhome.property.model.GenderPreference;
import com.findmyhome.property.model.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @NotBlank(message = "Address line is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotNull(message = "Rent amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rent must be greater than zero")
    private BigDecimal rentAmount;

    @NotNull(message = "Deposit amount is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Deposit cannot be negative")
    private BigDecimal depositAmount;

    @NotNull(message = "Bedrooms count is required")
    @Min(value = 1, message = "Must have at least 1 bedroom")
    private Integer bedrooms;

    @NotNull(message = "Bathrooms count is required")
    @Min(value = 1, message = "Must have at least 1 bathroom")
    private Integer bathrooms;

    @NotNull(message = "Furnishing status is required")
    private FurnishingStatus furnishingStatus;

    private GenderPreference genderPreference = GenderPreference.ANY;

    private Boolean bachelorFriendly = true;

    private String amenities;

    private String photoUrls;
}
