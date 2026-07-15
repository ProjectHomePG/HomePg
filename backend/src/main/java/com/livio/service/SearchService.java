package com.livio.service;

import com.livio.entity.PG;
import java.util.List;

public interface SearchService {
    List<PG> search(String query, String gender, String sharing, Double minPrice, Double maxPrice);
}
