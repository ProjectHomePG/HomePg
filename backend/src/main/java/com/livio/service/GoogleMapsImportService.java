package com.livio.service;

import com.livio.entity.PG;
import com.livio.entity.Review;
import com.livio.entity.User;
import com.livio.entity.UserRole;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.repository.UserRepository;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.livio.entity.Image;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class GoogleMapsImportService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleMapsImportService.class);

    // Column indices for gosom google-maps-scraper CSV
    private static final int COL_INPUT_ID = 0;
    private static final int COL_LINK = 1;
    private static final int COL_TITLE = 2;
    private static final int COL_CATEGORY = 3;
    private static final int COL_ADDRESS = 4;
    private static final int COL_OPEN_HOURS = 5;
    private static final int COL_WEBSITE = 7;
    private static final int COL_PHONE = 8;
    private static final int COL_REVIEW_COUNT = 10;
    private static final int COL_REVIEW_RATING = 11;
    private static final int COL_LATITUDE = 13;
    private static final int COL_LONGITUDE = 14;
    private static final int COL_THUMBNAIL = 19;
    private static final int COL_PLACE_ID = 24;
    private static final int COL_IMAGES = 25;
    private static final int COL_COMPLETE_ADDRESS = 30;
    private static final int COL_USER_REVIEWS = 33;

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Path IMAGES_DIR = Path.of("./data/images");
    private static final String IMAGES_BASE_URL = "/uploads/images/";

    private static final Map<String, String> CITY_STATE_MAP = new HashMap<>();
    static {
        CITY_STATE_MAP.put("mumbai", "Maharashtra");
        CITY_STATE_MAP.put("bangalore", "Karnataka");
        CITY_STATE_MAP.put("bengaluru", "Karnataka");
        CITY_STATE_MAP.put("delhi", "Delhi");
        CITY_STATE_MAP.put("new delhi", "Delhi");
        CITY_STATE_MAP.put("pune", "Maharashtra");
        CITY_STATE_MAP.put("hyderabad", "Telangana");
        CITY_STATE_MAP.put("chennai", "Tamil Nadu");
        CITY_STATE_MAP.put("kolkata", "West Bengal");
        CITY_STATE_MAP.put("gurugram", "Haryana");
        CITY_STATE_MAP.put("gurgaon", "Haryana");
        CITY_STATE_MAP.put("noida", "Uttar Pradesh");
        CITY_STATE_MAP.put("ghaziabad", "Uttar Pradesh");
    }

    public static class ImportResult {
        public int importedCount;
        public int skippedCount;
        public int errorCount;
        public List<String> errors = new ArrayList<>();
        public List<String> skippedIds = new ArrayList<>();
    }

    public ImportResult importFromCsv(MultipartFile file, String defaultCity) {
        ImportResult result = new ImportResult();

        try {
            User defaultOwner = userRepository.findById(2L).orElse(
                userRepository.findById(1L).orElse(null)
            );

            if (defaultOwner == null) {
                result.errors.add("No user found in database. Please create a user first.");
                return result;
            }

            CSVReader csvReader = new CSVReaderBuilder(
                new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
            )
            .withCSVParser(new CSVParserBuilder()
                .withSeparator(',')
                .withQuoteChar('"')
                .withEscapeChar('\\')
                .build())
            .build();

            String[] header = csvReader.readNext();
            if (header == null) {
                result.errors.add("CSV file is empty");
                return result;
            }

            logger.info("CSV has {} columns: {}", header.length, String.join(", ", header));

            String[] row;
            while ((row = csvReader.readNext()) != null) {
                try {
                    String placeId = safeGet(row, COL_PLACE_ID);
                    String title = safeGet(row, COL_TITLE);

                    if (placeId == null || placeId.trim().isEmpty()) {
                        result.skippedCount++;
                        result.skippedIds.add("NO_PLACE_ID: " + title);
                        continue;
                    }

                    if (title == null || title.trim().isEmpty()) {
                        result.skippedCount++;
                        continue;
                    }

                    PG existingPg = pgRepository.findByGooglePlaceId(placeId.trim()).orElse(null);
                    PG pg;

                    if (existingPg != null) {
                        pg = updatePgEntity(existingPg, row, placeId, title, defaultCity, defaultOwner);
                        result.skippedCount++;
                    } else {
                        pg = buildPgEntity(row, placeId, title, defaultCity, defaultOwner);
                        result.importedCount++;
                    }

                    pgRepository.save(pg);

                } catch (Exception e) {
                    result.errorCount++;
                    String title = safeGet(row, COL_TITLE);
                    result.errors.add("Error importing '" + title + "': " + e.getMessage());
                    logger.error("Error importing row: {}", title, e);
                }
            }

            csvReader.close();
            logger.info("Import finished: {} imported, {} skipped, {} errors",
                result.importedCount, result.skippedCount, result.errorCount);

        } catch (Exception e) {
            result.errorCount++;
            result.errors.add("Error reading CSV file: " + e.getMessage());
            logger.error("Error reading CSV file", e);
        }

        return result;
    }

    public ImportResult importReviewsFromCsv(MultipartFile file) {
        ImportResult result = new ImportResult();

        try {
            User reviewUser = getOrCreateGoogleReviewsUser();

            CSVReader csvReader = new CSVReaderBuilder(
                new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
            )
            .withCSVParser(new CSVParserBuilder()
                .withSeparator(',')
                .withQuoteChar('"')
                .withEscapeChar('\\')
                .build())
            .build();

            String[] header = csvReader.readNext();
            if (header == null) {
                result.errors.add("CSV file is empty");
                return result;
            }

            String[] row;
            while ((row = csvReader.readNext()) != null) {
                try {
                    String placeId = safeGet(row, COL_PLACE_ID);
                    if (placeId == null || placeId.trim().isEmpty()) continue;

                    PG pg = pgRepository.findByGooglePlaceId(placeId.trim()).orElse(null);
                    if (pg == null) {
                        result.skippedCount++;
                        continue;
                    }

                    String reviewsJson = safeGet(row, COL_USER_REVIEWS);
                    if (reviewsJson == null || reviewsJson.isEmpty()) continue;

                    List<Map<String, Object>> reviewList = objectMapper.readValue(
                        reviewsJson, new TypeReference<List<Map<String, Object>>>() {});

                    int imported = 0;
                    for (Map<String, Object> reviewData : reviewList) {
                        try {
                            String reviewerName = (String) reviewData.get("Name");
                            String description = (String) reviewData.get("Description");

                            boolean exists = pg.getReviews().stream().anyMatch(r ->
                                r.getComment().contains(reviewerName != null ? reviewerName : "") &&
                                r.getComment().contains(description != null ? description : ""));
                            if (exists) continue;

                            Review review = new Review();
                            review.setPg(pg);
                            review.setUser(reviewUser);

                            Object ratingObj = reviewData.get("Rating");
                            review.setRating(ratingObj != null ? ((Number) ratingObj).intValue() : 5);

                            String comment = "";
                            if (reviewerName != null && !reviewerName.isEmpty()) {
                                comment = "[" + reviewerName + "] ";
                            }
                            comment += description != null ? description : "";
                            review.setComment(comment);

                            String publishedAt = (String) reviewData.get("published_at");
                            if (publishedAt != null && !publishedAt.isEmpty()) {
                                try {
                                    review.setCreatedAt(LocalDateTime.parse(publishedAt.substring(0, 19)));
                                } catch (Exception pe) {
                                    logger.debug("Failed to parse date: {}", publishedAt);
                                }
                            }

                            pg.getReviews().add(review);
                            imported++;
                        } catch (Exception e) {
                            logger.warn("Failed to parse review for PG '{}': {}", pg.getTitle(), e.getMessage());
                        }
                    }

                    if (imported > 0) {
                        pgRepository.save(pg);
                        result.importedCount += imported;
                    }

                } catch (Exception e) {
                    result.errorCount++;
                    result.errors.add("Error: " + e.getMessage());
                }
            }

            csvReader.close();
            logger.info("Reviews import finished: {} imported, {} skipped, {} errors",
                result.importedCount, result.skippedCount, result.errorCount);

        } catch (Exception e) {
            result.errorCount++;
            result.errors.add("Error reading CSV file: " + e.getMessage());
        }

        return result;
    }

    private PG updatePgEntity(PG pg, String[] row, String placeId, String title, String defaultCity, User owner) {
        pg.setTitle(title.trim());
        String addr = safeGet(row, COL_ADDRESS);
        pg.setAddress(addr != null ? addr : "Address not provided");
        pg.setPhone(safeGet(row, COL_PHONE));
        String website = safeGet(row, COL_WEBSITE);
        if (website != null && website.length() > 255) {
            website = website.substring(0, 255);
        }
        pg.setWebsite(website);
        pg.setLatitude(parseDouble(safeGet(row, COL_LATITUDE)));
        pg.setLongitude(parseDouble(safeGet(row, COL_LONGITUDE)));

        String city = determineCity(safeGet(row, COL_ADDRESS), safeGet(row, COL_COMPLETE_ADDRESS), defaultCity);
        pg.setCity(city);
        pg.setState(CITY_STATE_MAP.getOrDefault(city.toLowerCase(), "Unknown"));
        pg.setGenderType(inferGenderType(title));
        pg.setDescription("Imported from Google Maps: " + title);

        pg.getImages().clear();
        String thumbnail = safeGet(row, COL_THUMBNAIL);
        String imagesJson = safeGet(row, COL_IMAGES);

        if (thumbnail != null && !thumbnail.isEmpty() && !thumbnail.contains("streetviewpixels")) {
            String localUrl = downloadImage(thumbnail, placeId + "_thumb");
            if (localUrl != null) {
                pg.getImages().add(new Image(localUrl, true, pg));
            }
        }

        if (imagesJson != null && !imagesJson.isEmpty()) {
            try {
                List<Map<String, String>> imageList = objectMapper.readValue(
                    imagesJson, new TypeReference<List<Map<String, String>>>() {});
                int idx = 0;
                for (Map<String, String> imgData : imageList) {
                    String imgUrl = imgData.get("image");
                    if (imgUrl != null && !imgUrl.isEmpty() && !imgUrl.contains("streetviewpixels")) {
                        String localUrl = downloadImage(imgUrl, placeId + "_upsert_" + idx);
                        if (localUrl != null) {
                            boolean isPrimary = pg.getImages().isEmpty();
                            pg.getImages().add(new Image(localUrl, isPrimary, pg));
                        }
                        idx++;
                    }
                }
            } catch (Exception e) {
                logger.warn("Failed to parse images JSON for '{}': {}", title, e.getMessage());
            }
        }

        if (pg.getImages().isEmpty() && thumbnail != null && !thumbnail.isEmpty()) {
            String localUrl = downloadImage(thumbnail, placeId + "_fallback");
            if (localUrl != null) {
                pg.getImages().add(new Image(localUrl, true, pg));
            }
        }

        User reviewUser = getOrCreateGoogleReviewsUser();
        pg.getReviews().removeIf(r -> r.getUser().getId().equals(reviewUser.getId()));

        String reviewsJson = safeGet(row, COL_USER_REVIEWS);
        if (reviewsJson != null && !reviewsJson.isEmpty()) {
            try {
                List<Map<String, Object>> reviewList = objectMapper.readValue(
                    reviewsJson, new TypeReference<List<Map<String, Object>>>() {});
                for (Map<String, Object> reviewData : reviewList) {
                    try {
                        Review review = new Review();
                        review.setPg(pg);
                        review.setUser(reviewUser);

                        Object ratingObj = reviewData.get("Rating");
                        if (ratingObj != null) {
                            review.setRating(((Number) ratingObj).intValue());
                        } else {
                            review.setRating(5);
                        }

                        String description = (String) reviewData.get("Description");
                        review.setComment(description != null ? description : "");

                        String publishedAt = (String) reviewData.get("published_at");
                        if (publishedAt != null && !publishedAt.isEmpty()) {
                            try {
                                review.setCreatedAt(LocalDateTime.parse(publishedAt.substring(0, 19)));
                            } catch (Exception pe) {
                                logger.debug("Failed to parse date: {}", publishedAt);
                            }
                        }

                        String reviewerName = (String) reviewData.get("Name");
                        if (reviewerName != null && !reviewerName.isEmpty()) {
                            review.setComment("[" + reviewerName + "] " + review.getComment());
                        }

                        pg.getReviews().add(review);
                    } catch (Exception e) {
                        logger.warn("Failed to parse review for '{}': {}", title, e.getMessage());
                    }
                }
            } catch (Exception e) {
                logger.warn("Failed to parse reviews JSON for '{}': {}", title, e.getMessage());
            }
        }

        return pg;
    }

    private PG buildPgEntity(String[] row, String placeId, String title, String defaultCity, User owner) {
        PG pg = new PG();

        pg.setTitle(title.trim());
        String addr = safeGet(row, COL_ADDRESS);
        pg.setAddress(addr != null ? addr : "Address not provided");
        pg.setOwner(owner);
        pg.setSource("GOOGLE_MAPS");
        pg.setGooglePlaceId(placeId.trim());
        pg.setPhone(safeGet(row, COL_PHONE));
        String website = safeGet(row, COL_WEBSITE);
        if (website != null && website.length() > 255) {
            website = website.substring(0, 255);
        }
        pg.setWebsite(website);
        pg.setGoogleMapsUrl("https://maps.google.com/maps/place/?q=place_id:" + placeId);
        pg.setLatitude(parseDouble(safeGet(row, COL_LATITUDE)));
        pg.setLongitude(parseDouble(safeGet(row, COL_LONGITUDE)));

        String city = determineCity(safeGet(row, COL_ADDRESS), safeGet(row, COL_COMPLETE_ADDRESS), defaultCity);
        pg.setCity(city);
        pg.setState(CITY_STATE_MAP.getOrDefault(city.toLowerCase(), "Unknown"));

        pg.setSlug(generateSlug(title, placeId));
        pg.setPrice(0.0);
        pg.setGenderType(inferGenderType(title));
        pg.setSharingType("SINGLE");
        pg.setDescription("Imported from Google Maps: " + title);
        pg.setRules("Standard PG rules apply. Contact owner for details.");

        pg.setImages(new ArrayList<>());
        pg.setReviews(new ArrayList<>());

        String thumbnail = safeGet(row, COL_THUMBNAIL);
        String imagesJson = safeGet(row, COL_IMAGES);

        if (thumbnail != null && !thumbnail.isEmpty() && !thumbnail.contains("streetviewpixels")) {
            String localUrl = downloadImage(thumbnail, placeId + "_thumb");
            if (localUrl != null) {
                pg.getImages().add(new Image(localUrl, true, pg));
            }
        }

        if (imagesJson != null && !imagesJson.isEmpty()) {
            try {
                List<Map<String, String>> imageList = objectMapper.readValue(
                    imagesJson, new TypeReference<List<Map<String, String>>>() {});
                int idx = 0;
                for (Map<String, String> imgData : imageList) {
                    String imgUrl = imgData.get("image");
                    if (imgUrl != null && !imgUrl.isEmpty() && !imgUrl.contains("streetviewpixels")) {
                        String localUrl = downloadImage(imgUrl, placeId + "_" + idx);
                        if (localUrl != null) {
                            boolean isPrimary = pg.getImages().isEmpty();
                            pg.getImages().add(new Image(localUrl, isPrimary, pg));
                        }
                        idx++;
                    }
                }
            } catch (Exception e) {
                logger.warn("Failed to parse images JSON for '{}': {}", title, e.getMessage());
            }
        }

        if (pg.getImages().isEmpty() && thumbnail != null && !thumbnail.isEmpty()) {
            String localUrl = downloadImage(thumbnail, placeId + "_fallback");
            if (localUrl != null) {
                pg.getImages().add(new Image(localUrl, true, pg));
            }
        }

        User reviewUser = getOrCreateGoogleReviewsUser();

        String reviewsJson = safeGet(row, COL_USER_REVIEWS);
        if (reviewsJson != null && !reviewsJson.isEmpty()) {
            try {
                List<Map<String, Object>> reviewList = objectMapper.readValue(
                    reviewsJson, new TypeReference<List<Map<String, Object>>>() {});
                for (Map<String, Object> reviewData : reviewList) {
                    try {
                        Review review = new Review();
                        review.setPg(pg);
                        review.setUser(reviewUser);

                        Object ratingObj = reviewData.get("Rating");
                        if (ratingObj != null) {
                            review.setRating(((Number) ratingObj).intValue());
                        } else {
                            review.setRating(5);
                        }

                        String description = (String) reviewData.get("Description");
                        review.setComment(description != null ? description : "");

                        String publishedAt = (String) reviewData.get("published_at");
                        if (publishedAt != null && !publishedAt.isEmpty()) {
                            try {
                                review.setCreatedAt(LocalDateTime.parse(publishedAt.substring(0, 19)));
                            } catch (Exception pe) {
                                logger.debug("Failed to parse date: {}", publishedAt);
                            }
                        }

                        String reviewerName = (String) reviewData.get("Name");
                        if (reviewerName != null && !reviewerName.isEmpty()) {
                            review.setComment("[" + reviewerName + "] " + review.getComment());
                        }

                        pg.getReviews().add(review);
                    } catch (Exception e) {
                        logger.warn("Failed to parse review for '{}': {}", title, e.getMessage());
                    }
                }
            } catch (Exception e) {
                logger.warn("Failed to parse reviews JSON for '{}': {}", title, e.getMessage());
            }
        }

        return pg;
    }

    private User getOrCreateGoogleReviewsUser() {
        return userRepository.findByEmail("reviews@google-maps.local").orElseGet(() -> {
            User user = new User();
            user.setName("Google Reviews");
            user.setEmail("reviews@google-maps.local");
            user.setPassword("not-a-real-password");
            user.setRole(UserRole.ROLE_USER);
            return userRepository.save(user);
        });
    }

    private String determineCity(String address, String completeAddress, String defaultCity) {
        String combined = (address != null ? address : "") + " " + (completeAddress != null ? completeAddress : "");
        String lower = combined.toLowerCase();

        for (String city : CITY_STATE_MAP.keySet()) {
            if (lower.contains(city)) {
                return city.substring(0, 1).toUpperCase() + city.substring(1);
            }
        }

        return defaultCity != null ? defaultCity : "Unknown";
    }

    private String inferGenderType(String title) {
        if (title == null) return "UNISEX";
        String lower = title.toLowerCase();
        if (lower.contains("boys") || lower.contains("men") || lower.contains("male") || lower.contains("gentlemen")) {
            return "MALE";
        }
        if (lower.contains("girls") || lower.contains("women") || lower.contains("female") || lower.contains("ladies")) {
            return "FEMALE";
        }
        return "UNISEX";
    }

    private String generateSlug(String title, String placeId) {
        String baseSlug = title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        String shortId = placeId.length() > 8 ? placeId.substring(placeId.length() - 8) : placeId;
        return baseSlug + "-" + shortId;
    }

    private String safeGet(String[] row, int index) {
        if (index < row.length) {
            String val = row[index];
            return (val != null && !val.trim().isEmpty()) ? val.trim() : null;
        }
        return null;
    }

    private Double parseDouble(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String downloadImage(String url, String filename) {
        try {
            Files.createDirectories(IMAGES_DIR);

            String extension = ".jpg";
            if (url.contains("png")) extension = ".png";
            String safeName = filename.replaceAll("[^a-zA-Z0-9_\\-]", "_") + extension;
            Path filePath = IMAGES_DIR.resolve(safeName);

            if (Files.exists(filePath)) {
                return IMAGES_BASE_URL + safeName;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (compatible; LivioBot/1.0)");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, byte[].class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                try (OutputStream os = Files.newOutputStream(filePath)) {
                    os.write(response.getBody());
                }
                logger.info("Downloaded image: {}", safeName);
                return IMAGES_BASE_URL + safeName;
            }
        } catch (Exception e) {
            logger.warn("Failed to download image from {}: {}", url, e.getMessage());
        }
        return null;
    }
}
