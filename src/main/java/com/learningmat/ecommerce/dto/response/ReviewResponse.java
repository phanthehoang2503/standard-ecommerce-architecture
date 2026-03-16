package com.learningmat.ecommerce.dto.response;

import java.time.LocalDateTime;

public record ReviewResponse(
		Long id,
		String username,
		int rating,
		String comment,
		LocalDateTime createdAt) {
}
