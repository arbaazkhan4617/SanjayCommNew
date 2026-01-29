package com.integrators.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateBrandDTO {
    @NotBlank(message = "Brand name is required")
    private String name;
    
    @NotNull(message = "Sub Category ID is required")
    private Long subCategoryId;

    public CreateBrandDTO() {
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
