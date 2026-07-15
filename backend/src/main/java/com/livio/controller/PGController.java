package com.livio.controller;

import com.livio.entity.PG;
import com.livio.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pgs")
@CrossOrigin(origins = "*")
public class PGController {

    @Autowired
    private PGService pgService;

    @GetMapping
    public ResponseEntity<List<PG>> getAll() {
        return ResponseEntity.ok(pgService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pgService.getById(id));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        try {
            return ResponseEntity.ok(pgService.getBySlug(slug));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PG pg) {
        try {
            return ResponseEntity.ok(pgService.create(pg));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PG pgDetails) {
        try {
            return ResponseEntity.ok(pgService.update(id, pgDetails));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
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
