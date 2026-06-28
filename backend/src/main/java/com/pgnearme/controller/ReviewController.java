package com.pgnearme.controller;

import com.pgnearme.entity.Review;
import com.pgnearme.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/pg/{pgId}")
    public ResponseEntity<List<Review>> getByPgId(@PathVariable Long pgId) {
        return ResponseEntity.ok(reviewService.getByPgId(pgId));
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> request) {
        try {
            Long pgId = Long.valueOf(request.get("pgId").toString());
            Long userId = Long.valueOf(request.get("userId").toString());
            Integer rating = Integer.valueOf(request.get("rating").toString());
            String comment = request.get("comment").toString();

            Review review = reviewService.addReview(pgId, userId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
