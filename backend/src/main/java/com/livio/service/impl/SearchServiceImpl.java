package com.livio.service.impl;

import com.livio.entity.PG;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PG> search(String query, String gender, String sharing, Double minPrice, Double maxPrice) {
        String cleanQuery = (query == null || query.isBlank()) ? null : query.trim();
        String cleanGender = sanitizeFilter(gender);
        String cleanSharing = sanitizeFilter(sharing);

        List<PG> results = pgRepository.searchPGs(cleanQuery, cleanGender, cleanSharing, minPrice, maxPrice);
        populateRatingsAndReviews(results);
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PG> search(String query, String city, String gender, String sharing, Double minPrice, Double maxPrice, String amenity) {
        String cleanQuery = (query == null || query.isBlank()) ? null : query.trim();
        String cleanCity = sanitizeFilter(city);
        String cleanGender = sanitizeFilter(gender);
        String cleanSharing = sanitizeFilter(sharing);
        String cleanAmenity = sanitizeFilter(amenity);

        List<PG> results = pgRepository.searchPGsFiltered(cleanQuery, cleanCity, cleanGender, cleanSharing, minPrice, maxPrice, cleanAmenity);
        populateRatingsAndReviews(results);
        return results;
    }

    private String sanitizeFilter(String value) {
        if (value == null || value.isBlank()) return null;
        String trimmed = value.trim();
        if (trimmed.equalsIgnoreCase("ALL") || trimmed.isEmpty()) return null;
        return trimmed;
    }

    private void populateRatingsAndReviews(List<PG> pgs) {
        if (pgs == null || pgs.isEmpty()) {
            return;
        }
        List<Object[]> summaries = reviewRepository.getRatingSummaries();
        Map<Long, Object[]> summaryMap = summaries.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> row
                ));

        for (PG pg : pgs) {
            Object[] summary = summaryMap.get(pg.getId());
            if (summary != null) {
                Double avgRating = (Double) summary[1];
                Long count = (Long) summary[2];
                pg.setReviewsCount(count.intValue());
                pg.setRating(Math.round(avgRating * 10.0) / 10.0);
            } else {
                pg.setReviewsCount(0);
                pg.setRating(5.0);
            }
        }
    }

    @Override
    public List<PG> search(String query, String city, String gender, String sharing, Double minPrice, Double maxPrice,
            String amenity) {
        String cleanQuery = (query == null || query.isBlank()) ? null : query.trim();
        String cleanCity = (city == null || city.isBlank()) ? null : city.trim();
        String cleanGender = sanitizeFilter(gender);
        String cleanSharing = sanitizeFilter(sharing);
        String cleanAmenity = (amenity == null || amenity.isBlank()) ? null : amenity.trim();

        List<PG> results = pgRepository.searchPGsAdvanced(cleanQuery, cleanCity, cleanGender, cleanSharing, minPrice, maxPrice, cleanAmenity);
        populateRatingsAndReviews(results);
        return results;
    }
}
