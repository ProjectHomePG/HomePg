package com.livio.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pg_id", nullable = false)
    @JsonIgnoreProperties({"rooms", "reviews", "inquiries", "images", "amenities", "nearbyPlaces", "owner"})
    private PG pg;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType = RoomType.SINGLE;

    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @Column(nullable = false)
    private Integer capacity = 1;

    @Column(name = "available_beds", nullable = false)
    private Integer availableBeds = 1;

    @Column(name = "is_ac")
    private Boolean isAc = true;

    @Column(name = "is_attached_bathroom")
    private Boolean isAttachedBathroom = true;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("room")
    private List<Bed> beds = new ArrayList<>();

    public Room() {}

    public Room(PG pg, String roomNumber, RoomType roomType, Double basePrice, Integer capacity, Boolean isAc, Boolean isAttachedBathroom) {
        this.pg = pg;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.basePrice = basePrice;
        this.capacity = capacity;
        this.availableBeds = capacity;
        this.isAc = isAc;
        this.isAttachedBathroom = isAttachedBathroom;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PG getPg() {
        return pg;
    }

    public void setPg(PG pg) {
        this.pg = pg;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getAvailableBeds() {
        return availableBeds;
    }

    public void setAvailableBeds(Integer availableBeds) {
        this.availableBeds = availableBeds;
    }

    public Boolean getIsAc() {
        return isAc;
    }

    public void setIsAc(Boolean isAc) {
        this.isAc = isAc;
    }

    public Boolean getIsAttachedBathroom() {
        return isAttachedBathroom;
    }

    public void setIsAttachedBathroom(Boolean isAttachedBathroom) {
        this.isAttachedBathroom = isAttachedBathroom;
    }

    public List<Bed> getBeds() {
        return beds;
    }

    public void setBeds(List<Bed> beds) {
        this.beds = beds;
    }
}
