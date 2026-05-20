package com.narisamman.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    private Double price;
    private Double mrp;
    private String unit;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer stock;
    
    @Column(name = "tags")
    @JsonIgnore
    private String rawTags; // stored as comma-separated string in DB

    private String emoji;

    @Column(name = "image", columnDefinition = "MEDIUMTEXT")
    @JsonIgnore
    private String rawImage; // URL, local require ID, or base64 JSON

    private String artisanId;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @JsonIgnore
    private boolean fssai;
    @JsonIgnore
    private boolean gi;
    @JsonIgnore
    private boolean handloom;
    @JsonIgnore
    private boolean nabard;

    private String rejectionReason;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getMrp() {
        return mrp;
    }

    public void setMrp(Double mrp) {
        this.mrp = mrp;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getEmoji() {
        return emoji;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    @Transient
    public Object getImage() {
        if (this.rawImage == null) {
            return null;
        }
        // Try parsing as JSON object/number/array
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().readValue(this.rawImage, Object.class);
        } catch (Exception e) {
            // Return raw string if not valid JSON
            return this.rawImage;
        }
    }

    public void setImage(Object img) {
        if (img == null) {
            this.rawImage = null;
        } else if (img instanceof String) {
            this.rawImage = (String) img;
        } else {
            try {
                this.rawImage = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(img);
            } catch (Exception e) {
                this.rawImage = img.toString();
            }
        }
    }

    public String getArtisanId() {
        return artisanId;
    }

    public void setArtisanId(String artisanId) {
        this.artisanId = artisanId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isFssai() {
        return fssai;
    }

    public void setFssai(boolean fssai) {
        this.fssai = fssai;
    }

    public boolean isGi() {
        return gi;
    }

    public void setGi(boolean gi) {
        this.gi = gi;
    }

    public boolean isHandloom() {
        return handloom;
    }

    public void setHandloom(boolean handloom) {
        this.handloom = handloom;
    }

    public boolean isNabard() {
        return nabard;
    }

    public void setNabard(boolean nabard) {
        this.nabard = nabard;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    // Helper to get certifications as object in JSON serialization
    @Transient
    public Certifications getCertifications() {
        return new Certifications(fssai, gi, handloom, nabard);
    }

    // Helper to set certifications from JSON deserialization
    public void setCertifications(Certifications certs) {
        if (certs != null) {
            this.fssai = certs.isFssai();
            this.gi = certs.isGi();
            this.handloom = certs.isHandloom();
            this.nabard = certs.isNabard();
        }
    }

    // Convert comma-separated tags to List<String> for JSON response
    @Transient
    public List<String> getTags() {
        if (this.rawTags == null || this.rawTags.trim().isEmpty()) {
            return List.of();
        }
        return Arrays.stream(this.rawTags.split(","))
                     .map(String::trim)
                     .filter(s -> !s.isEmpty())
                     .collect(Collectors.toList());
    }

    // Convert List<String> to comma-separated tags for database storage
    public void setTags(List<String> tagsList) {
        if (tagsList == null || tagsList.isEmpty()) {
            this.rawTags = "";
        } else {
            this.rawTags = String.join(",", tagsList);
        }
    }

    // Certifications Helper class
    public static class Certifications {
        private boolean fssai;
        private boolean gi;
        private boolean handloom;
        private boolean nabard;

        public Certifications() {}

        public Certifications(boolean fssai, boolean gi, boolean handloom, boolean nabard) {
            this.fssai = fssai;
            this.gi = gi;
            this.handloom = handloom;
            this.nabard = nabard;
        }

        public boolean isFssai() {
            return fssai;
        }

        public void setFssai(boolean fssai) {
            this.fssai = fssai;
        }

        public boolean isGi() {
            return gi;
        }

        public void setGi(boolean gi) {
            this.gi = gi;
        }

        public boolean isHandloom() {
            return handloom;
        }

        public void setHandloom(boolean handloom) {
            this.handloom = handloom;
        }

        public boolean isNabard() {
            return nabard;
        }

        public void setNabard(boolean nabard) {
            this.nabard = nabard;
        }
    }
}
