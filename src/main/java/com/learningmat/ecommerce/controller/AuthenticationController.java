package com.learningmat.ecommerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learningmat.ecommerce.dto.request.AuthenticationRequest;
import com.learningmat.ecommerce.dto.response.ApiResponse;
import com.learningmat.ecommerce.dto.response.AuthenticationResponse;
import com.learningmat.ecommerce.service.AuthenticateService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name= "Authentication", description="For token when login")
public class AuthenticationController {
  private final AuthenticateService authenticateService;

  @PostMapping("/token")
  @Operation(summary = "Get Access Token", description = "Login with username/password to get JWT")
  public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
    return ApiResponse.<AuthenticationResponse>builder()
        .result(authenticateService.authenticate(request))
        .build();
  }

}
