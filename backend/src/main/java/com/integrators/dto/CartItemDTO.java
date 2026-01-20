package com.integrators.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartItemDTO {
	private Long id;
	private ProductDTO product;
	private Integer quantity;

	public CartItemDTO(Long id, ProductDTO product, Integer quantity) {
		super();
		this.id = id;
		this.product = product;
		this.quantity = quantity;
	}

}
