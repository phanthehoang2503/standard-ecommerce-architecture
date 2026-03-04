package com.learningmat.ecommerce.dto.request;

import jakarta.validation.constraints.Min;

public record CartRequest(
        @Min(value = 1, message = "PRODUCT_NOT_FOUND") Long productId,
        @Min(value = 1, message = "INVALID_QUANTITY") int quantity) {
}
