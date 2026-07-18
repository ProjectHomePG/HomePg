package com.livio.service.impl;

import com.livio.entity.PG;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        List<PG> results = pgRepository.searchPGs(query, gender, sharing, minPrice, maxPrice);
        populateRatingsAndReviews(results);
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
