package com.livio.service;

import com.livio.entity.Favorite;
import com.livio.entity.PG;

import java.util.List;

public interface FavoriteService {
    Favorite addFavorite(Long userId, Long pgId);
    void removeFavorite(Long userId, Long pgId);
    List<PG> getUserFavorites(Long userId);
    boolean isFavorite(Long userId, Long pgId);
    int getFavoriteCount(Long pgId);
}