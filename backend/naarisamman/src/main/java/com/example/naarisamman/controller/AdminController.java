package com.example.naarisamman.controller;

import com.example.naarisamman.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password.hash}")
    private String adminPasswordHash;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Thread-safe in-memory rate limiting map
    private static final Map<String, LoginAttempt> attempts = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final long BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
    private static final long WINDOW_MS = 10 * 60 * 1000; // 10 minutes

    private static class LoginAttempt {
        int count;
        long firstAttemptTime;
        long blockedUntil;

        LoginAttempt(int count, long firstAttemptTime) {
            this.count = count;
            this.firstAttemptTime = firstAttemptTime;
            this.blockedUntil = 0;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        long now = System.currentTimeMillis();

        // Check if IP is currently blocked
        LoginAttempt attempt = attempts.get(ip);
        if (attempt != null && attempt.blockedUntil > now) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many attempts. Please wait 10 minutes."));
        }

        String email = requestBody.get("email");
        String password = requestBody.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        boolean credentialsValid = email.equalsIgnoreCase(adminEmail) &&
                passwordEncoder.matches(password, adminPasswordHash);

        if (credentialsValid) {
            // Reset rate limiting on success
            attempts.remove(ip);
            String token = jwtUtil.generateToken(adminEmail, "ADMIN");
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", "ADMIN",
                    "email", adminEmail
            ));
        } else {
            // Track failure for rate limiting
            if (attempt == null || (now - attempt.firstAttemptTime) > WINDOW_MS) {
                // First failure or window reset
                attempts.put(ip, new LoginAttempt(1, now));
            } else {
                attempt.count++;
                if (attempt.count >= MAX_ATTEMPTS) {
                    attempt.blockedUntil = now + BLOCK_DURATION_MS;
                    attempts.put(ip, attempt);
                    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                            .body(Map.of("error", "Too many attempts. Please wait 10 minutes."));
                } else {
                    attempts.put(ip, attempt);
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }
}
