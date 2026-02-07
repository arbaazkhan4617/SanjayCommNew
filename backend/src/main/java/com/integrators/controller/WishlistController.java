package com.integrators.controller;

import com.integrators.dto.ProductResponseDTO;
import com.integrators.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {
    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ProductResponseDTO>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Map<String, Object>> addToWishlist(
            @PathVariable Long userId,
            @RequestParam Long productId) {
        try {
            ProductResponseDTO product = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Added to wishlist",
                    "product", product
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<Map<String, Object>> removeFromWishlist(
            @PathVariable Long userId,
            @RequestParam Long productId) {
        try {
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/contains")
    public ResponseEntity<Map<String, Boolean>> contains(
            @PathVariable Long userId,
            @RequestParam Long productId) {
        return ResponseEntity.ok(Map.of("inWishlist", wishlistService.isInWishlist(userId, productId)));
    }
}
