package com.integrators.controller;

import com.integrators.dto.*;
import com.integrators.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
    	this.productService = productService;
    }
    
    @GetMapping("/services")
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        return ResponseEntity.ok(productService.getAllServices());
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getServiceById(id));
    }

    @GetMapping("/services/{serviceId}/categories")
    public ResponseEntity<List<ProductCategoryDTO>> getCategoriesByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(productService.getCategoriesByServiceId(serviceId));
    }

    @GetMapping("/categories/{categoryId}/brands")
    public ResponseEntity<List<BrandDTO>> getBrandsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getBrandsByCategoryId(categoryId));
    }

    @GetMapping("/brands/{brandId}/models")
    public ResponseEntity<List<ModelDTO>> getModelsByBrand(@PathVariable Long brandId) {
        return ResponseEntity.ok(productService.getModelsByBrandId(brandId));
    }

    @GetMapping("/models/{modelId}/product")
    public ResponseEntity<ProductResponseDTO> getProductByModel(@PathVariable Long modelId) {
        return ResponseEntity.ok(productService.getProductByModelId(modelId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
