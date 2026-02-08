package com.learningmat.ecommerce.controller;

import com.learningmat.ecommerce.dto.response.ApiResponse;
import com.learningmat.ecommerce.dto.request.UserCreateRequest;
import com.learningmat.ecommerce.dto.request.UserUpdateRequest;
import com.learningmat.ecommerce.model.User;
import com.learningmat.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping
    ApiResponse<User> createUser(@RequestBody @Valid UserCreateRequest request) {
        User user = userService.createUser(request);
        return ApiResponse.<User>builder()
                .result(user)
                .build();
    }

    @GetMapping
    ApiResponse<List<User>> getUsers() {
        return ApiResponse.<List<User>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<User> getUser(@PathVariable String userId) {
        return ApiResponse.<User>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    ApiResponse<User> updateUser(@PathVariable String userId, @RequestBody @Valid UserUpdateRequest request) {
        return ApiResponse.<User>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }
}
