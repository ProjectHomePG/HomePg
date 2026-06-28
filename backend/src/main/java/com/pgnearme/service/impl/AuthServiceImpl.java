package com.pgnearme.service.impl;

import com.pgnearme.entity.User;
import com.pgnearme.entity.UserRole;
import com.pgnearme.repository.UserRepository;
import com.pgnearme.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User register(String name, String email, String password, String phone, UserRole role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered!");
        }
        User user = new User(name, email, password, phone, role);
        return userRepository.save(user);
    }

    @Override
    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return "mock-jwt-token-placeholder-value-xyz";
        }
        throw new RuntimeException("Invalid email or password!");
    }

    @Override
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}
