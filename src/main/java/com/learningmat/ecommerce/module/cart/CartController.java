package com.learningmat.ecommerce.module.cart;

import com.learningmat.ecommerce.dto.request.CartRequest;
import com.learningmat.ecommerce.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart Controller")
public class CartController {
    private final CartService cartService;

    @GetMapping
    @Operation(summary = "get user's cart")
    public ApiResponse<Cart> getMyCart(@AuthenticationPrincipal Jwt jwt) {
//        SecurityContext context = SecurityContextHolder.getContext();
//        Authentication authentication = context.getAuthentication();
//        String username = authentication.getName();

//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String username = jwt.getSubject();

        return ApiResponse.<Cart>builder()
                .result(cartService.getCart(username))
                .build();
    }

    @PostMapping("/add")
    @Operation(summary = "Add product to cart")
    public ApiResponse<Cart> addToCart(@AuthenticationPrincipal Jwt jwt,@RequestBody @Valid CartRequest request) {
        String username = jwt.getSubject();
        return ApiResponse.<Cart>builder()
                .result(cartService.addToCart(username, request))
                .build();
    }

    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "remove item from cart")
    public ApiResponse<Cart> removeFromCart(@AuthenticationPrincipal Jwt jwt,@PathVariable Long productId) {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String username = jwt.getSubject();
        return ApiResponse.<Cart>builder()
                .result(cartService.removeFromCart(username, productId))
                .build();
    }

    @DeleteMapping("/clearCart")
    public ApiResponse<Cart> clearCart(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        cartService.clearCart(username);
        return ApiResponse.<Cart>builder()
                .message("Cart cleared.")
                .build();
    }
}

