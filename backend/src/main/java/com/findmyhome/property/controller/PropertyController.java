package com.findmyhome.property.controller;

import com.findmyhome.common.dto.ApiResponse;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.property.dto.PropertyCreateRequest;
import com.findmyhome.property.dto.PropertyResponse;
import com.findmyhome.property.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @Valid @RequestBody PropertyCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        PropertyResponse response = propertyService.createProperty(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Property listed successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        PropertyResponse response = propertyService.getPropertyById(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) Boolean bachelorFriendly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<PropertyResponse> result = propertyService.searchProperties(
                city, minRent, maxRent, bachelorFriendly, pageRequest
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getMyProperties(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<PropertyResponse> properties = propertyService.getMyProperties(principal);
        return ResponseEntity.ok(ApiResponse.ok(properties));
    }
}
