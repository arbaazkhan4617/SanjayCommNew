package com.integrators.controller;

import com.integrators.dto.*;
import com.integrators.service.ProductService;
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
    
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getCategoryById(id));
    }

    @GetMapping("/categories/{categoryId}/sub-categories")
    public ResponseEntity<List<SubCategoryDTO>> getSubCategoriesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getSubCategoriesByCategoryId(categoryId));
    }

    @GetMapping("/sub-categories/{subCategoryId}/brands")
    public ResponseEntity<List<BrandDTO>> getBrandsBySubCategory(@PathVariable Long subCategoryId) {
        return ResponseEntity.ok(productService.getBrandsBySubCategoryId(subCategoryId));
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
