package com.livio.controller;

import com.livio.entity.PG;
import com.livio.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<List<PG>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String sharing,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice,
            @RequestParam(required = false) String amenity) {

        Double parsedMinPrice = parsePrice(minPrice);
        Double parsedMaxPrice = parsePrice(maxPrice);

        List<PG> results = searchService.search(query, city, gender, sharing, parsedMinPrice, parsedMaxPrice, amenity);
        return ResponseEntity.ok(results);
    }

    private Double parsePrice(String priceStr) {
        if (priceStr == null || priceStr.trim().isEmpty() || priceStr.equalsIgnoreCase("undefined") || priceStr.equalsIgnoreCase("null")) {
            return null;
        }
        try {
            return Double.parseDouble(priceStr.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}

