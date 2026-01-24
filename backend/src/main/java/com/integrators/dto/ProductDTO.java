package com.integrators.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ProductDTO {
	private Long id;
	private String name;
	private String description;
	private BigDecimal price;
	private BigDecimal originalPrice;
	private Boolean inStock;
	private Double rating;
	private Integer reviews;
	private Long modelId;
	private Map<String, String> specifications;

	// Constructors
	public ProductDTO() {
	}

	public ProductDTO(Long id, String name, String description, BigDecimal price, BigDecimal originalPrice,
			Boolean inStock, Double rating, Integer reviews, Long modelId, Map<String, String> specifications) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.originalPrice = originalPrice;
		this.inStock = inStock;
		this.rating = rating;
		this.reviews = reviews;
		this.modelId = modelId;
		this.specifications = specifications;
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

	public Long getModelId() {
		return modelId;
	}

	public void setModelId(Long modelId) {
		this.modelId = modelId;
	}

	public Map<String, String> getSpecifications() {
		return specifications;
	}

	public void setSpecifications(Map<String, String> specifications) {
		this.specifications = specifications;
	}

}
