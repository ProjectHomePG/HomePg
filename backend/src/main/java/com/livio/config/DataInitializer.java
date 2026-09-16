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
            User customer = new User("John Doe", "john@example.com", "password", "+91 98765 43210", UserRole.ROLE_USER);
            User owner = new User("Jane Proprietor", "owner@example.com", "password", "+91 98765 43211", UserRole.ROLE_OWNER);
            User admin = new User("Super Admin", "admin@example.com", "password", "+91 98765 43212", UserRole.ROLE_ADMIN);

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

            // --- 1. Stanza Living Dublin House (Bangalore) ---
            PG pg1 = createPG(
                "Stanza Living Dublin House",
                "Premium fully managed single and double sharing rooms for boys near Manyata Tech Park. Includes high-speed WiFi, daily professional housekeeping, delicious 3-time meals, and modern lounge spaces.",
                "stanza-living-dublin-house",
                "24, Near Gate 5, Manyata Tech Park Road, Hebbal", "Bangalore", "Karnataka", "560045",
                9500.0, "No outside guests after 10 PM. ID verification mandatory.", "MALE", "DOUBLE", 13.0489, 77.6200, owner
            );
            pg1.getAmenities().addAll(List.of(wifi, ac, meals3, power, housekeeping, gym));
            pg1.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Manyata Tech Park", "0.2 km", "OFFICE"),
                new NearbyPlace("Hebbal Metro Station", "1.5 km", "METRO"),
                new NearbyPlace("Aster CMI Hospital", "2.1 km", "HOSPITAL")
            ));
            pgRepository.save(pg1);
            saveImages(pg1,
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Top-tier boys PG with great food and ultra-fast WiFi.", customer, pg1));
            reviewRepository.save(new Review(4, "Housekeeping is punctual. Very close to Manyata.", customer, pg1));

            // --- 2. Zolo Stay Nest Girls PG (Bangalore) ---
            PG pg2 = createPG(
                "Zolo Stay Nest Girls PG",
                "Secure and elegant girls-only PG accommodation situated in HSR Layout Sector 3. Biometric access, fully furnished spacious rooms, high-speed WiFi, laundry services, and home-style veg/non-veg meals.",
                "zolo-stay-nest-girls-pg",
                "562, 17th Cross Road, Sector 3, HSR Layout", "Bangalore", "Karnataka", "560102",
                12000.0, "In-time 10:30 PM. No male visitors allowed in room area.", "FEMALE", "SINGLE", 12.9116, 77.6389, owner
            );
            pg2.getAmenities().addAll(List.of(wifi, ac, bioSec, laundry, kitchen, tvLounge));
            pg2.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("NIFT College", "0.6 km", "COLLEGE"),
                new NearbyPlace("HSR Metro Station", "1.0 km", "METRO"),
                new NearbyPlace("Narayana Multispeciality Hospital", "1.2 km", "HOSPITAL")
            ));
            pgRepository.save(pg2);
            saveImages(pg2,
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Extremely secure place with biometric locks. Walking distance to NIFT.", customer, pg2));

            // --- 3. CoHo Premium Unisex Living (Gurugram) ---
            PG pg3 = createPG(
                "CoHo Premium Unisex Living",
                "Co-living space in Sector 48 near Cyber City. Perfect for working professionals. Offers studio rooms with pantry, smart TV, gaming zone, weekly community events, washing machine, and dedicated workspace.",
                "coho-premium-unisex-living",
                "Plot 89, Sector 48, Near Sohna Road", "Gurugram", "Haryana", "122001",
                15500.0, "Respect community members. Quiet hours after midnight.", "UNISEX", "SINGLE", 28.4239, 77.0396, owner
            );
            pg3.getAmenities().addAll(List.of(wifi, ac, desk, game, wash, cctv));
            pg3.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Sohna Road IT Parks", "0.4 km", "OFFICE"),
                new NearbyPlace("HUDA City Centre Metro", "3.5 km", "METRO"),
                new NearbyPlace("Medanta Medicity", "2.8 km", "HOSPITAL")
            ));
            pgRepository.save(pg3);
            saveImages(pg3,
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Best co-living experience in Gurgaon with lively community.", customer, pg3));

            // --- 4. Saraswati Boys Hostels (Delhi) ---
            PG pg4 = createPG(
                "Saraswati Boys Hostels",
                "Affordable shared PG accommodation for students near Delhi University North Campus. High frequency transport connection, nutritious meals, study rooms, 24x7 water and power backup.",
                "saraswati-boys-hostels",
                "Block C, 14, Kamla Nagar", "Delhi", "Delhi", "110007",
                6800.0, "Entry close by 10 PM. Clean beds daily.", "MALE", "TRIPLE", 28.6802, 77.2023, owner
            );
            pg4.getAmenities().addAll(List.of(wifi, study, meals3, water, power));
            pg4.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Delhi University North Campus", "0.5 km", "COLLEGE"),
                new NearbyPlace("Vishwavidyalaya Metro Station", "0.8 km", "METRO")
            ));
            pgRepository.save(pg4);
            saveImages(pg4,
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(4, "Affordable and close to campus. Good food.", customer, pg4));

            // --- 5. Livio Elite Co-Living Spaces (Mumbai) ---
            PG pg5 = createPG(
                "Livio Elite Co-Living Spaces",
                "Luxury unisex co-living in Powai near IIT Bombay and Hiranandani Business Park. High-end interiors, gymnasium, housekeeping, gourmet kitchen, and scenic lake views.",
                "livio-elite-co-living-powai",
                "Tower B, Central Avenue, Hiranandani Gardens, Powai", "Mumbai", "Maharashtra", "400076",
                18000.0, "Maintain tranquility. Visitors permitted in common areas.", "UNISEX", "SINGLE", 19.1176, 72.9060, owner
            );
            pg5.getAmenities().addAll(List.of(wifi, ac, gym, bioSec, housekeeping, kitchen));
            pg5.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Hiranandani Business Park", "0.3 km", "OFFICE"),
                new NearbyPlace("IIT Bombay", "1.1 km", "COLLEGE"),
                new NearbyPlace("Powai Lake Promenade", "0.5 km", "PARK")
            ));
            pgRepository.save(pg5);
            saveImages(pg5,
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Luxurious, peaceful, and super convenient for Powai tech folks.", customer, pg5));

            // --- 6. Oxford Student PG & Hostel (Pune) ---
            PG pg6 = createPG(
                "Oxford Student PG & Hostel",
                "Premier student living near Symbiosis in Viman Nagar. Ergonomic study desks, high-speed fiber internet, cafeteria with North & South Indian meals, and round-the-clock security.",
                "oxford-student-pg-pune",
                "Plot 42, Clover Park, Viman Nagar", "Pune", "Maharashtra", "411014",
                8500.0, "Curfew 10 PM for 1st year students. Silent hours in study hall.", "MALE", "DOUBLE", 18.5679, 73.9143, owner
            );
            pg6.getAmenities().addAll(List.of(wifi, study, meals3, laundry, cctv, water));
            pg6.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Symbiosis International University", "0.8 km", "COLLEGE"),
                new NearbyPlace("Phoenix Marketcity", "1.2 km", "MALL"),
                new NearbyPlace("Pune Airport", "2.5 km", "AIRPORT")
            ));
            pgRepository.save(pg6);
            saveImages(pg6,
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Perfect study atmosphere and tasty food.", customer, pg6));

            // --- 7. Sri Sai Balaji Executive PG (Hyderabad) ---
            PG pg7 = createPG(
                "Sri Sai Balaji Executive PG",
                "Top-rated executive accommodation in Madhapur / Hitech City. Walking distance to Mindspace IT Park and Cyber Towers. 3 meals daily, daily cleaning, 24-hr power backup.",
                "sri-sai-balaji-executive-pg-hyderabad",
                "1-90/B, Silicon Valley, Madhapur", "Hyderabad", "Telangana", "500081",
                8000.0, "Gates lock at 11 PM. ID verification mandatory.", "MALE", "DOUBLE", 17.4483, 78.3915, owner
            );
            pg7.getAmenities().addAll(List.of(wifi, ac, meals3, power, housekeeping, wash));
            pg7.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Mindspace IT Park", "0.5 km", "OFFICE"),
                new NearbyPlace("Hitech City Metro Station", "0.7 km", "METRO"),
                new NearbyPlace("Inorbit Mall", "1.5 km", "MALL")
            ));
            pgRepository.save(pg7);
            saveImages(pg7,
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(4, "Great food and walking distance to office.", customer, pg7));

            // --- 8. Royal Palms Luxury PG for Women (Bangalore) ---
            PG pg8 = createPG(
                "Royal Palms Luxury PG for Women",
                "Exclusive boutique accommodation for female professionals in Koramangala 4th Block. High-speed WiFi, air-conditioned rooms, full biometric access, CCTV, organic food options.",
                "royal-palms-luxury-women-pg-koramangala",
                "102, 80 Feet Road, 4th Block, Koramangala", "Bangalore", "Karnataka", "560034",
                14500.0, "Security protocols strictly enforced. 24x7 female warden present.", "FEMALE", "SINGLE", 12.9352, 77.6245, owner
            );
            pg8.getAmenities().addAll(List.of(wifi, ac, bioSec, meals3, housekeeping, cctv, laundry));
            pg8.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Sony World Signal", "0.4 km", "TRANSIT"),
                new NearbyPlace("Wipro Park", "0.6 km", "PARK"),
                new NearbyPlace("Forum Mall", "1.8 km", "MALL")
            ));
            pgRepository.save(pg8);
            saveImages(pg8,
                "https://images.unsplash.com/photo-1540518614846-7ede433c4b69?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Safe, clean, and located in the heart of Koramangala.", customer, pg8));

            // --- 9. Metro View Executive PG (Delhi) ---
            PG pg9 = createPG(
                "Metro View Executive PG",
                "Spacious co-living space right outside Hauz Khas Metro Station. Ideal for professionals working in South Delhi and Gurgaon. AC, high-speed WiFi, furnished kitchen.",
                "metro-view-executive-pg-delhi",
                "C-12, Hauz Khas Enclave", "Delhi", "Delhi", "110016",
                13500.0, "Smoking in balcony only. Peaceful co-living.", "UNISEX", "SINGLE", 28.5494, 77.2001, owner
            );
            pg9.getAmenities().addAll(List.of(wifi, ac, kitchen, power, wash, desk));
            pg9.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Hauz Khas Metro Station", "0.1 km", "METRO"),
                new NearbyPlace("IIT Delhi", "1.0 km", "COLLEGE"),
                new NearbyPlace("AIIMS Hospital", "2.8 km", "HOSPITAL")
            ));
            pgRepository.save(pg9);
            saveImages(pg9,
                "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Unbeatable location right by the metro station.", customer, pg9));

            // --- 10. Shiv Shakti Mens PG (Pune) ---
            PG pg10 = createPG(
                "Shiv Shakti Mens PG",
                "Affordable gents PG in Hinjewadi Phase 1 near Infosys and Wipro circle. Homely food, hot water 24/7, daily cleaning, and bike parking.",
                "shiv-shakti-mens-pg-pune",
                "Behind Blue Ridge, Hinjewadi Phase 1", "Pune", "Maharashtra", "411057",
                6500.0, "No smoking inside rooms. Rent due on 1st.", "MALE", "TRIPLE", 18.5913, 73.7389, owner
            );
            pg10.getAmenities().addAll(List.of(wifi, meals3, water, power, cctv));
            pg10.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Infosys Hinjewadi", "0.8 km", "OFFICE"),
                new NearbyPlace("Wipro Circle", "1.1 km", "OFFICE"),
                new NearbyPlace("Xion Mall", "1.5 km", "MALL")
            ));
            pgRepository.save(pg10);
            saveImages(pg10,
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(4, "Economical stay with good food for IT workers.", customer, pg10));

            // --- 11. Serenity Co-Living & PG (Mumbai) ---
            PG pg11 = createPG(
                "Serenity Co-Living & PG",
                "Modern air-conditioned co-living near MIDC and SEEPZ in Andheri East. Fast metro access, gym, weekly laundry, and study workspace.",
                "serenity-co-living-andheri-mumbai",
                "Cross Road B, MIDC, Andheri East", "Mumbai", "Maharashtra", "400093",
                16000.0, "Valid ID card required. Quiet hours 11 PM to 7 AM.", "UNISEX", "DOUBLE", 19.1197, 72.8688, owner
            );
            pg11.getAmenities().addAll(List.of(wifi, ac, gym, laundry, desk, housekeeping));
            pg11.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("SEEPZ IT Zone", "0.6 km", "OFFICE"),
                new NearbyPlace("Chakala Metro Station", "1.2 km", "METRO"),
                new NearbyPlace("Mumbai International Airport", "3.0 km", "AIRPORT")
            ));
            pgRepository.save(pg11);
            saveImages(pg11,
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(5, "Very comfortable stay and easy commute to SEEPZ.", customer, pg11));

            // --- 12. Comfort Stay Girls Hostel (Noida) ---
            PG pg12 = createPG(
                "Comfort Stay Girls Hostel",
                "Safe, comfortable girls PG accommodation in Sector 62 Noida near institutional tech zone. Delicious 3-time meals, 24x7 security warden, power backup.",
                "comfort-stay-girls-hostel-noida",
                "B-Block, Sector 62, Near Fortis Hospital", "Noida", "Uttar Pradesh", "201309",
                7800.0, "Entry by 9:30 PM. CCTV monitored entrances.", "FEMALE", "DOUBLE", 28.6280, 77.3649, owner
            );
            pg12.getAmenities().addAll(List.of(wifi, meals3, bioSec, power, study, water));
            pg12.getNearbyPlaces().addAll(List.of(
                new NearbyPlace("Fortis Hospital Noida", "0.5 km", "HOSPITAL"),
                new NearbyPlace("Noida Electronic City Metro", "1.1 km", "METRO"),
                new NearbyPlace("Jaypee Institute of Information Tech", "1.4 km", "COLLEGE")
            ));
            pgRepository.save(pg12);
            saveImages(pg12,
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
            );
            reviewRepository.save(new Review(4, "Safe hostel for students and working women in Noida.", customer, pg12));
        }
    }

    private PG createPG(String title, String desc, String slug, String address, String city, String state, String zip,
                        Double price, String rules, String gender, String sharing, Double lat, Double lng, User owner) {
        PG pg = new PG(title, desc, slug, address, city, state, zip, price, rules, gender, sharing, owner);
        pg.setLatitude(lat);
        pg.setLongitude(lng);
        return pg;
    }

    private void saveImages(PG pg, String... urls) {
        boolean first = true;
        for (String url : urls) {
            imageRepository.save(new Image(url, first, pg));
            first = false;
        }
    }
}
