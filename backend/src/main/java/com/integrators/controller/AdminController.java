package com.integrators.controller;

import com.integrators.dto.*;
import com.integrators.service.AdminService;
import com.integrators.service.FileUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AdminService adminService;
    private final FileUploadService fileUploadService;

    public AdminController(AdminService adminService, FileUploadService fileUploadService) {
        this.adminService = adminService;
        this.fileUploadService = fileUploadService;
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

    // SubCategory Management
    @PostMapping("/sub-categories")
    public ResponseEntity<Map<String, Object>> createSubCategory(@Valid @RequestBody CreateSubCategoryDTO dto) {
        try {
            SubCategoryDTO subCategory = adminService.createSubCategory(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subCategory", subCategory);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/sub-categories/{id}")
    public ResponseEntity<Map<String, Object>> updateSubCategory(@PathVariable Long id, @Valid @RequestBody CreateSubCategoryDTO dto) {
        try {
            SubCategoryDTO subCategory = adminService.updateSubCategory(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subCategory", subCategory);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/sub-categories/{id}")
    public ResponseEntity<Map<String, Object>> deleteSubCategory(@PathVariable Long id) {
        try {
            adminService.deleteSubCategory(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sub Category deleted successfully");
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
            CategoryDTO category = adminService.createCategory(dto);
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
            CategoryDTO category = adminService.updateCategory(id, dto);
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

    @GetMapping("/sub-categories")
    public ResponseEntity<List<SubCategoryDTO>> getAllSubCategories() {
        return ResponseEntity.ok(adminService.getAllSubCategories());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(adminService.getAllCategories());
    }

    // Image Upload
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam MultipartFile file) {
        try {
            System.out.println("Uploading image: " + file.getOriginalFilename());
            String imageUrl = fileUploadService.uploadFile(file);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
