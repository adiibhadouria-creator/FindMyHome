package com.findmyhome.stay.controller;

import com.findmyhome.common.dto.ApiResponse;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.stay.dto.StayCreateRequest;
import com.findmyhome.stay.dto.StayResponse;
import com.findmyhome.stay.service.StayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/stays")
@RequiredArgsConstructor
public class StayController {

    private final StayService stayService;

    @PostMapping
    public ResponseEntity<ApiResponse<StayResponse>> createStay(
            @Valid @RequestBody StayCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        StayResponse response = stayService.createStay(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Stay created successfully"));
    }

    @PutMapping("/{id}/confirm-move-in")
    public ResponseEntity<ApiResponse<StayResponse>> confirmMoveIn(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        StayResponse response = stayService.confirmMoveIn(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(response, "Move-in confirmation recorded"));
    }

    @PutMapping("/{id}/confirm-move-out")
    public ResponseEntity<ApiResponse<StayResponse>> confirmMoveOut(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        StayResponse response = stayService.confirmMoveOut(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(response, "Move-out confirmation recorded"));
    }

    @PostMapping("/{id}/dispute")
    public ResponseEntity<ApiResponse<StayResponse>> disputeStay(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String reason = body.getOrDefault("reason", "Dispute raised");
        StayResponse response = stayService.disputeStay(id, reason, principal);
        return ResponseEntity.ok(ApiResponse.ok(response, "Stay has been moved to DISPUTED status"));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<StayResponse>>> getMyStays(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<StayResponse> stays = stayService.getMyStays(principal);
        return ResponseEntity.ok(ApiResponse.ok(stays));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StayResponse>> getStay(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        StayResponse response = stayService.getStayById(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
