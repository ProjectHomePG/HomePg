package com.pgnearme.service;

import com.pgnearme.entity.Inquiry;
import java.util.List;

public interface InquiryService {
    Inquiry submit(Long pgId, String name, String email, String phone, String message);
    List<Inquiry> getByPgId(Long pgId);
    List<Inquiry> getAll();
    Inquiry updateStatus(Long id, String status);
}
