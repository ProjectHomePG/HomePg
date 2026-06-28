package com.pgnearme.service;

import com.pgnearme.entity.PG;
import java.util.List;

public interface SearchService {
    List<PG> search(String query, String gender, String sharing, Double minPrice, Double maxPrice);
}
