package com.livio.controller;

import com.livio.entity.PG;
import com.livio.entity.User;
import com.livio.repository.UserRepository;
import com.livio.security.JwtUtils;
import com.livio.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner/pgs")
@CrossOrigin(origins = "*")
public class OwnerController {

    @Autowired
    private PGService pgService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private Long getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        if (!jwtUtils.validateToken(token)) {
            return null;
        }
        return jwtUtils.getUserIdFromToken(token);
    }

    @GetMapping
    public ResponseEntity<?> getMyPGs(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        List<PG> pgs = pgService.getByOwner(userId);
        return ResponseEntity.ok(pgs);
    }

    @PostMapping
    public ResponseEntity<?> createMyPG(@RequestBody PG pg, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        try {
            User owner = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            pg.setOwner(owner);
            PG created = pgService.create(pg);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMyPG(@PathVariable Long id, @RequestBody PG pgDetails, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        if (!pgService.isOwner(id, userId)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Forbidden: You can only update your own PGs");
            return ResponseEntity.status(403).body(error);
        }

        try {
            return ResponseEntity.ok(pgService.update(id, pgDetails));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMyPG(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        if (!pgService.isOwner(id, userId)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Forbidden: You can only delete your own PGs");
            return ResponseEntity.status(403).body(error);
        }

        try {
            pgService.delete(id);
            Map<String, String> message = new HashMap<>();
            message.put("message", "PG Stay deleted successfully");
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}