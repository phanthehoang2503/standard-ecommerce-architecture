package com.learningmat.ecommerce.controller;

import com.learningmat.ecommerce.dto.response.ApiResponse;
import com.learningmat.ecommerce.model.Cart;
import com.learningmat.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart Controller")
public class CartController {
    private final CartService cartService;

    @GetMapping
    @Operation(summary = "get user's cart")
    public ApiResponse<Cart> getMyCart() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<Cart>builder()
                .result(cartService.getCart(username))
                .build();
    }

    @PostMapping("/add")
    @Operation(summary = "Add items from product to cart")
    public ApiResponse<Cart> addToCart(@RequestParam int productId, @RequestParam int quantity) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<Cart>builder()
                .result(cartService.addToCart(username, productId, quantity))
                .build();
    }
}

