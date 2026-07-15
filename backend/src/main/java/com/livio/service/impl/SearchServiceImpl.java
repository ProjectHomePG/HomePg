package com.livio.service.impl;

import com.livio.entity.PG;
import com.livio.entity.Review;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<PG> search(String query, String gender, String sharing, Double minPrice, Double maxPrice) {
        List<PG> allPgs = pgRepository.findAll();

        List<PG> results = allPgs.stream()
                .filter(pg -> query == null || query.isEmpty() ||
                        pg.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                        pg.getCity().toLowerCase().contains(query.toLowerCase()) ||
                        pg.getAddress().toLowerCase().contains(query.toLowerCase()) ||
                        (pg.getNearbyPlaces() != null && pg.getNearbyPlaces().stream().anyMatch(place -> place.getName().toLowerCase().contains(query.toLowerCase()))))
                .filter(pg -> gender == null || gender.equals("ALL") || pg.getGenderType().equalsIgnoreCase(gender))
                .filter(pg -> sharing == null || sharing.equals("ALL") || pg.getSharingType().equalsIgnoreCase(sharing))
                .filter(pg -> minPrice == null || pg.getPrice() >= minPrice)
                .filter(pg -> maxPrice == null || pg.getPrice() <= maxPrice)
                .collect(Collectors.toList());

        for (PG pg : results) {
            populateRatingsAndReviews(pg);
        }

        return results;
    }

    private void populateRatingsAndReviews(PG pg) {
        List<Review> reviews = reviewRepository.findByPgIdOrderByCreatedAtDesc(pg.getId());
        pg.setReviewsCount(reviews.size());
        if (reviews.isEmpty()) {
            pg.setRating(5.0);
        } else {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            pg.setRating(Math.round(avg * 10.0) / 10.0);
        }
    }
}
