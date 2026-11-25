package com.findmyhome.stay.dto;

import com.findmyhome.property.dto.PropertyResponse;
import com.findmyhome.stay.model.Stay;
import com.findmyhome.stay.model.StayStatus;
import com.findmyhome.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StayResponse {

    private Long id;
    private PropertyResponse property;
    private UserResponse tenant;
    private UserResponse owner;
    private LocalDate startDate;
    private LocalDate endDate;
    private StayStatus status;
    private Boolean tenantConfirmedMoveIn;
    private Boolean ownerConfirmedMoveIn;
    private Boolean tenantConfirmedMoveOut;
    private Boolean ownerConfirmedMoveOut;
    private String disputeReason;
    private boolean eligibleForReview;
    private Instant createdAt;

    public static StayResponse fromEntity(Stay stay) {
        if (stay == null) return null;

        return StayResponse.builder()
                .id(stay.getId())
                .property(PropertyResponse.fromEntity(stay.getProperty(), false, false, 0.0))
                .tenant(UserResponse.fromEntity(stay.getTenant(), false))
                .owner(UserResponse.fromEntity(stay.getOwner(), false))
                .startDate(stay.getStartDate())
                .endDate(stay.getEndDate())
                .status(stay.getStatus())
                .tenantConfirmedMoveIn(stay.getTenantConfirmedMoveIn())
                .ownerConfirmedMoveIn(stay.getOwnerConfirmedMoveIn())
                .tenantConfirmedMoveOut(stay.getTenantConfirmedMoveOut())
                .ownerConfirmedMoveOut(stay.getOwnerConfirmedMoveOut())
                .disputeReason(stay.getDisputeReason())
                .eligibleForReview(stay.isEligibleForReview())
                .createdAt(stay.getCreatedAt())
                .build();
    }
}
