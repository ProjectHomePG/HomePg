package com.livio.repository;

import com.livio.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPgId(Long pgId);
    List<Review> findByPgIdOrderByCreatedAtDesc(Long pgId);

    @Query("SELECT r.pg.id, AVG(r.rating), COUNT(r) FROM Review r GROUP BY r.pg.id")
    List<Object[]> getRatingSummaries();

    @Query("SELECT AVG(r.rating), COUNT(r) FROM Review r WHERE r.pg.id = :pgId")
    List<Object[]> getRatingSummaryForPg(@Param("pgId") Long pgId);
}
