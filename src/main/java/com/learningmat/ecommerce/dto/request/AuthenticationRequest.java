package com.learningmat.ecommerce.dto.request;

import lombok.Builder;

@Builder
public record AuthenticationRequest(
    String username,
    String password) {
}
