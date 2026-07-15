package com.livio.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class NearbyPlace {
    private String name;
    private String distance;
    private String type;

    public NearbyPlace() {}

    public NearbyPlace(String name, String distance, String type) {
        this.name = name;
        this.distance = distance;
        this.type = type;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
