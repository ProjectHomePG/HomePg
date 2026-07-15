package com.livio.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pgs")
public class PG {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(nullable = false)
    private Double price;

    @Column(columnDefinition = "TEXT")
    private String rules;

    @Column(name = "gender_type")
    private String genderType; // e.g. MALE, FEMALE, UNISEX

    @Column(name = "sharing_type")
    private String sharingType; // e.g. SINGLE, DOUBLE, TRIPLE, etc.

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonIgnoreProperties("pg")
    private List<Image> images = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "pg_amenities",
        joinColumns = @JoinColumn(name = "pg_id"),
        inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> amenities = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pg_nearby_places", joinColumns = @JoinColumn(name = "pg_id"))
    private List<NearbyPlace> nearbyPlaces = new ArrayList<>();

    @Transient
    private Double rating;

    @Transient
    private Integer reviewsCount;

    // Constructors
    public PG() {}

    public PG(String title, String description, String slug, String address, String city, String state, String zipCode, Double price, String rules, String genderType, String sharingType, User owner) {
        this.title = title;
        this.description = description;
        this.slug = slug;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.price = price;
        this.rules = rules;
        this.genderType = genderType;
        this.sharingType = sharingType;
        this.owner = owner;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }

    public String getGenderType() {
        return genderType;
    }

    public void setGenderType(String genderType) {
        this.genderType = genderType;
    }

    public String getSharingType() {
        return sharingType;
    }

    public void setSharingType(String sharingType) {
        this.sharingType = sharingType;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Amenity> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<Amenity> amenities) {
        this.amenities = amenities;
    }

    public List<NearbyPlace> getNearbyPlaces() {
        return nearbyPlaces;
    }

    public void setNearbyPlaces(List<NearbyPlace> nearbyPlaces) {
        this.nearbyPlaces = nearbyPlaces;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }
}
