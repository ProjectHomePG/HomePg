package com.pgnearme.repository;

import com.pgnearme.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByPgId(Long pgId);
    List<Inquiry> findByPgIdOrderByCreatedAtDesc(Long pgId);
    List<Inquiry> findByStatus(String status);
}
