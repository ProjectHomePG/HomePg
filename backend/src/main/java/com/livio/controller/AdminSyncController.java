package com.livio.controller;

import com.livio.service.OSMSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sync-pgs")
public class AdminSyncController {

    @Autowired
    private OSMSyncService syncService;

    // Secure this endpoint in production using Spring Security (e.g., @PreAuthorize("hasRole('ADMIN')"))
    @PostMapping
    public ResponseEntity<Map<String, Object>> syncPlaces(@RequestParam String query) {
        int importedCount = syncService.syncPlaces(query);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Successfully imported " + importedCount + " PGs for query: '" + query + "'");
        response.put("importedCount", importedCount);
        
        return ResponseEntity.ok(response);
    }
}
