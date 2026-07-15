package com.livio.controller;

import com.livio.service.InquiryService;
import com.livio.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private PGService pgService;

    @Autowired
    private InquiryService inquiryService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        int totalProperties = pgService.getAll().size();
        int totalInquiries = inquiryService.getAll().size();
        
        stats.put("totalProperties", totalProperties);
        stats.put("totalInquiries", totalInquiries);
        stats.put("averageRating", 4.6);
        stats.put("activeUsers", 145);
        
        return ResponseEntity.ok(stats);
    }
}
