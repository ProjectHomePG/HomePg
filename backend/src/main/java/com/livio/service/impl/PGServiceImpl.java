package com.livio.service.impl;

import com.livio.entity.Image;
import com.livio.entity.PG;
import com.livio.entity.Review;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
        for (PG pg : pgs) {
            populateRatingsAndReviews(pg);
        }
        return pgs;
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
