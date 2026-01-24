package com.integrators.dto;

public class ModelDTO {
	private Long id;
	private String name;
	private String image;
	private Long brandId;

	// Constructors
	public ModelDTO() {
	}

	public ModelDTO(Long id, String name, String image, Long brandId) {
		this.id = id;
		this.name = name;
		this.image = image;
		this.brandId = brandId;
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

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Long getBrandId() {
		return brandId;
	}

	public void setBrandId(Long brandId) {
		this.brandId = brandId;
	}

}
