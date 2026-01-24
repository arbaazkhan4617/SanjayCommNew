package com.integrators.dto;

public class CartItemDTO {
	private Long id;
	private ProductDTO product;
	private Integer quantity;

	// Constructors
	public CartItemDTO() {
	}

	public CartItemDTO(Long id, ProductDTO product, Integer quantity) {
		this.id = id;
		this.product = product;
		this.quantity = quantity;
	}

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ProductDTO getProduct() {
		return product;
	}

	public void setProduct(ProductDTO product) {
		this.product = product;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

}
