package com.integrators.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCategoryDTO {
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String icon;
    
    private String description;

    public CreateCategoryDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
