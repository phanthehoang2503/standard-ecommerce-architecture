package com.learningmat.ecommerce.dto.response;

public record ProductResponse(
		Long id,
		String name,
		String imageUrl,
		double price,
		int stockQuantity,
		String categoryName) {
}
