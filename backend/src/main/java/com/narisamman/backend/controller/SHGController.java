package com.narisamman.backend.controller;

import com.narisamman.backend.model.SHG;
import com.narisamman.backend.repository.SHGRepository;
import com.narisamman.backend.service.EmailService;
import com.narisamman.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shg")
public class SHGController {

    @Autowired
    private SHGRepository shgRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SHG shg) {
        // Validation: name must have letters only
        if (shg.getLeaderName() == null || !shg.getLeaderName().trim().matches("^[a-zA-Z\\s]+$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Leader name must contain letters only"));
        }

        // Validation: email must be valid format
        if (shg.getEmail() == null || !shg.getEmail().trim().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email format"));
        }

        // Validation: password minimum 8 characters
        if (shg.getPassword() == null || shg.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters"));
        }

        // Validation: Aadhaar card image is required
        if (shg.getAadhaarImage() == null || shg.getAadhaarImage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Aadhaar document image is required"));
        }

        // Validation: PAN card image is required
        if (shg.getPanImage() == null || shg.getPanImage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "PAN document image is required"));
        }

        // Validation: Bank account number (8-18 digits)
        if (shg.getBankAccountNumber() == null || !shg.getBankAccountNumber().matches("^\\d{8,18}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bank account number must be 8-18 digits"));
        }

        // Validation: IFSC code format (4-15 characters)
        if (shg.getBankIfscCode() == null || shg.getBankIfscCode().trim().length() < 4 || shg.getBankIfscCode().trim().length() > 15) {
            return ResponseEntity.badRequest().body(Map.of("message", "IFSC code must be between 4 and 15 characters"));
        }

        // Validation: Bank name required
        if (shg.getBankName() == null || shg.getBankName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bank name is required"));
        }

        // Validation: Account holder name required
        if (shg.getAccountHolderName() == null || shg.getAccountHolderName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Account holder name is required"));
        }

        if (shgRepository.findByEmail(shg.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }

        if (shgRepository.findByPhone(shg.getPhone()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Phone number already registered"));
        }

        shg.setPassword(passwordEncoder.encode(shg.getPassword()));
        shg.setStatus("PENDING");
        shg.setKycStatus("PENDING");
        SHG saved = shgRepository.save(shg);

        // Sanitize before returning to avoid exposing sensitive details
        saved.setPassword(null);
        saved.setAadhaarImage(null);
        saved.setPanImage(null);
        saved.setGstImage(null);
        saved.setBankAccountNumber(null);
        saved.setBankIfscCode(null);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SHG>> getPendingSHGs() {
        List<SHG> pending = shgRepository.findByStatus("PENDING");
        return ResponseEntity.ok(pending);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SHG>> getAllSHGs() {
        return ResponseEntity.ok(shgRepository.findAll());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveSHG(@PathVariable Long id) {
        Optional<SHG> shgOpt = shgRepository.findById(id);
        if (shgOpt.isPresent()) {
            SHG shg = shgOpt.get();
            shg.setStatus("APPROVED");
            shg.setKycStatus("VERIFIED");
            shgRepository.save(shg);
            return ResponseEntity.ok(Map.of("message", "SHG approved successfully", "shg", shg));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "SHG not found"));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectSHG(@PathVariable Long id) {
        Optional<SHG> shgOpt = shgRepository.findById(id);
        if (shgOpt.isPresent()) {
            SHG shg = shgOpt.get();
            shg.setStatus("REJECTED");
            shgRepository.save(shg);
            return ResponseEntity.ok(Map.of("message", "SHG rejected successfully", "shg", shg));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "SHG not found"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<SHG> shgOpt = shgRepository.findByEmail(email);
        if (shgOpt.isPresent()) {
            SHG shg = shgOpt.get();
            if (passwordEncoder.matches(password, shg.getPassword())) {
                if ("PENDING".equals(shg.getStatus())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account pending approval"));
                }
                if ("REJECTED".equals(shg.getStatus())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account has been rejected"));
                }

                String token = jwtUtil.generateToken(shg.getEmail(), "VENDOR");
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("message", "Login successful");
                response.put("token", token);
                response.put("role", "VENDOR");
                response.put("id", shg.getId());
                response.put("shgName", shg.getShgName());
                response.put("email", shg.getEmail());
                response.put("status", shg.getStatus());
                response.put("kycStatus", shg.getKycStatus());
                response.put("leaderName", shg.getLeaderName());
                response.put("phone", shg.getPhone());
                response.put("location", shg.getLocation() != null ? shg.getLocation() : "");
                response.put("category", shg.getCategory() != null ? shg.getCategory() : "");
                response.put("members", shg.getMembers() != null ? shg.getMembers() : 10);
                response.put("bio", shg.getBio() != null ? shg.getBio() : "");
                response.put("avatar", shg.getAvatar() != null ? shg.getAvatar() : "🤝");
                response.put("bankAccountNumber", shg.getBankAccountNumber() != null ? shg.getBankAccountNumber() : "");
                response.put("bankIfscCode", shg.getBankIfscCode() != null ? shg.getBankIfscCode() : "");
                response.put("bankName", shg.getBankName() != null ? shg.getBankName() : "");
                response.put("accountHolderName", shg.getAccountHolderName() != null ? shg.getAccountHolderName() : "");
                response.put("upiId", shg.getUpiId() != null ? shg.getUpiId() : "");
                response.put("aadhaarNumber", shg.getAadhaarNumber() != null ? shg.getAadhaarNumber() : "");
                response.put("gstNumber", shg.getGstNumber() != null ? shg.getGstNumber() : "");
                response.put("panNumber", shg.getPanNumber() != null ? shg.getPanNumber() : "");
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<SHG> shgOpt = shgRepository.findByEmail(email);
        if (shgOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email not found"));
        }

        boolean success = emailService.sendOtpEmail(email);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Reset OTP sent to email"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to send reset email"));
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
            Optional<SHG> shgOpt = shgRepository.findByEmail(email);
            if (shgOpt.isPresent()) {
                SHG shg = shgOpt.get();
                shg.setPassword(passwordEncoder.encode(newPassword));
                shgRepository.save(shg);
                return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP or Email"));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> updateProfile(java.security.Principal principal, @RequestBody Map<String, Object> request) {
        String email = principal.getName();
        Optional<SHG> shgOpt = shgRepository.findByEmail(email);
        if (shgOpt.isPresent()) {
            SHG shg = shgOpt.get();
            if (request.containsKey("leaderName")) shg.setLeaderName((String) request.get("leaderName"));
            if (request.containsKey("shgName")) shg.setShgName((String) request.get("shgName"));
            if (request.containsKey("phone")) shg.setPhone((String) request.get("phone"));
            if (request.containsKey("email")) shg.setEmail((String) request.get("email"));
            if (request.containsKey("location")) shg.setLocation((String) request.get("location"));
            if (request.containsKey("category")) shg.setCategory((String) request.get("category"));
            if (request.containsKey("bio")) shg.setBio((String) request.get("bio"));
            if (request.containsKey("avatar")) shg.setAvatar((String) request.get("avatar"));
            
            if (request.containsKey("members")) {
                Object membersVal = request.get("members");
                if (membersVal instanceof Number) {
                    shg.setMembers(((Number) membersVal).intValue());
                } else if (membersVal instanceof String) {
                    try {
                        shg.setMembers(Integer.parseInt((String) membersVal));
                    } catch (Exception e) {}
                }
            }

            // Bank details
            if (request.containsKey("accountHolderName")) shg.setAccountHolderName((String) request.get("accountHolderName"));
            if (request.containsKey("bankAccountNumber")) shg.setBankAccountNumber((String) request.get("bankAccountNumber"));
            if (request.containsKey("bankIfscCode")) shg.setBankIfscCode((String) request.get("bankIfscCode"));
            if (request.containsKey("bankName")) shg.setBankName((String) request.get("bankName"));
            if (request.containsKey("upiId")) shg.setUpiId((String) request.get("upiId"));

            // Aadhaar / PAN / GST numbers
            if (request.containsKey("aadhaarNumber")) shg.setAadhaarNumber((String) request.get("aadhaarNumber"));
            if (request.containsKey("panNumber")) shg.setPanNumber((String) request.get("panNumber"));
            if (request.containsKey("gstNumber")) shg.setGstNumber((String) request.get("gstNumber"));

            SHG saved = shgRepository.save(shg);
            
            // sanitize before returning
            saved.setPassword(null);
            saved.setAadhaarImage(null);
            saved.setPanImage(null);
            saved.setGstImage(null);

            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "SHG not found"));
    }
}
