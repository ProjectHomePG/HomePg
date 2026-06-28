package com.pgnearme.repository;

import com.pgnearme.entity.PG;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PGRepository extends JpaRepository<PG, Long> {
    Optional<PG> findBySlug(String slug);
    List<PG> findByCityIgnoreCase(String city);
    List<PG> findByGenderType(String genderType);
    List<PG> findByPriceLessThanEqual(Double price);
}
