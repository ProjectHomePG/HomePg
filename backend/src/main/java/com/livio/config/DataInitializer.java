package com.livio.config;

import com.livio.entity.Amenity;
import com.livio.entity.User;
import com.livio.entity.UserRole;
import com.livio.repository.AmenityRepository;
import com.livio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        relaxInquiryPgConstraint();
        if (userRepository.count() == 0) {
            // Seed Users
            User customer = new User("John Doe", "john@example.com", "password", "+91 98765 43210", UserRole.ROLE_USER);
            User owner = new User("Jane Proprietor", "owner@example.com", "password", "+91 98765 43211", UserRole.ROLE_OWNER);
            User admin = new User("Super Admin", "admin@example.com", "password", "+91 98765 43212", UserRole.ROLE_ADMIN);

            userRepository.save(customer);
            userRepository.save(owner);
            userRepository.save(admin);

            // Seed Amenities
            amenityRepository.save(new Amenity("WiFi", "Wifi"));
            amenityRepository.save(new Amenity("Air Conditioning", "Wind"));
            amenityRepository.save(new Amenity("3 Meals Daily", "Coffee"));
            amenityRepository.save(new Amenity("Power Backup", "Zap"));
            amenityRepository.save(new Amenity("Housekeeping", "Sparkles"));
            amenityRepository.save(new Amenity("Gym", "Dumbbell"));
            amenityRepository.save(new Amenity("Biometric Security", "Shield"));
            amenityRepository.save(new Amenity("Laundry Service", "Shirt"));
            amenityRepository.save(new Amenity("Kitchen Access", "ChefHat"));
            amenityRepository.save(new Amenity("TV Lounge", "Tv"));
            amenityRepository.save(new Amenity("Dedicated Desk", "Laptop"));
            amenityRepository.save(new Amenity("Game Room", "Gamepad2"));
            amenityRepository.save(new Amenity("Washing Machine", "WashingMachine"));
            amenityRepository.save(new Amenity("CCTV Security", "Camera"));
            amenityRepository.save(new Amenity("Study Tables", "BookOpen"));
            amenityRepository.save(new Amenity("Purified Water", "Droplet"));
        }
        // No demo PGs are seeded: listings come only from the Google Maps scraper import.
    }

    private void relaxInquiryPgConstraint() {
        String[] statements = {
            "ALTER TABLE inquiries ALTER COLUMN pg_id DROP NOT NULL",
            "ALTER TABLE inquiries MODIFY pg_id BIGINT NULL"
        };
        for (String statement : statements) {
            try {
                jdbcTemplate.execute(statement);
                return;
            } catch (Exception ignored) {
            }
        }
    }
}
