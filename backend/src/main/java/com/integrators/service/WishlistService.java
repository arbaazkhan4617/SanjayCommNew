package com.integrators.service;

import com.integrators.dto.ProductResponseDTO;
import com.integrators.entity.Product;
import com.integrators.entity.User;
import com.integrators.entity.WishlistItem;
import com.integrators.repository.UserRepository;
import com.integrators.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository, ProductService productService) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getWishlist(Long userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(WishlistItem::getProduct)
                .map(productService::convertToProductResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDTO addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            return productService.convertToProductResponseDTO(productService.getProductEntityById(productId));
        }
        Product product = productService.getProductEntityById(productId);
        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        wishlistRepository.save(item);
        return productService.convertToProductResponseDTO(product);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }
}
