package com.livio.repository;

import com.livio.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Favorite> findByUserIdAndPgId(Long userId, Long pgId);
    boolean existsByUserIdAndPgId(Long userId, Long pgId);
    void deleteByUserIdAndPgId(Long userId, Long pgId);
}
