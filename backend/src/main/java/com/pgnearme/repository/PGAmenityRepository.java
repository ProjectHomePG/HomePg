package com.pgnearme.repository;

import com.pgnearme.entity.PGAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PGAmenityRepository extends JpaRepository<PGAmenity, Long> {
    List<PGAmenity> findByPgId(Long pgId);
    void deleteByPgId(Long pgId);
}
