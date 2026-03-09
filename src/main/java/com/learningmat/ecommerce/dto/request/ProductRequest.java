package com.learningmat.ecommerce.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotBlank(message = "INVALID_NAME")
        @Size(min = 3, message = "INVALID_NAME")
        String name,

        @Min(value = 0, message = "INVALID_PRICE")
        long price,

        Long categoryId) {
}
