package com.learningmat.ecommerce.dto.response;

import java.io.Serial;
import java.io.Serializable;

public record ProductResponse (
		Long id,
		String name,
		String imageUrl,
		double price,
		int stockQuantity,
		String categoryName,
		double averageRating,
		int reviewCount) implements Serializable {
	@Serial
    private static final long serialVersionUID = 1L;
}
