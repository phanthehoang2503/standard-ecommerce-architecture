package com.learningmat.ecommerce.dto.response;

public record ProductResponse(
		Long id,
		String name,
		double price,
		int stockQuantity,
		String categoryName
) {
}
