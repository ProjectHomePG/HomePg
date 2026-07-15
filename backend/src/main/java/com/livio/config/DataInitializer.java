package com.livio.config;

import com.livio.entity.Amenity;
import com.livio.entity.Image;
import com.livio.entity.NearbyPlace;
import com.livio.entity.PG;
import com.livio.entity.Review;
import com.livio.entity.User;
import com.livio.entity.UserRole;
import com.livio.repository.AmenityRepository;
import com.livio.repository.ImageRepository;
import com.livio.repository.PGRepository;
import com.livio.repository.ReviewRepository;
import com.livio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Users
            User customer = new User("John Doe", "john@example.com", "password", "+1 234 567 890", UserRole.ROLE_USER);
            User owner = new User("Jane Proprietor", "owner@example.com", "password", "+1 987 654 325", UserRole.ROLE_OWNER);
            User admin = new User("Super Admin", "admin@example.com", "password", "+1 111 222 333", UserRole.ROLE_ADMIN);

            userRepository.save(customer);
            userRepository.save(owner);
            userRepository.save(admin);

            // Seed Amenities
            Amenity wifi = amenityRepository.save(new Amenity("WiFi", "Wifi"));
            Amenity ac = amenityRepository.save(new Amenity("Air Conditioning", "Wind"));
            Amenity meals3 = amenityRepository.save(new Amenity("3 Meals Daily", "Coffee"));
            Amenity power = amenityRepository.save(new Amenity("Power Backup", "Zap"));
            Amenity housekeeping = amenityRepository.save(new Amenity("Housekeeping", "Sparkles"));
            Amenity gym = amenityRepository.save(new Amenity("Gym", "Dumbbell"));
            Amenity bioSec = amenityRepository.save(new Amenity("Biometric Security", "Shield"));
            Amenity laundry = amenityRepository.save(new Amenity("Laundry Service", "Shirt"));
            Amenity kitchen = amenityRepository.save(new Amenity("Kitchen Access", "ChefHat"));
            Amenity tvLounge = amenityRepository.save(new Amenity("TV Lounge", "Tv"));
            Amenity desk = amenityRepository.save(new Amenity("Dedicated Desk", "Laptop"));
            Amenity game = amenityRepository.save(new Amenity("Game Room", "Gamepad2"));
            Amenity wash = amenityRepository.save(new Amenity("Washing Machine", "WashingMachine"));
            Amenity cctv = amenityRepository.save(new Amenity("CCTV Security", "Camera"));
            Amenity study = amenityRepository.save(new Amenity("Study Tables", "BookOpen"));
            Amenity water = amenityRepository.save(new Amenity("Purified Water", "Droplet"));

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

            // Connect Amenities to PGs
            pg1.getAmenities().addAll(List.of(wifi, ac, meals3, power, housekeeping, gym));
            pg2.getAmenities().addAll(List.of(wifi, ac, bioSec, laundry, kitchen, tvLounge));
            pg3.getAmenities().addAll(List.of(wifi, ac, desk, game, wash, cctv));
            pg4.getAmenities().addAll(List.of(wifi, study, meals3, water, power));

            // Seed Nearby Places
            pg1.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Manyata Tech Park", "0.2 km", "OFFICE"),
                new NearbyPlace("Hebbal Metro Station", "1.5 km", "METRO"),
                new NearbyPlace("Aster CMI Hospital", "2.1 km", "HOSPITAL"),
                new NearbyPlace("Reva University", "4.5 km", "COLLEGE")
            ));
            pg2.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("NIFT College", "0.6 km", "COLLEGE"),
                new NearbyPlace("HSR Metro Station (Upcoming)", "1.0 km", "METRO"),
                new NearbyPlace("Narayana Multispeciality Hospital", "1.2 km", "HOSPITAL"),
                new NearbyPlace("Koramangala Tech Parks", "2.0 km", "OFFICE")
            ));
            pg3.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Sohna Road IT Parks", "0.4 km", "OFFICE"),
                new NearbyPlace("HUDA City Centre Metro", "3.5 km", "METRO"),
                new NearbyPlace("Medanta Medicity", "2.8 km", "HOSPITAL"),
                new NearbyPlace("GD Goenka University Shuttle", "0.2 km", "COLLEGE")
            ));
            pg4.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Delhi University (DU) North Campus", "0.5 km", "COLLEGE"),
                new NearbyPlace("Vishwavidyalaya Metro Station", "0.8 km", "METRO"),
                new NearbyPlace("Kamla Nagar Market", "0.1 km", "OFFICE"),
                new NearbyPlace("Hindu Rao Hospital", "2.3 km", "HOSPITAL")
            ));

            // Save PGs (this will cascade save amenities relations join records and element collection list)
            pgRepository.save(pg1);
            pgRepository.save(pg2);
            pgRepository.save(pg3);
            pgRepository.save(pg4);

            // Seed Images (need saved PG objects references)
            imageRepository.save(new Image("/images/room-1.png", true, pg1));
            imageRepository.save(new Image("/images/room-2.png", false, pg1));
            imageRepository.save(new Image("/images/room-3.png", false, pg1));

            imageRepository.save(new Image("/images/room-4.png", true, pg2));
            imageRepository.save(new Image("/images/room-2.png", false, pg2));
            imageRepository.save(new Image("/images/room-5.png", false, pg2));

            imageRepository.save(new Image("/images/room-5.png", true, pg3));
            imageRepository.save(new Image("/images/room-1.png", false, pg3));
            imageRepository.save(new Image("/images/room-3.png", false, pg3));

            imageRepository.save(new Image("/images/room-2.png", true, pg4));
            imageRepository.save(new Image("/images/room-3.png", false, pg4));

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
