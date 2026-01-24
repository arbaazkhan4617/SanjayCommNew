package com.integrators.controller;

import com.integrators.entity.User;
import com.integrators.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TestController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userList = users.stream()
            .map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("name", user.getName());
                userMap.put("email", user.getEmail());
                userMap.put("phone", user.getPhone());
                userMap.put("role", user.getRole() != null ? user.getRole() : "null");
                return userMap;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("total", users.size());
        response.put("users", userList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdminUser() {
        User adminUser = userRepository.findByEmail("admin@integrators.com").orElse(null);
        
        if (adminUser == null) {
            adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@integrators.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setPhone("9876543210");
            adminUser.setRole("ADMIN");
            adminUser = userRepository.save(adminUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin user created successfully");
            response.put("user", Map.of(
                "id", adminUser.getId(),
                "name", adminUser.getName(),
                "email", adminUser.getEmail(),
                "role", adminUser.getRole() != null ? adminUser.getRole() : "null"
            ));
            return ResponseEntity.ok(response);
        } else {
            // Update existing admin user to ensure it has ADMIN role
            adminUser.setRole("ADMIN");
            adminUser = userRepository.save(adminUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin user updated with ADMIN role");
            response.put("user", Map.of(
                "id", adminUser.getId(),
                "name", adminUser.getName(),
                "email", adminUser.getEmail(),
                "role", adminUser.getRole() != null ? adminUser.getRole() : "null"
            ));
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/create-test")
    public ResponseEntity<Map<String, Object>> createTestUser() {
        if (userRepository.existsByEmail("test@test.com")) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Test user already exists");
            return ResponseEntity.badRequest().body(response);
        }

        User testUser = new User();
        testUser.setName("Test User");
        testUser.setEmail("test@test.com");
        testUser.setPassword(passwordEncoder.encode("test123"));
        testUser.setPhone("9876543211");
        testUser = userRepository.save(testUser);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Test user created successfully");
        response.put("user", Map.of(
            "id", testUser.getId(),
            "name", testUser.getName(),
            "email", testUser.getEmail()
        ));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-password")
    public ResponseEntity<Map<String, Object>> verifyPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = userRepository.findByEmail(email).orElse(null);
        
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("exists", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }

        boolean matches = passwordEncoder.matches(password, user.getPassword());
        response.put("exists", true);
        response.put("passwordMatches", matches);
        response.put("storedPasswordHash", user.getPassword().substring(0, 20) + "...");
        
        return ResponseEntity.ok(response);
    }
}
