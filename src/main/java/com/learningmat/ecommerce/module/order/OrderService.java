package com.learningmat.ecommerce.module.order;

import com.learningmat.ecommerce.event.PaymentSuccessEvent;
import com.learningmat.ecommerce.module.cart.CartService;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.module.cart.Cart;
import com.learningmat.ecommerce.module.inventory.InventoryService;
import com.learningmat.ecommerce.module.user.User;
import com.learningmat.ecommerce.module.cart.CartRepository;
import com.learningmat.ecommerce.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final InventoryService inventoryService;

    @Transactional
    public Order placeOrder(String username) {
        log.info("The user [{}] start to place an order", username);
        // find user
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        log.warn("User not found, maybe their username ({}) not in the DB?", username);
                        return new AppException(ErrorCode.USER_NOTFOUND);
                    });
            // do they have the cart?
            Cart cart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> {
                        log.warn("User [{}] don't have a cart yet", username);
                        return new AppException(ErrorCode.USER_CART_NOTFOUND);
                    });
            log.info("Found user [{}] cart, start transaction...", username);

            cart.getItems().forEach(
                    item -> inventoryService.reduceStock(
                            item.getProduct().getId(),
                            item.getQuantity()));

            Order order = Order.builder()
                    .user(user)
                    .status("PENDING")
                    .orderDate(LocalDateTime.now())
                    .orderItems(new ArrayList<>())
                    .build();
            List<OrderItem> orderItems = cart.getItems().stream()
                    .map(item -> OrderItem.builder()
                            .order(order)
                            .product(item.getProduct())
                            .quantity(item.getQuantity())
                            .price(item.getProduct().getPrice())
                            .build())
                    .toList();
            order.setOrderItems(orderItems);
            Long total = orderItems.stream()
                    .mapToLong(item -> (long) (item.getPrice() * item.getQuantity())).sum();
            order.setTotalAmount(total);
            Order savedOrder = orderRepository.save(order);
            log.info("User [{}] placed order complete, OrderID [{}], Total Amount [{}]",
                    username, savedOrder.getId(), savedOrder.getTotalAmount());
            cartService.clearCart(username);
            return savedOrder;
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("System error when placing an order for user [{}]", username);
            throw e;
        }

    }

    public List<Order> getOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        return orderRepository.findByUserId(user.getId());
    }

    public Order getOrderDetails(String username, Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> {
                        log.warn("Order with ID [{}] not found", orderId);
                        return new AppException(ErrorCode.ORDER_NOT_FOUND);
                    });
            if (!Objects.equals(order.getUser().getUsername(), username)) {
                throw new AppException(ErrorCode.FORBIDDEN_ACCESS);
            }
            return order;
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Something go wrong [Order id: {}, error: {}]", orderId, e.getMessage());
            throw e;
        }
    }

    @EventListener
    public void handlePaymentSuccessEvent(PaymentSuccessEvent event) {
        Long orderId = event.getOrderId();
        log.info("OrderService heard PaymentSuccessEvent yell for order ID: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.warn("Order with ID[{}] not found", orderId);
                    return new AppException(ErrorCode.ORDER_NOT_FOUND);
                });

        order.setPaymentStatus("PAID");
        orderRepository.save(order);
        log.info("Updated payment status of order with ID[{}] to PAID", orderId);
    }
}
