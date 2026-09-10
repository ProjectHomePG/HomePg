package com.livio.service;

import com.livio.entity.PG;
import com.livio.entity.User;
import com.livio.repository.PGRepository;
import com.livio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Service
public class OSMSyncService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private UserRepository userRepository;

    public int syncPlaces(String city) {
        String escapedCity = city.replace("\"", "\\\"");
        String overpassQuery = "[out:json];\n" +
                "(\n" +
                "  node[\"tourism\"=\"hostel\"][\"addr:city\"~\"" + escapedCity + "\",i];\n" +
                "  node[\"building\"=\"dormitory\"][\"addr:city\"~\"" + escapedCity + "\",i];\n" +
                "  node[\"tourism\"=\"hostel\"][\"name\"~\"" + escapedCity + "\",i];\n" +
                "  node[\"building\"=\"dormitory\"][\"name\"~\"" + escapedCity + "\",i];\n" +
                ");\n" +
                "out center;";

        URI uri = UriComponentsBuilder.fromHttpUrl("https://overpass-api.de/api/interpreter")
                .queryParam("data", overpassQuery)
                .build()
                .toUri();

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(uri, Map.class);
            if (response == null || !response.containsKey("elements")) {
                return 0;
            }

            List<Map<String, Object>> elements = (List<Map<String, Object>>) response.get("elements");
            int count = 0;

            User defaultOwner = userRepository.findById(1L).orElse(
                    userRepository.findById(2L).orElse(null)
            );

            for (Map<String, Object> element : elements) {
                Map<String, String> tags = (Map<String, String>) element.get("tags");
                if (tags == null) continue;

                String name = tags.get("name");
                if (name == null || name.trim().isEmpty()) {
                    name = "PG / Hostel " + element.get("id");
                }

                String slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "") + "-" + element.get("id");
                
                if (pgRepository.findBySlug(slug).isPresent()) {
                    continue; 
                }

                String address = tags.getOrDefault("addr:street", "") + " " + tags.getOrDefault("addr:housenumber", "");
                if (address.trim().isEmpty()) {
                    address = "Location from OpenStreetMap";
                }

                PG pg = new PG();
                pg.setTitle(name);
                pg.setAddress(address.trim());
                pg.setSlug(slug);
                pg.setDescription("Imported from OpenStreetMap: " + name);
                pg.setCity(city);
                pg.setState("Unknown");
                pg.setZipCode(tags.getOrDefault("addr:postcode", "000000"));
                pg.setPrice(0.0);
                pg.setRules("Standard PG rules apply.");
                pg.setGenderType("UNISEX");
                pg.setSharingType("SINGLE");
                
                if (defaultOwner != null) {
                    pg.setOwner(defaultOwner);
                }
                
                pgRepository.save(pg);
                count++;
            }
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
