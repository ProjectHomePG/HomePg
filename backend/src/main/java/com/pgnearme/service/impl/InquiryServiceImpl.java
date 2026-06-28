package com.pgnearme.service.impl;

import com.pgnearme.entity.Inquiry;
import com.pgnearme.entity.PG;
import com.pgnearme.repository.InquiryRepository;
import com.pgnearme.repository.PGRepository;
import com.pgnearme.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InquiryServiceImpl implements InquiryService {

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private PGRepository pgRepository;

    @Override
    public Inquiry submit(Long pgId, String name, String email, String phone, String message) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new RuntimeException("PG stay not found with id: " + pgId));
        
        Inquiry inquiry = new Inquiry(name, email, phone, message, pg, "PENDING");
        return inquiryRepository.save(inquiry);
    }

    @Override
    public List<Inquiry> getByPgId(Long pgId) {
        return inquiryRepository.findByPgIdOrderByCreatedAtDesc(pgId);
    }

    @Override
    public List<Inquiry> getAll() {
        return inquiryRepository.findAll();
    }

    @Override
    public Inquiry updateStatus(Long id, String status) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + id));
        inquiry.setStatus(status);
        return inquiryRepository.save(inquiry);
    }
}
