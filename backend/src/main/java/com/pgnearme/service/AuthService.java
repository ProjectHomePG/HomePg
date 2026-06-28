package com.pgnearme.service;

import com.pgnearme.entity.User;
import com.pgnearme.entity.UserRole;

public interface AuthService {
    User register(String name, String email, String password, String phone, UserRole role);
    String login(String email, String password); // Returns mock JWT token placeholder
    User getCurrentUser(String email);
}
