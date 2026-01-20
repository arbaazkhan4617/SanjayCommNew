package com.integrators.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ServiceDTO {
	private Long id;
	private String name;
	private String icon;
	private String description;

	public ServiceDTO(Long id, String name, String icon, String description) {
		super();
		this.id = id;
		this.name = name;
		this.icon = icon;
		this.description = description;
	}

}
