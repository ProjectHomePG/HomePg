package com.pgnearme.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "PG Near Me Backend API is running successfully on port 8082!");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("Authentication", "/api/auth");
        endpoints.put("PGs Stays", "/api/pgs");
        endpoints.put("Search", "/api/search");
        endpoints.put("Inquiries", "/api/inquiries");
        endpoints.put("Reviews", "/api/reviews");
        
        response.put("endpoints", endpoints);
        return response;
    }
}
