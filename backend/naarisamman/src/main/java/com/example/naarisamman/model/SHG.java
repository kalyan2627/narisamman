package com.example.naarisamman.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class SHG {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String leaderName;
    private String shgName;
    private String email;
    private String phone;
    private String location;
    private String category;
    private Integer members;
    private String bio;
    private String avatar;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String status; // PENDING, APPROVED, REJECTED

    // KYC Document Fields
    private String aadhaarNumber;
    private String panNumber;
    private String gstNumber; // optional
    private String kycStatus; // PENDING, VERIFIED, REJECTED

    @JsonIgnore
    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "LONGTEXT")
    private String aadhaarImage;

    @JsonIgnore
    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "LONGTEXT")
    private String panImage;

    @JsonIgnore
    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "LONGTEXT")
    private String gstImage;

    // Bank Account Fields
    @JsonIgnore
    private String bankAccountNumber;

    @JsonIgnore
    private String bankIfscCode;

    private String bankName;
    private String accountHolderName;
    private String upiId; // optional
}
