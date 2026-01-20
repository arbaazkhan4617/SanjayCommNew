package com.integrators.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BrandDTO {
	private Long id;
	private String name;
	private Long categoryId;

	public BrandDTO(Long id, String name, Long categoryId) {
		super();
		this.id = id;
		this.name = name;
		this.categoryId = categoryId;
	}

}
