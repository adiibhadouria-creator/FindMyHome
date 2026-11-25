package com.findmyhome.connection.service;

import com.findmyhome.common.exception.BadRequestException;
import com.findmyhome.common.exception.ResourceNotFoundException;
import com.findmyhome.common.exception.UnauthorizedException;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.connection.dto.ConnectionCreateRequest;
import com.findmyhome.connection.dto.ConnectionResponse;
import com.findmyhome.connection.model.ConnectionRequest;
import com.findmyhome.connection.model.ConnectionStatus;
import com.findmyhome.connection.repository.ConnectionRequestRepository;
import com.findmyhome.property.model.Property;
import com.findmyhome.property.repository.PropertyRepository;
import com.findmyhome.user.model.User;
import com.findmyhome.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Transactional
    public ConnectionResponse sendConnectionRequest(Long propertyId, ConnectionCreateRequest request, UserPrincipal principal) {
        User tenant = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        if (property.getOwner().getId().equals(tenant.getId())) {
            throw new BadRequestException("You cannot send a connection request to your own property");
        }

        if (connectionRequestRepository.existsByTenantIdAndPropertyIdAndStatus(tenant.getId(), propertyId, ConnectionStatus.PENDING)) {
            throw new BadRequestException("A pending connection request already exists for this property");
        }

        ConnectionRequest connectionRequest = ConnectionRequest.builder()
                .tenant(tenant)
                .property(property)
                .message(request != null ? request.getMessage() : "")
                .status(ConnectionStatus.PENDING)
                .build();

        ConnectionRequest saved = connectionRequestRepository.save(connectionRequest);
        return ConnectionResponse.fromEntity(saved, false);
    }

    @Transactional
    public ConnectionResponse acceptConnectionRequest(Long requestId, UserPrincipal principal) {
        ConnectionRequest connectionRequest = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connectionRequest.getProperty().getOwner().getId().equals(principal.getId())) {
            throw new UnauthorizedException("Only the property owner can accept this connection request");
        }

        if (connectionRequest.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException("This connection request is already " + connectionRequest.getStatus());
        }

        connectionRequest.setStatus(ConnectionStatus.ACCEPTED);
        connectionRequest.setRespondedAt(Instant.now());

        ConnectionRequest saved = connectionRequestRepository.save(connectionRequest);
        return ConnectionResponse.fromEntity(saved, true);
    }

    @Transactional
    public ConnectionResponse rejectConnectionRequest(Long requestId, UserPrincipal principal) {
        ConnectionRequest connectionRequest = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connectionRequest.getProperty().getOwner().getId().equals(principal.getId())) {
            throw new UnauthorizedException("Only the property owner can reject this connection request");
        }

        if (connectionRequest.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException("This connection request is already " + connectionRequest.getStatus());
        }

        connectionRequest.setStatus(ConnectionStatus.REJECTED);
        connectionRequest.setRespondedAt(Instant.now());

        ConnectionRequest saved = connectionRequestRepository.save(connectionRequest);
        return ConnectionResponse.fromEntity(saved, false);
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getIncomingRequests(UserPrincipal principal) {
        List<ConnectionRequest> requests = connectionRequestRepository.findByOwnerId(principal.getId());
        return requests.stream()
                .map(r -> ConnectionResponse.fromEntity(r, r.getStatus() == ConnectionStatus.ACCEPTED))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getOutgoingRequests(UserPrincipal principal) {
        List<ConnectionRequest> requests = connectionRequestRepository.findByTenantId(principal.getId());
        return requests.stream()
                .map(r -> ConnectionResponse.fromEntity(r, r.getStatus() == ConnectionStatus.ACCEPTED))
                .toList();
    }
}
