package com.learningmat.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserCreateRequest(
		@NotBlank(message = "INVALID_USERNAME") @Size(min = 3, message = "INVALID_USERNAME") String username,
		@NotBlank(message = "INVALID_USERNAME") @Size(min = 6, message = "INVALID_PASSWORD") String password,

		String fullName,
		LocalDate dob) {
}
