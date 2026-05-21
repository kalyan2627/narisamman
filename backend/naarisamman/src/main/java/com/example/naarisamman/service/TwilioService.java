package com.example.naarisamman.service;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.verify.sid}")
    private String verifySid;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public boolean sendOtp(String mobileNumber) {
        try {
            // Ensure the mobile number starts with a '+' and country code, e.g., +91 for India
            if (!mobileNumber.startsWith("+")) {
                mobileNumber = "+91" + mobileNumber;
            }
            Verification verification = Verification.creator(
                    verifySid,
                    mobileNumber,
                    "sms")
                    .create();
            return "pending".equals(verification.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean verifyOtp(String mobileNumber, String otp) {
        try {
            if (!mobileNumber.startsWith("+")) {
                mobileNumber = "+91" + mobileNumber;
            }
            VerificationCheck verificationCheck = VerificationCheck.creator(verifySid)
                    .setTo(mobileNumber)
                    .setCode(otp)
                    .create();
            return "approved".equals(verificationCheck.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
