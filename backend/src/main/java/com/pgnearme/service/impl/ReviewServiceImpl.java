package com.pgnearme.service.impl;

import com.pgnearme.entity.PG;
import com.pgnearme.entity.Review;
import com.pgnearme.entity.User;
import com.pgnearme.repository.PGRepository;
import com.pgnearme.repository.ReviewRepository;
import com.pgnearme.repository.UserRepository;
import com.pgnearme.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Review addReview(Long pgId, Long userId, Integer rating, String comment) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new RuntimeException("PG stay not found with id: " + pgId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Review review = new Review(rating, comment, user, pg);
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getByPgId(Long pgId) {
        return reviewRepository.findByPgIdOrderByCreatedAtDesc(pgId);
    }
}
