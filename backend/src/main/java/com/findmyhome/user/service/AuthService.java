package com.findmyhome.user.service;

import com.findmyhome.common.exception.BadRequestException;
import com.findmyhome.config.security.JwtUtils;
import com.findmyhome.user.dto.AuthResponse;
import com.findmyhome.user.dto.LoginRequest;
import com.findmyhome.user.dto.RegisterRequest;
import com.findmyhome.user.dto.UserResponse;
import com.findmyhome.user.model.User;
import com.findmyhome.user.model.VerificationStatus;
import com.findmyhome.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .verificationStatus(VerificationStatus.UNVERIFIED)
                .bio(request.getBio())
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.fromEntity(savedUser, false))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.fromEntity(user, false))
                .build();
    }
}
