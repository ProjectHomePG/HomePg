package com.livio.service;

import com.livio.entity.PG;
import java.util.List;

public interface PGService {
    PG create(PG pg);
    PG update(Long id, PG pgDetails);
    void delete(Long id);
    PG getById(Long id);
    PG getBySlug(String slug);
    List<PG> getAll();
}
