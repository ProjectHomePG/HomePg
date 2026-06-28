package com.pgnearme.controller;

import com.pgnearme.entity.PG;
import com.pgnearme.service.SearchService;
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
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String sharing,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        
        List<PG> results = searchService.search(query, gender, sharing, minPrice, maxPrice);
        return ResponseEntity.ok(results);
    }
}
