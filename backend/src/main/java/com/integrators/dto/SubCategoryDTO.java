package com.integrators.dto;

public class SubCategoryDTO {
	private Long id;
	private String name;
	private Long categoryId;

	// Constructors
	public SubCategoryDTO() {
	}

	public SubCategoryDTO(Long id, String name, Long categoryId) {
		this.id = id;
		this.name = name;
		this.categoryId = categoryId;
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

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

}
