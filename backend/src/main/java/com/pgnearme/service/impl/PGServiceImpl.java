package com.pgnearme.service.impl;

import com.pgnearme.entity.PG;
import com.pgnearme.repository.PGRepository;
import com.pgnearme.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PGServiceImpl implements PGService {

    @Autowired
    private PGRepository pgRepository;

    @Override
    public PG create(PG pg) {
        return pgRepository.save(pg);
    }

    @Override
    public PG update(Long id, PG pgDetails) {
        PG pg = getById(id);
        pg.setTitle(pgDetails.getTitle());
        pg.setDescription(pgDetails.getDescription());
        pg.setAddress(pgDetails.getAddress());
        pg.setCity(pgDetails.getCity());
        pg.setState(pgDetails.getState());
        pg.setZipCode(pgDetails.getZipCode());
        pg.setPrice(pgDetails.getPrice());
        pg.setRules(pgDetails.getRules());
        pg.setGenderType(pgDetails.getGenderType());
        pg.setSharingType(pgDetails.getSharingType());
        return pgRepository.save(pg);
    }

    @Override
    public void delete(Long id) {
        PG pg = getById(id);
        pgRepository.delete(pg);
    }

    @Override
    public PG getById(Long id) {
        return pgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PG stay not found with id: " + id));
    }

    @Override
    public PG getBySlug(String slug) {
        return pgRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("PG stay not found with slug: " + slug));
    }

    @Override
    public List<PG> getAll() {
        return pgRepository.findAll();
    }
}
