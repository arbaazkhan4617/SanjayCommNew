package com.integrators.dto;

public class ProductCategoryDTO {
	private Long id;
	private String name;
	private Long serviceId;

	// Constructors
	public ProductCategoryDTO() {
	}

	public ProductCategoryDTO(Long id, String name, Long serviceId) {
		this.id = id;
		this.name = name;
		this.serviceId = serviceId;
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

	public Long getServiceId() {
		return serviceId;
	}

	public void setServiceId(Long serviceId) {
		this.serviceId = serviceId;
	}

}
