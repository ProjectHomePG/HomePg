package com.livio.service;

import com.livio.entity.User;
import com.livio.entity.UserRole;

public interface AuthService {
    User register(String name, String email, String password, String phone, UserRole role);
    String login(String email, String password); // Returns mock JWT token placeholder
    User getCurrentUser(String email);
}
