package com.pgnearme.service.impl;

import com.pgnearme.entity.PG;
import com.pgnearme.repository.PGRepository;
import com.pgnearme.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private PGRepository pgRepository;

    @Override
    public List<PG> search(String query, String gender, String sharing, Double minPrice, Double maxPrice) {
        List<PG> allPgs = pgRepository.findAll();

        // Perform mock/placeholder filter streaming
        return allPgs.stream()
                .filter(pg -> query == null || query.isEmpty() ||
                        pg.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                        pg.getCity().toLowerCase().contains(query.toLowerCase()) ||
                        pg.getAddress().toLowerCase().contains(query.toLowerCase()))
                .filter(pg -> gender == null || gender.equals("ALL") || pg.getGenderType().equalsIgnoreCase(gender))
                .filter(pg -> sharing == null || sharing.equals("ALL") || pg.getSharingType().equalsIgnoreCase(sharing))
                .filter(pg -> minPrice == null || pg.getPrice() >= minPrice)
                .filter(pg -> maxPrice == null || pg.getPrice() <= maxPrice)
                .collect(Collectors.toList());
    }
}
