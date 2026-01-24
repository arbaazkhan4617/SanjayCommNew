package com.integrators.controller;

import com.integrators.dto.*;
import com.integrators.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Product Management
    @PostMapping("/products")
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody CreateProductDTO dto) {
        try {
            ProductResponseDTO product = adminService.createProduct(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("product", product);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable Long id, @Valid @RequestBody CreateProductDTO dto) {
        try {
            ProductResponseDTO product = adminService.updateProduct(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("product", product);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        try {
            adminService.deleteProduct(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        try {
            ProductResponseDTO product = adminService.getProductById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("product", product);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Model Management
    @PostMapping("/models")
    public ResponseEntity<Map<String, Object>> createModel(@Valid @RequestBody CreateModelDTO dto) {
        try {
            ModelDTO model = adminService.createModel(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("model", model);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/models/{id}")
    public ResponseEntity<Map<String, Object>> updateModel(@PathVariable Long id, @Valid @RequestBody CreateModelDTO dto) {
        try {
            ModelDTO model = adminService.updateModel(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("model", model);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/models/{id}")
    public ResponseEntity<Map<String, Object>> deleteModel(@PathVariable Long id) {
        try {
            adminService.deleteModel(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Model deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Brand Management
    @PostMapping("/brands")
    public ResponseEntity<Map<String, Object>> createBrand(@Valid @RequestBody CreateBrandDTO dto) {
        try {
            BrandDTO brand = adminService.createBrand(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("brand", brand);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/brands/{id}")
    public ResponseEntity<Map<String, Object>> updateBrand(@PathVariable Long id, @Valid @RequestBody CreateBrandDTO dto) {
        try {
            BrandDTO brand = adminService.updateBrand(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("brand", brand);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<Map<String, Object>> deleteBrand(@PathVariable Long id) {
        try {
            adminService.deleteBrand(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Brand deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Category Management
    @PostMapping("/categories")
    public ResponseEntity<Map<String, Object>> createCategory(@Valid @RequestBody CreateCategoryDTO dto) {
        try {
            ProductCategoryDTO category = adminService.createCategory(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Map<String, Object>> updateCategory(@PathVariable Long id, @Valid @RequestBody CreateCategoryDTO dto) {
        try {
            ProductCategoryDTO category = adminService.updateCategory(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        try {
            adminService.deleteCategory(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get all for management
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    @GetMapping("/models")
    public ResponseEntity<List<ModelDTO>> getAllModels() {
        return ResponseEntity.ok(adminService.getAllModels());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandDTO>> getAllBrands() {
        return ResponseEntity.ok(adminService.getAllBrands());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(adminService.getAllCategories());
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        return ResponseEntity.ok(adminService.getAllServices());
    }
}
