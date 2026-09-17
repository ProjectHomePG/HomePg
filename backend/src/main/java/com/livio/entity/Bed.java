package com.livio.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "beds")
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnoreProperties({"beds", "pg"})
    private Room room;

    @Column(name = "bed_code", nullable = false)
    private String bedCode; // e.g. "Bed-1", "Bed-A"

    @Column(name = "is_occupied", nullable = false)
    private Boolean isOccupied = false;

    @Column(name = "monthly_price")
    private Double monthlyPrice;

    public Bed() {}

    public Bed(Room room, String bedCode, Double monthlyPrice) {
        this.room = room;
        this.bedCode = bedCode;
        this.monthlyPrice = monthlyPrice;
        this.isOccupied = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public String getBedCode() {
        return bedCode;
    }

    public void setBedCode(String bedCode) {
        this.bedCode = bedCode;
    }

    public Boolean getIsOccupied() {
        return isOccupied;
    }

    public void setIsOccupied(Boolean isOccupied) {
        this.isOccupied = isOccupied;
    }

    public Double getMonthlyPrice() {
        return monthlyPrice;
    }

    public void setMonthlyPrice(Double monthlyPrice) {
        this.monthlyPrice = monthlyPrice;
    }
}
