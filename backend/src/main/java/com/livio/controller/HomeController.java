package com.livio.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {

    @Value("${server.port:8083}")
    private String port;

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Livio Backend API is running successfully on port " + port + "!");
        
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
