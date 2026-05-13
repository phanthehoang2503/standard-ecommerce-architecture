package com.learningmat.ecommerce.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ReviewResponse(
		Long id,
		String username,
		int rating,
		String comment,
		LocalDateTime createdAt) {
}
