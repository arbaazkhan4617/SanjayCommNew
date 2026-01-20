package com.integrators.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductCategoryDTO {
	private Long id;
	private String name;
	private Long serviceId;

	public ProductCategoryDTO(Long id, String name, Long serviceId) {
		super();
		this.id = id;
		this.name = name;
		this.serviceId = serviceId;
	}

}
