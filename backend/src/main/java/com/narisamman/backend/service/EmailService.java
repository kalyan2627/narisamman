package com.narisamman.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> emailOtpStorage = new ConcurrentHashMap<>();

    public boolean sendOtpEmail(String toEmail) {
        try {
            String otp = generateOtp();
            emailOtpStorage.put(toEmail, otp);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ithaganianusha4@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Password Reset OTP");
            message.setText("Your OTP for password reset is: " + otp);

            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = emailOtpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            emailOtpStorage.remove(email); // Clear OTP after successful verification
            return true;
        }
        return false;
    }

    private String generateOtp() {
        Random random = new Random();
        int otpValue = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otpValue);
    }
}
