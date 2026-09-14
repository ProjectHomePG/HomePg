package com.livio.service.impl;

import com.livio.entity.PG;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
    public List<PG> search(String query, String gender, String sharing, Double minPrice, Double maxPrice) {
        return search(query, null, gender, sharing, minPrice, maxPrice, null);
    }

    @Override
    public List<PG> search(String query, String city, String gender, String sharing, Double minPrice, Double maxPrice, String amenity) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanCity = (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("ALL")) ? city.trim() : null;
        String cleanGender = (gender != null && !gender.trim().isEmpty() && !gender.equalsIgnoreCase("ALL")) ? gender.trim() : null;
        String cleanSharing = (sharing != null && !sharing.trim().isEmpty() && !sharing.equalsIgnoreCase("ALL")) ? sharing.trim() : null;
        String cleanAmenity = (amenity != null && !amenity.trim().isEmpty()) ? amenity.trim() : null;

        List<PG> results = pgRepository.searchPGs(cleanQuery, cleanCity, cleanGender, cleanSharing, minPrice, maxPrice, cleanAmenity);
        populateRatingsAndReviews(results);

        // If a search query is provided, sort by relevance (exact title matches first)
        if (cleanQuery != null) {
            final String qLower = cleanQuery.toLowerCase();
            results.sort(Comparator.comparingInt((PG pg) -> {
                String titleLower = pg.getTitle() != null ? pg.getTitle().toLowerCase() : "";
                if (titleLower.equals(qLower)) return 0;
                if (titleLower.startsWith(qLower)) return 1;
                if (titleLower.contains(qLower)) return 2;
                return 3;
            }));
        }

        return results;
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
}

