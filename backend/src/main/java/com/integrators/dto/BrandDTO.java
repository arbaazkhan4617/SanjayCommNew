package com.integrators.dto;

public class BrandDTO {
	private Long id;
	private String name;
	private Long subCategoryId;

	// Constructors
	public BrandDTO() {
	}

	public BrandDTO(Long id, String name, Long subCategoryId) {
		this.id = id;
		this.name = name;
		this.subCategoryId = subCategoryId;
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

	public Long getSubCategoryId() {
		return subCategoryId;
	}

	public void setSubCategoryId(Long subCategoryId) {
		this.subCategoryId = subCategoryId;
	}

}
