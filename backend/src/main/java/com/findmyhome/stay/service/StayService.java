package com.findmyhome.stay.service;

import com.findmyhome.common.exception.BadRequestException;
import com.findmyhome.common.exception.ResourceNotFoundException;
import com.findmyhome.common.exception.UnauthorizedException;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.connection.repository.ConnectionRequestRepository;
import com.findmyhome.property.model.Property;
import com.findmyhome.property.model.PropertyStatus;
import com.findmyhome.property.repository.PropertyRepository;
import com.findmyhome.stay.dto.StayCreateRequest;
import com.findmyhome.stay.dto.StayResponse;
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
public class StayService {

    private final StayRepository stayRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ConnectionRequestRepository connectionRequestRepository;

    @Transactional
    public StayResponse createStay(StayCreateRequest request, UserPrincipal principal) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (!property.getOwner().getId().equals(principal.getId())) {
            throw new UnauthorizedException("Only the property owner can create a stay agreement");
        }

        User tenant = userRepository.findById(request.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

        // Verify that tenant and owner have an accepted connection
        boolean connected = connectionRequestRepository.areUsersConnected(tenant.getId(), principal.getId());
        if (!connected) {
            throw new BadRequestException("You must have an accepted connection with the tenant before creating a stay");
        }

        // Rule: A tenant can generally only have one active stay
        if (stayRepository.existsByTenantIdAndStatus(tenant.getId(), StayStatus.ACTIVE)) {
            throw new BadRequestException("Tenant already has an active stay");
        }

        Stay stay = Stay.builder()
                .property(property)
                .tenant(tenant)
                .owner(property.getOwner())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(StayStatus.ACCEPTED)
                .tenantConfirmedMoveIn(false)
                .ownerConfirmedMoveIn(false)
                .tenantConfirmedMoveOut(false)
                .ownerConfirmedMoveOut(false)
                .build();

        Stay saved = stayRepository.save(stay);
        return StayResponse.fromEntity(saved);
    }

    @Transactional
    public StayResponse confirmMoveIn(Long stayId, UserPrincipal principal) {
        Stay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Stay not found"));

        boolean isTenant = stay.getTenant().getId().equals(principal.getId());
        boolean isOwner = stay.getOwner().getId().equals(principal.getId());

        if (!isTenant && !isOwner) {
            throw new UnauthorizedException("You are not a participant in this stay");
        }

        if (stay.getStatus() != StayStatus.ACCEPTED && stay.getStatus() != StayStatus.REQUESTED) {
            throw new BadRequestException("Cannot confirm move-in when stay is already " + stay.getStatus());
        }

        if (isTenant) {
            stay.setTenantConfirmedMoveIn(true);
        }
        if (isOwner) {
            stay.setOwnerConfirmedMoveIn(true);
        }

        // Dual confirmation rule: If both parties confirm, transition to ACTIVE!
        if (Boolean.TRUE.equals(stay.getTenantConfirmedMoveIn()) && Boolean.TRUE.equals(stay.getOwnerConfirmedMoveIn())) {
            stay.setStatus(StayStatus.ACTIVE);
            stay.getProperty().setStatus(PropertyStatus.OCCUPIED);
        }

        Stay saved = stayRepository.save(stay);
        return StayResponse.fromEntity(saved);
    }

    @Transactional
    public StayResponse confirmMoveOut(Long stayId, UserPrincipal principal) {
        Stay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Stay not found"));

        boolean isTenant = stay.getTenant().getId().equals(principal.getId());
        boolean isOwner = stay.getOwner().getId().equals(principal.getId());

        if (!isTenant && !isOwner) {
            throw new UnauthorizedException("You are not a participant in this stay");
        }

        if (stay.getStatus() != StayStatus.ACTIVE) {
            throw new BadRequestException("Cannot confirm move-out because stay is not currently ACTIVE");
        }

        if (isTenant) {
            stay.setTenantConfirmedMoveOut(true);
        }
        if (isOwner) {
            stay.setOwnerConfirmedMoveOut(true);
        }

        // Dual confirmation rule: If both parties confirm, transition to COMPLETED!
        if (Boolean.TRUE.equals(stay.getTenantConfirmedMoveOut()) && Boolean.TRUE.equals(stay.getOwnerConfirmedMoveOut())) {
            stay.setStatus(StayStatus.COMPLETED);
            stay.getProperty().setStatus(PropertyStatus.AVAILABLE);
        }

        Stay saved = stayRepository.save(stay);
        return StayResponse.fromEntity(saved);
    }

    @Transactional
    public StayResponse disputeStay(Long stayId, String reason, UserPrincipal principal) {
        Stay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Stay not found"));

        boolean isParticipant = stay.getTenant().getId().equals(principal.getId()) ||
                               stay.getOwner().getId().equals(principal.getId());

        if (!isParticipant) {
            throw new UnauthorizedException("You are not a participant in this stay");
        }

        stay.setStatus(StayStatus.DISPUTED);
        stay.setDisputeReason(reason);

        Stay saved = stayRepository.save(stay);
        return StayResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<StayResponse> getMyStays(UserPrincipal principal) {
        List<Stay> tenantStays = stayRepository.findByTenantId(principal.getId());
        List<Stay> ownerStays = stayRepository.findByOwnerId(principal.getId());

        tenantStays.addAll(ownerStays);
        return tenantStays.stream().distinct().map(StayResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public StayResponse getStayById(Long id, UserPrincipal principal) {
        Stay stay = stayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stay not found"));

        boolean isParticipant = stay.getTenant().getId().equals(principal.getId()) ||
                               stay.getOwner().getId().equals(principal.getId());

        if (!isParticipant) {
            throw new UnauthorizedException("You do not have access to view this stay");
        }

        return StayResponse.fromEntity(stay);
    }
}
