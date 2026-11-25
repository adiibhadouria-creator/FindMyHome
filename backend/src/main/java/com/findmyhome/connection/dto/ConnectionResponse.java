package com.findmyhome.connection.dto;

import com.findmyhome.connection.model.ConnectionRequest;
import com.findmyhome.connection.model.ConnectionStatus;
import com.findmyhome.property.dto.PropertyResponse;
import com.findmyhome.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionResponse {

    private Long id;
    private UserResponse tenant;
    private PropertyResponse property;
    private String message;
    private ConnectionStatus status;
    private Instant createdAt;
    private Instant respondedAt;

    public static ConnectionResponse fromEntity(ConnectionRequest entity, boolean isAccepted) {
        if (entity == null) return null;

        // If request is accepted, contact details are unlocked
        boolean maskContact = !isAccepted;

        return ConnectionResponse.builder()
                .id(entity.getId())
                .tenant(UserResponse.fromEntity(entity.getTenant(), maskContact))
                .property(PropertyResponse.fromEntity(entity.getProperty(), maskContact, maskContact, 0.0))
                .message(entity.getMessage())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .respondedAt(entity.getRespondedAt())
                .build();
    }
}
