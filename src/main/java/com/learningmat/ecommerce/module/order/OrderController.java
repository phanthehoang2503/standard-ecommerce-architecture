package com.learningmat.ecommerce.module.order;

import com.learningmat.ecommerce.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/order")
@Tag(name = "Order controller", description = "Obviously for ordering item and check order history")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    @Operation(summary = "Checkout items from the user's cart")
    public ApiResponse<Order> checkout(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return ApiResponse.<Order>builder()
                .result(orderService.placeOrder(username))
                .message("Place order successfully!!!")
                .build();
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get user's order history")
    public ApiResponse<List<Order>> orderHistory(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();

        List<Order> orders = orderService.getOrders(username);
        return ApiResponse.<List<Order>>builder()
                .result(orders)
                .build();
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "get user's order details")
    public ApiResponse<Order> getOrderDetails(
            @PathVariable Long orderId,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();

        return ApiResponse.<Order>builder()
                .result(orderService.getOrderDetails(username, orderId))
                .build();
    }
}
