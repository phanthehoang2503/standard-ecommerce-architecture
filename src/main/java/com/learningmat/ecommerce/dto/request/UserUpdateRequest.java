package com.learningmat.ecommerce.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record UserUpdateRequest(
                String username,
                @Size(min = 6, message = "PASSWORD_INVALID") String password,
                LocalDate dob,
                String fullName) {
}
