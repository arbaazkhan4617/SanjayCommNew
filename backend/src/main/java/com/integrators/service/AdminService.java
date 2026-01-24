package com.integrators.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.integrators.dto.*;
import com.integrators.entity.Brand;
import com.integrators.entity.Model;
import com.integrators.entity.Product;
import com.integrators.entity.ProductCategory;
import com.integrators.repository.BrandRepository;
import com.integrators.repository.ModelRepository;
import com.integrators.repository.ProductCategoryRepository;
import com.integrators.repository.ProductRepository;
import com.integrators.repository.ServiceRepository;

@Service
public class AdminService {
    private final ProductRepository productRepository;
    private final ModelRepository modelRepository;
    private final BrandRepository brandRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;
    private final ProductService productService;

    public AdminService(ProductRepository productRepository, ModelRepository modelRepository,
                       BrandRepository brandRepository, ProductCategoryRepository categoryRepository,
                       ServiceRepository serviceRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.modelRepository = modelRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.serviceRepository = serviceRepository;
        this.productService = productService;
    }

    // Product CRUD
    @Transactional
    public ProductResponseDTO createProduct(CreateProductDTO dto) {
        Model model = modelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new RuntimeException("Model not found"));

        // Update model image if provided
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            model.setImage(dto.getImage());
            modelRepository.save(model);
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setOriginalPrice(dto.getOriginalPrice());
        product.setInStock(dto.getInStock() != null ? dto.getInStock() : true);
        product.setRating(dto.getRating());
        product.setReviews(dto.getReviews());
        product.setModel(model);
        product.setSpecifications(dto.getSpecifications());

        product = productRepository.save(product);
        return productService.convertToProductResponseDTO(product);
    }

    @Transactional
    public ProductResponseDTO updateProduct(Long id, CreateProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Model model = modelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new RuntimeException("Model not found"));

        // Update model image if provided
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            model.setImage(dto.getImage());
            modelRepository.save(model);
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setOriginalPrice(dto.getOriginalPrice());
        product.setInStock(dto.getInStock() != null ? dto.getInStock() : true);
        product.setRating(dto.getRating());
        product.setReviews(dto.getReviews());
        product.setModel(model);
        product.setSpecifications(dto.getSpecifications());

        product = productRepository.save(product);
        return productService.convertToProductResponseDTO(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productService.convertToProductResponseDTO(product);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productService::convertToProductResponseDTO)
                .collect(Collectors.toList());
    }

    // Model CRUD
    @Transactional
    public ModelDTO createModel(CreateModelDTO dto) {
        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Model model = new Model();
        model.setName(dto.getName());
        model.setImage(dto.getImage());
        model.setBrand(brand);

        model = modelRepository.save(model);
        return productService.convertToModelDTO(model);
    }

    @Transactional
    public ModelDTO updateModel(Long id, CreateModelDTO dto) {
        Model model = modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        Brand brand = brandRepository.findById(dto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        model.setName(dto.getName());
        model.setImage(dto.getImage());
        model.setBrand(brand);

        model = modelRepository.save(model);
        return productService.convertToModelDTO(model);
    }

    @Transactional
    public void deleteModel(Long id) {
        Model model = modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found"));
        modelRepository.delete(model);
    }

    public List<ModelDTO> getAllModels() {
        return modelRepository.findAll().stream()
                .map(productService::convertToModelDTO)
                .collect(Collectors.toList());
    }

    // Brand CRUD
    @Transactional
    public BrandDTO createBrand(CreateBrandDTO dto) {
        ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = new Brand();
        brand.setName(dto.getName());
        brand.setCategory(category);

        brand = brandRepository.save(brand);
        return productService.convertToBrandDTO(brand);
    }

    @Transactional
    public BrandDTO updateBrand(Long id, CreateBrandDTO dto) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        brand.setName(dto.getName());
        brand.setCategory(category);

        brand = brandRepository.save(brand);
        return productService.convertToBrandDTO(brand);
    }

    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        brandRepository.delete(brand);
    }

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(productService::convertToBrandDTO)
                .collect(Collectors.toList());
    }

    // Category CRUD
    @Transactional
    public ProductCategoryDTO createCategory(CreateCategoryDTO dto) {
        com.integrators.entity.Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        ProductCategory category = new ProductCategory();
        category.setName(dto.getName());
        category.setService(service);

        category = categoryRepository.save(category);
        return productService.convertToCategoryDTO(category);
    }

    @Transactional
    public ProductCategoryDTO updateCategory(Long id, CreateCategoryDTO dto) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        com.integrators.entity.Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        category.setName(dto.getName());
        category.setService(service);

        category = categoryRepository.save(category);
        return productService.convertToCategoryDTO(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    public List<ProductCategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(productService::convertToCategoryDTO)
                .collect(Collectors.toList());
    }

    public List<ServiceDTO> getAllServices() {
        return productService.getAllServices();
    }
}
