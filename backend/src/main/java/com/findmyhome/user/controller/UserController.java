package com.findmyhome.user.controller;

import com.findmyhome.common.dto.ApiResponse;
import com.findmyhome.config.security.UserPrincipal;
import com.findmyhome.user.dto.UserResponse;
import com.findmyhome.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = userService.getCurrentUserProfile(principal);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}/public")
    public ResponseEntity<ApiResponse<UserResponse>> getUserPublicProfile(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = userService.getUserProfile(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
