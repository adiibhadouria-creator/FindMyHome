package com.findmyhome.connection.controller;

import com.findmyhome.common.dto.ApiResponse;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.connection.dto.ConnectionCreateRequest;
import com.findmyhome.connection.dto.ConnectionResponse;
import com.findmyhome.connection.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @PostMapping("/properties/{propertyId}")
    public ResponseEntity<ApiResponse<ConnectionResponse>> sendConnectionRequest(
            @PathVariable Long propertyId,
            @RequestBody(required = false) ConnectionCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ConnectionResponse response = connectionService.sendConnectionRequest(propertyId, request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Connection request sent successfully"));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ConnectionResponse>> acceptConnectionRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ConnectionResponse response = connectionService.acceptConnectionRequest(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(response, "Connection accepted! Contact information is now accessible."));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ConnectionResponse>> rejectConnectionRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ConnectionResponse response = connectionService.rejectConnectionRequest(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(response, "Connection request rejected"));
    }

    @GetMapping("/incoming")
    public ResponseEntity<ApiResponse<List<ConnectionResponse>>> getIncomingRequests(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ConnectionResponse> responses = connectionService.getIncomingRequests(principal);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @GetMapping("/outgoing")
    public ResponseEntity<ApiResponse<List<ConnectionResponse>>> getOutgoingRequests(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ConnectionResponse> responses = connectionService.getOutgoingRequests(principal);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }
}
