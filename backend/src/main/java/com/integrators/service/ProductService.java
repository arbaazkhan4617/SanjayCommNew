package com.integrators.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.integrators.dto.BrandDTO;
import com.integrators.dto.ModelDTO;
import com.integrators.dto.SubCategoryDTO;
import com.integrators.dto.ProductResponseDTO;
import com.integrators.dto.CategoryDTO;
import com.integrators.entity.Brand;
import com.integrators.entity.Model;
import com.integrators.entity.Product;
import com.integrators.entity.SubCategory;
import com.integrators.repository.BrandRepository;
import com.integrators.repository.ModelRepository;
import com.integrators.repository.SubCategoryRepository;
import com.integrators.repository.ProductRepository;
import com.integrators.repository.CategoryRepository;

@Service
public class ProductService {
	private final CategoryRepository categoryRepository;
	private final SubCategoryRepository subCategoryRepository;
	private final BrandRepository brandRepository;
	private final ModelRepository modelRepository;
	private final ProductRepository productRepository;

	public ProductService(CategoryRepository categoryRepository, SubCategoryRepository subCategoryRepository,
			BrandRepository brandRepository, ModelRepository modelRepository, ProductRepository productRepository) {
		super();
		this.categoryRepository = categoryRepository;
		this.subCategoryRepository = subCategoryRepository;
		this.brandRepository = brandRepository;
		this.modelRepository = modelRepository;
		this.productRepository = productRepository;
	}

	public List<CategoryDTO> getAllCategories() {
		return categoryRepository.findAll().stream().map(this::convertToCategoryDTO).collect(Collectors.toList());
	}

	public CategoryDTO getCategoryById(Long id) {
		return categoryRepository.findById(id).map(this::convertToCategoryDTO)
				.orElseThrow(() -> new RuntimeException("Category not found"));
	}

	public List<SubCategoryDTO> getSubCategoriesByCategoryId(Long categoryId) {
		return subCategoryRepository.findByCategoryId(categoryId).stream().map(this::convertToSubCategoryDTO)
				.collect(Collectors.toList());
	}

	public List<BrandDTO> getBrandsBySubCategoryId(Long subCategoryId) {
		return brandRepository.findBySubCategoryId(subCategoryId).stream().map(this::convertToBrandDTO)
				.collect(Collectors.toList());
	}

	public List<ModelDTO> getModelsByBrandId(Long brandId) {
		return modelRepository.findByBrandId(brandId).stream().map(this::convertToModelDTO)
				.collect(Collectors.toList());
	}

	public Product getProductEntityById(Long productId) {
		return productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));
	}

	public ProductResponseDTO getProductByModelId(Long modelId) {
		Product product = productRepository.findByModelId(modelId)
				.orElseThrow(() -> new RuntimeException("Product not found"));
		return convertToProductResponseDTO(product);
	}

	public List<ProductResponseDTO> searchProducts(String query) {
		return productRepository.searchProducts(query).stream().map(this::convertToProductResponseDTO)
				.collect(Collectors.toList());
	}

	public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
		return productRepository.findAll(pageable).map(this::convertToProductResponseDTO);
	}

	public List<ProductResponseDTO> getNewArrivals(int size) {
		Pageable page = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "id"));
		return productRepository.findAll(page).stream().map(this::convertToProductResponseDTO).collect(Collectors.toList());
	}

	public List<ProductResponseDTO> getPopular(int size) {
		Pageable page = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "viewCount"));
		return productRepository.findAll(page).stream().map(this::convertToProductResponseDTO).collect(Collectors.toList());
	}

	public Page<ProductResponseDTO> getDeals(Pageable pageable) {
		return productRepository.findDeals(pageable).map(this::convertToProductResponseDTO);
	}

	@Transactional
	public void incrementViewCountByModelId(Long modelId) {
		productRepository.findByModelId(modelId).ifPresent(p -> {
			p.setViewCount(p.getViewCount() + 1);
			productRepository.save(p);
		});
	}

	// Conversion methods
	public CategoryDTO convertToCategoryDTO(com.integrators.entity.Category category) {
		return new CategoryDTO(category.getId(), category.getName(), category.getIcon(), category.getDescription());
	}

	public SubCategoryDTO convertToSubCategoryDTO(SubCategory subCategory) {
		return new SubCategoryDTO(subCategory.getId(), subCategory.getName(), subCategory.getCategory().getId());
	}

	public BrandDTO convertToBrandDTO(Brand brand) {
		return new BrandDTO(brand.getId(), brand.getName(), brand.getSubCategory().getId());
	}

	public ModelDTO convertToModelDTO(Model model) {
		return new ModelDTO(model.getId(), model.getName(), model.getImage(), model.getBrand().getId());
	}

	public ProductResponseDTO convertToProductResponseDTO(Product product) {
		ProductResponseDTO dto = new ProductResponseDTO();
		dto.setId(product.getId());
		dto.setName(product.getName());
		dto.setDescription(product.getDescription());
		dto.setPrice(product.getPrice());
		dto.setOriginalPrice(product.getOriginalPrice());
		dto.setInStock(product.getInStock());
		dto.setRating(product.getRating());
		dto.setReviews(product.getReviews());
		dto.setSpecifications(product.getSpecifications());

		// Set product images
		if (product.getImages() != null && !product.getImages().isEmpty()) {
			List<String> imageUrls = product.getImages().stream()
					.map(img -> img.getImageUrl())
					.collect(java.util.stream.Collectors.toList());
			dto.setImages(imageUrls);
			// Set first image as primary image for backward compatibility
			if (!imageUrls.isEmpty()) {
				dto.setImage(imageUrls.get(0));
			}
		}

		Model model = product.getModel();
		if (model != null) {
			// Only set model image if no product images exist
			if (dto.getImage() == null || dto.getImage().isEmpty()) {
				dto.setImage(model.getImage());
			}
			dto.setModel(new ProductResponseDTO.ModelInfoDTO(model.getId(), model.getName()));

			Brand brand = model.getBrand();
			if (brand != null) {
				dto.setBrand(new ProductResponseDTO.BrandInfoDTO(brand.getId(), brand.getName()));

				SubCategory subCategory = brand.getSubCategory();
				if (subCategory != null) {
					dto.setSubCategory(new ProductResponseDTO.SubCategoryInfoDTO(subCategory.getId(), subCategory.getName()));

					com.integrators.entity.Category category = subCategory.getCategory();
					if (category != null) {
						dto.setCategory(new ProductResponseDTO.CategoryInfoDTO(category.getId(), category.getName()));
					}
				}
			}
		}

		return dto;
	}
}
