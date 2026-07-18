package com.livio.service.impl;

import com.livio.entity.Image;
import com.livio.entity.PG;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PGServiceImpl implements PGService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public PG create(PG pg) {
        if (pg.getSlug() == null || pg.getSlug().isEmpty()) {
            pg.setSlug(pg.getTitle().toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", ""));
        }
        if (pg.getImages() != null) {
            for (Image img : pg.getImages()) {
                img.setPg(pg);
            }
        }
        return pgRepository.save(pg);
    }

    @Override
    public PG update(Long id, PG pgDetails) {
        PG pg = getById(id);
        pg.setTitle(pgDetails.getTitle());
        pg.setDescription(pgDetails.getDescription());
        pg.setAddress(pgDetails.getAddress());
        pg.setCity(pgDetails.getCity());
        pg.setState(pgDetails.getState());
        pg.setZipCode(pgDetails.getZipCode());
        pg.setPrice(pgDetails.getPrice());
        pg.setRules(pgDetails.getRules());
        pg.setGenderType(pgDetails.getGenderType());
        pg.setSharingType(pgDetails.getSharingType());

        if (pgDetails.getImages() != null) {
            pg.getImages().clear();
            for (Image img : pgDetails.getImages()) {
                img.setPg(pg);
                pg.getImages().add(img);
            }
        }

        if (pgDetails.getAmenities() != null) {
            pg.getAmenities().clear();
            pg.getAmenities().addAll(pgDetails.getAmenities());
        }

        if (pgDetails.getNearbyPlaces() != null) {
            pg.getNearbyPlaces().clear();
            pg.getNearbyPlaces().addAll(pgDetails.getNearbyPlaces());
        }

        return pgRepository.save(pg);
    }

    @Override
    public void delete(Long id) {
        PG pg = getById(id);
        pgRepository.delete(pg);
    }

    @Override
    public PG getById(Long id) {
        PG pg = pgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PG stay not found with id: " + id));
        populateRatingsAndReviews(pg);
        return pg;
    }

    @Override
    public PG getBySlug(String slug) {
        PG pg = pgRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("PG stay not found with slug: " + slug));
        populateRatingsAndReviews(pg);
        return pg;
    }

    @Override
    public List<PG> getAll() {
        List<PG> pgs = pgRepository.findAll();
        populateRatingsAndReviews(pgs);
        return pgs;
    }

    private void populateRatingsAndReviews(PG pg) {
        List<Object[]> summaryList = reviewRepository.getRatingSummaryForPg(pg.getId());
        if (summaryList != null && !summaryList.isEmpty() && summaryList.get(0)[0] != null) {
            Object[] summary = summaryList.get(0);
            Double avgRating = (Double) summary[0];
            Long count = (Long) summary[1];
            pg.setReviewsCount(count.intValue());
            pg.setRating(Math.round(avgRating * 10.0) / 10.0);
        } else {
            pg.setReviewsCount(0);
            pg.setRating(5.0);
        }
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
