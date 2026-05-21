package com.narisamman.backend.controller;

import com.narisamman.backend.model.Consumer;
import com.narisamman.backend.repository.ConsumerRepository;
import com.narisamman.backend.service.EmailService;
import com.narisamman.backend.service.TwilioService;
import com.narisamman.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/consumer")
public class ConsumerController {

    @Autowired
    private ConsumerRepository consumerRepository;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Consumer consumer) {
        if (consumerRepository.findByEmail(consumer.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }
        if (consumerRepository.findByMobileNumber(consumer.getMobileNumber()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile number already registered"));
        }
        consumer.setPassword(passwordEncoder.encode(consumer.getPassword()));
        consumer.setVerified(true);
        Consumer saved = consumerRepository.save(consumer);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String mobileNumber = request.get("mobileNumber");
        if (mobileNumber == null || mobileNumber.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile number is required"));
        }
        boolean success = twilioService.sendOtp(mobileNumber);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } else {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send OTP"));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String mobileNumber = request.get("mobileNumber");
        String otp = request.get("otp");
        if (mobileNumber == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile number and OTP are required"));
        }

        boolean success = twilioService.verifyOtp(mobileNumber, otp);
        if (success) {
            Optional<Consumer> consumerOpt = consumerRepository.findByMobileNumber(mobileNumber);
            if (consumerOpt.isPresent()) {
                Consumer consumer = consumerOpt.get();
                consumer.setVerified(true);
                consumerRepository.save(consumer);
            }
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<Consumer> consumerOpt = consumerRepository.findByEmail(email);
        if (consumerOpt.isPresent()) {
            Consumer consumer = consumerOpt.get();
            if (passwordEncoder.matches(password, consumer.getPassword())) {
                if (!consumer.isVerified()) {
                    consumer.setVerified(true);
                    consumerRepository.save(consumer);
                }
                String token = jwtUtil.generateToken(consumer.getEmail(), "CONSUMER");
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("message", "Login successful");
                response.put("token", token);
                response.put("role", "CONSUMER");
                response.put("id", consumer.getId());
                response.put("fullName", consumer.getFullName());
                response.put("email", consumer.getEmail());
                response.put("mobileNumber", consumer.getMobileNumber());
                response.put("avatar", consumer.getAvatar() != null ? consumer.getAvatar() : "👤");
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<Consumer> consumerOpt = consumerRepository.findByEmail(email);
        if (consumerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email not found"));
        }

        boolean success = emailService.sendOtpEmail(email);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Reset OTP sent to email"));
        } else {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send reset email"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields"));
        }

        boolean verified = emailService.verifyOtp(email, otp);
        if (verified) {
            Optional<Consumer> consumerOpt = consumerRepository.findByEmail(email);
            if (consumerOpt.isPresent()) {
                Consumer consumer = consumerOpt.get();
                consumer.setPassword(passwordEncoder.encode(newPassword));
                consumerRepository.save(consumer);
                return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP or Email"));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<?> updateProfile(java.security.Principal principal, @RequestBody Map<String, String> request) {
        String email = principal.getName();
        Optional<Consumer> consumerOpt = consumerRepository.findByEmail(email);
        if (consumerOpt.isPresent()) {
            Consumer consumer = consumerOpt.get();
            if (request.containsKey("fullName")) consumer.setFullName(request.get("fullName"));
            if (request.containsKey("email")) consumer.setEmail(request.get("email"));
            if (request.containsKey("mobileNumber")) consumer.setMobileNumber(request.get("mobileNumber"));
            if (request.containsKey("avatar")) consumer.setAvatar(request.get("avatar"));
            Consumer saved = consumerRepository.save(consumer);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Consumer not found"));
    }
}
