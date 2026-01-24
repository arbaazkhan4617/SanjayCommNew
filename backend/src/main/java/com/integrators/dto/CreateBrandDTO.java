package com.integrators.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateBrandDTO {
    @NotBlank(message = "Brand name is required")
    private String name;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;

    public CreateBrandDTO() {
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
