package com.integrators.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {
	private Long id;
	private String name;
	private String description;
	private BigDecimal price;
	private BigDecimal originalPrice;
	private Boolean inStock;
	private Double rating;
	private Integer reviews;
	private String image;
	private Map<String, String> specifications;
	private ModelInfoDTO model;
	private BrandInfoDTO brand;
	private CategoryInfoDTO category;
	private ServiceInfoDTO service;

	@Data
	@NoArgsConstructor
	public static class ModelInfoDTO {
		private Long id;
		private String name;

		public ModelInfoDTO(Long id, String name) {
			super();
			this.id = id;
			this.name = name;
		}

	}

	@Data
	@NoArgsConstructor
	public static class BrandInfoDTO {
		private Long id;
		private String name;

		public BrandInfoDTO(Long id, String name) {
			super();
			this.id = id;
			this.name = name;
		}

	}

	@Data
	@NoArgsConstructor
	public static class CategoryInfoDTO {
		private Long id;
		private String name;
		public CategoryInfoDTO(Long id, String name) {
			super();
			this.id = id;
			this.name = name;
		}

	}

	@Data
	@NoArgsConstructor
	public static class ServiceInfoDTO {
		private Long id;
		private String name;

		public ServiceInfoDTO(Long id, String name) {
			super();
			this.id = id;
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

	public ServiceInfoDTO getService() {
		return service;
	}

	public void setService(ServiceInfoDTO service) {
		this.service = service;
	}

}
