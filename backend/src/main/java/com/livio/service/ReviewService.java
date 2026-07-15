package com.livio.service;

import com.livio.entity.Review;
import java.util.List;

public interface ReviewService {
    Review addReview(Long pgId, Long userId, Integer rating, String comment);
    List<Review> getByPgId(Long pgId);
}
