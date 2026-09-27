package com.livio.service.impl;

import com.livio.entity.Favorite;
import com.livio.entity.PG;
import com.livio.entity.User;
import com.livio.repository.FavoriteRepository;
import com.livio.repository.PGRepository;
import com.livio.repository.UserRepository;
import com.livio.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PGRepository pgRepository;

    @Override
    @Transactional
    public Favorite addFavorite(Long userId, Long pgId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new RuntimeException("PG not found with id: " + pgId));

        if (favoriteRepository.findByUserIdAndPgId(userId, pgId).isPresent()) {
            throw new RuntimeException("PG already in favorites");
        }

        Favorite favorite = new Favorite(user, pg);
        return favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(Long userId, Long pgId) {
        Favorite favorite = favoriteRepository.findByUserIdAndPgId(userId, pgId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    @Override
    public List<PG> getUserFavorites(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return favorites.stream()
                .map(Favorite::getPg)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFavorite(Long userId, Long pgId) {
        return favoriteRepository.findByUserIdAndPgId(userId, pgId).isPresent();
    }

    @Override
    public int getFavoriteCount(Long pgId) {
        return favoriteRepository.findByUserIdAndPgId(null, pgId).isPresent() ? 1 : 0;
    }
}