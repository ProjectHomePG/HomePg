package com.livio.controller;

import com.livio.entity.PG;
import com.livio.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String sharing,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice,
            @RequestParam(required = false) String amenity) {

        try {
            // Validate and clean all parameters
            String cleanQuery = cleanStringParam(query);
            String cleanCity = cleanStringParam(city);
            String cleanGender = cleanStringParam(gender);
            String cleanSharing = cleanStringParam(sharing);
            String cleanAmenity = cleanStringParam(amenity);

            Double parsedMinPrice = parsePrice(minPrice);
            Double parsedMaxPrice = parsePrice(maxPrice);

            // Validate price logic
            if (parsedMinPrice != null && parsedMaxPrice != null && parsedMinPrice > parsedMaxPrice) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Minimum price cannot be greater than maximum price");
                return ResponseEntity.badRequest().body(error);
            }

            List<PG> results = searchService.search(
                    cleanQuery, 
                    cleanCity, 
                    cleanGender, 
                    cleanSharing, 
                    parsedMinPrice, 
                    parsedMaxPrice, 
                    cleanAmenity
            );
            
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Search failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Clean string parameters - remove whitespace, handle null/undefined
     */
    private String cleanStringParam(String param) {
        if (param == null || param.trim().isEmpty() || 
            param.equalsIgnoreCase("null") || 
            param.equalsIgnoreCase("undefined") ||
            param.equalsIgnoreCase("ALL")) {
            return null;
        }
        return param.trim();
    }

    /**
     * Parse price with error handling
     */
    private Double parsePrice(String priceStr) {
        if (priceStr == null || priceStr.trim().isEmpty() || 
            priceStr.equalsIgnoreCase("undefined") || 
            priceStr.equalsIgnoreCase("null") ||
            priceStr.equalsIgnoreCase("0")) {
            return null;
        }
        try {
            Double price = Double.parseDouble(priceStr.trim());
            if (price < 0) return null;
            return price;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
