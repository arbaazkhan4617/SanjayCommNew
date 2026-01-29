package com.integrators.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProductResponseDTO {
	private Long id;
	private String name;
	private String description;
	private BigDecimal price;
	private BigDecimal originalPrice;
	private Boolean inStock;
	private Double rating;
	private Integer reviews;
	private String image; // Keep for backward compatibility (from model)
	private List<String> images = new ArrayList<>(); // Multiple product images
	private Map<String, String> specifications;
	private ModelInfoDTO model;
	private BrandInfoDTO brand;
	private SubCategoryInfoDTO subCategory;
	private CategoryInfoDTO category;

	public static class ModelInfoDTO {
		private Long id;
		private String name;

		// Constructors
		public ModelInfoDTO() {
		}

		public ModelInfoDTO(Long id, String name) {
			this.id = id;
			this.name = name;
		}

		// Getters and Setters
		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	}

	public static class BrandInfoDTO {
		private Long id;
		private String name;

		// Constructors
		public BrandInfoDTO() {
		}

		public BrandInfoDTO(Long id, String name) {
			this.id = id;
			this.name = name;
		}

		// Getters and Setters
		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	}

	public static class CategoryInfoDTO {
		private Long id;
		private String name;
		// Constructors
		public CategoryInfoDTO() {
		}

		public CategoryInfoDTO(Long id, String name) {
			this.id = id;
			this.name = name;
		}

		// Getters and Setters
		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	}

	public static class SubCategoryInfoDTO {
		private Long id;
		private String name;

		// Constructors
		public SubCategoryInfoDTO() {
		}

		public SubCategoryInfoDTO(Long id, String name) {
			this.id = id;
			this.name = name;
		}

		// Getters and Setters
		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public BigDecimal getOriginalPrice() {
		return originalPrice;
	}

	public void setOriginalPrice(BigDecimal originalPrice) {
		this.originalPrice = originalPrice;
	}

	public Boolean getInStock() {
		return inStock;
	}

	public void setInStock(Boolean inStock) {
		this.inStock = inStock;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public Integer getReviews() {
		return reviews;
	}

	public void setReviews(Integer reviews) {
		this.reviews = reviews;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Map<String, String> getSpecifications() {
		return specifications;
	}

	public void setSpecifications(Map<String, String> specifications) {
		this.specifications = specifications;
	}

	public ModelInfoDTO getModel() {
		return model;
	}

	public void setModel(ModelInfoDTO model) {
		this.model = model;
	}

	public BrandInfoDTO getBrand() {
		return brand;
	}

	public void setBrand(BrandInfoDTO brand) {
		this.brand = brand;
	}

	public CategoryInfoDTO getCategory() {
		return category;
	}

	public void setCategory(CategoryInfoDTO category) {
		this.category = category;
	}

	public SubCategoryInfoDTO getSubCategory() {
		return subCategory;
	}

	public void setSubCategory(SubCategoryInfoDTO subCategory) {
		this.subCategory = subCategory;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images != null ? images : new ArrayList<>();
	}

	// Constructors
	public ProductResponseDTO() {
	}

	public ProductResponseDTO(Long id, String name, String description, BigDecimal price, BigDecimal originalPrice, Boolean inStock, Double rating, Integer reviews, String image, Map<String, String> specifications, ModelInfoDTO model, BrandInfoDTO brand, SubCategoryInfoDTO subCategory, CategoryInfoDTO category) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.originalPrice = originalPrice;
		this.inStock = inStock;
		this.rating = rating;
		this.reviews = reviews;
		this.image = image;
		this.specifications = specifications;
		this.model = model;
		this.brand = brand;
		this.subCategory = subCategory;
		this.category = category;
	}

}
