package com.livio.repository;

import com.livio.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByPgId(Long pgId);
    void deleteByPgId(Long pgId);
}
