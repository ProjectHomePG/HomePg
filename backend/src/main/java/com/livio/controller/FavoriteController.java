package com.livio.controller;

import com.livio.entity.PG;
import com.livio.security.JwtUtils;
import com.livio.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

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

    @PostMapping("/{pgId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long pgId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        try {
            favoriteService.addFavorite(userId, pgId);
            Map<String, String> message = new HashMap<>();
            message.put("message", "Added to favorites");
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{pgId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long pgId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        try {
            favoriteService.removeFavorite(userId, pgId);
            Map<String, String> message = new HashMap<>();
            message.put("message", "Removed from favorites");
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserFavorites(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        List<PG> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/{pgId}/status")
    public ResponseEntity<?> checkFavoriteStatus(@PathVariable Long pgId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("isFavorite", false);
            return ResponseEntity.ok(response);
        }

        boolean isFavorite = favoriteService.isFavorite(userId, pgId);
        Map<String, Object> response = new HashMap<>();
        response.put("isFavorite", isFavorite);
        return ResponseEntity.ok(response);
    }
}