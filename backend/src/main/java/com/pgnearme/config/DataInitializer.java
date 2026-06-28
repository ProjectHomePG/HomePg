package com.pgnearme.config;

import com.pgnearme.entity.PG;
import com.pgnearme.entity.Review;
import com.pgnearme.entity.User;
import com.pgnearme.entity.UserRole;
import com.pgnearme.repository.PGRepository;
import com.pgnearme.repository.ReviewRepository;
import com.pgnearme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Users
            User customer = new User("John Doe", "john@example.com", "password", "+1 234 567 890", UserRole.ROLE_USER);
            User owner = new User("Jane Proprietor", "owner@example.com", "password", "+1 987 654 321", UserRole.ROLE_OWNER);
            User admin = new User("Super Admin", "admin@example.com", "password", "+1 111 222 333", UserRole.ROLE_ADMIN);

            userRepository.save(customer);
            userRepository.save(owner);
            userRepository.save(admin);

            // Seed PGs
            PG pg1 = new PG(
                "Stanza Living Dublin House",
                "Premium fully managed single and double sharing rooms for boys/men near Manyata Tech Park. Includes high-speed WiFi, daily professional housekeeping, delicious 3-time meals, and modern lounge spaces.",
                "stanza-living-dublin-house",
                "24, Near Gate 5, Manyata Tech Park Road, Hebbal",
                "Bangalore",
                "Karnataka",
                "560045",
                9500.0,
                "No outside guests after 10 PM. Silent hours from 11 PM to 6 AM. ID verification mandatory. No pets allowed.",
                "MALE",
                "DOUBLE",
                owner
            );

            PG pg2 = new PG(
                "Zolo Stay Nest Girls PG",
                "Secure and elegant girls-only PG accommodation situated in HSR Layout Sector 3. High-class security, biometric access, fully furnished spacious rooms, high-speed WiFi, laundry services, and home-style veg/non-veg meals.",
                "zolo-stay-nest-girls-pg",
                "562, 17th Cross Road, Sector 3, HSR Layout",
                "Bangalore",
                "Karnataka",
                "560102",
                12000.0,
                "In-time 10:30 PM. No male visitors allowed in room area. Maintain cleanliness in common kitchen. Rent to be paid by 5th.",
                "FEMALE",
                "SINGLE",
                owner
            );

            PG pg3 = new PG(
                "CoHo Premium Unisex Living",
                "Co-living space in Sector 48 near Cyber City. Perfect for working professionals. Offers studio rooms with pantry, smart TV, gaming zone, weekly community events, washing machine, and dedicated workspace.",
                "coho-premium-unisex-living",
                "Plot 89, Sector 48, Near Sohna Road",
                "Gurugram",
                "Haryana",
                "122001",
                15500.0,
                "Respect community members. Keep pet policy strictly validated. No loud noise after midnight. Smoking in designated areas only.",
                "UNISEX",
                "SINGLE",
                owner
            );

            PG pg4 = new PG(
                "Saraswati Boys Hostels",
                "Affordable shared PG accommodation for students near Delhi University North Campus. High frequency transport connection, nutritious meals, study rooms, 24x7 water and power backup.",
                "saraswati-boys-hostels",
                "Block C, 14, Kamla Nagar",
                "Delhi",
                "Delhi",
                "110007",
                6800.0,
                "Entry close by 10 PM. No alcohol permitted inside premises. Keep study areas quiet. Clean beds daily.",
                "MALE",
                "TRIPLE",
                owner
            );

            pgRepository.save(pg1);
            pgRepository.save(pg2);
            pgRepository.save(pg3);
            pgRepository.save(pg4);

            // Seed Reviews
            Review rev1 = new Review(5, "Absolutely loved the environment! The food is hygienic and tastes like home. Very close to Manyata Gate 5.", customer, pg1);
            Review rev2 = new Review(4, "Housekeeping is top-notch. WiFi speed is great for WFH. Highly recommended boys PG.", customer, pg1);
            Review rev3 = new Review(5, "Extremely secure place with biometric locks. Walking distance to NIFT. Rooms are spacious and tidy.", customer, pg2);
            Review rev4 = new Review(4, "Nice environment. Food is good on most days. Host is very responsive to inquiries.", customer, pg2);

            reviewRepository.save(rev1);
            reviewRepository.save(rev2);
            reviewRepository.save(rev3);
            reviewRepository.save(rev4);
        }
    }
}
