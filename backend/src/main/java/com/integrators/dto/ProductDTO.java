package com.integrators.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
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

	public ProductDTO(Long id, String name, String description, BigDecimal price, BigDecimal originalPrice,
			Boolean inStock, Double rating, Integer reviews, Long modelId, Map<String, String> specifications) {
		super();
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

}
