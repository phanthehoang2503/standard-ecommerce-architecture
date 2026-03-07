package com.learningmat.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
    @NotBlank(message = "can't make a category without a name right?")
    String name,
    String description
) {
}
