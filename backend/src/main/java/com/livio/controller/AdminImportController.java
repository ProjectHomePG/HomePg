package com.livio.controller;

import com.livio.service.GoogleMapsImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/import")
@CrossOrigin(origins = "*")
public class AdminImportController {

    @Autowired
    private GoogleMapsImportService importService;

    @PostMapping("/google-maps")
    public ResponseEntity<Map<String, Object>> importGoogleMapsData(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "city", defaultValue = "Mumbai") String city) {

        Map<String, Object> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Please upload a CSV file");
            return ResponseEntity.badRequest().body(response);
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.endsWith(".csv")) {
            response.put("status", "error");
            response.put("message", "Please upload a valid CSV file");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            GoogleMapsImportService.ImportResult result = importService.importFromCsv(file, city);

            response.put("status", "success");
            response.put("message", String.format(
                "Import complete: %d imported, %d skipped, %d errors",
                result.importedCount, result.skippedCount, result.errorCount
            ));
            response.put("importedCount", result.importedCount);
            response.put("skippedCount", result.skippedCount);
            response.put("errorCount", result.errorCount);

            if (!result.errors.isEmpty()) {
                response.put("errors", result.errors);
            }

            if (!result.skippedIds.isEmpty()) {
                response.put("skippedIds", result.skippedIds);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Import failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/google-maps/reviews")
    public ResponseEntity<Map<String, Object>> importReviews(
            @RequestParam("file") MultipartFile file) {

        Map<String, Object> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Please upload a CSV file");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            GoogleMapsImportService.ImportResult result = importService.importReviewsFromCsv(file);

            response.put("status", "success");
            response.put("message", String.format(
                "Reviews import: %d imported, %d skipped, %d errors",
                result.importedCount, result.skippedCount, result.errorCount
            ));
            response.put("importedCount", result.importedCount);
            response.put("skippedCount", result.skippedCount);
            response.put("errorCount", result.errorCount);

            if (!result.errors.isEmpty()) {
                response.put("errors", result.errors);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Import failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getImportStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("status", "ok");
        stats.put("message", "Import API is working. Use POST /api/admin/import/google-maps to import data.");

        return ResponseEntity.ok(stats);
    }
}
