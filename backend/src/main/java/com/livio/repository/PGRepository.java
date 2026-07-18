package com.livio.repository;

import com.livio.entity.PG;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface PGRepository extends JpaRepository<PG, Long> {
    Optional<PG> findBySlug(String slug);
    List<PG> findByCityIgnoreCase(String city);
    List<PG> findByGenderType(String genderType);
    List<PG> findByPriceLessThanEqual(Double price);

    @Query("SELECT DISTINCT p FROM PG p LEFT JOIN p.nearbyPlaces np WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(np.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:gender IS NULL OR :gender = 'ALL' OR LOWER(p.genderType) = LOWER(:gender)) AND " +
           "(:sharing IS NULL OR :sharing = 'ALL' OR LOWER(p.sharingType) = LOWER(:sharing)) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<PG> searchPGs(@Param("query") String query,
                       @Param("gender") String gender,
                       @Param("sharing") String sharing,
                       @Param("minPrice") Double minPrice,
                       @Param("maxPrice") Double maxPrice);
}
