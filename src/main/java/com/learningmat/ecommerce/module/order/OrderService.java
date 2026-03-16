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
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

            String currentHash = generateCartHash(cart);

            var pageable = PageRequest.of(0, 1);
            List<Order> pendingOrders = orderRepository.findLastestPendingOrder(user.getId(), pageable);

            // check old pending order to see if anything change
            if (!pendingOrders.isEmpty()) {
                Order existingOrder = pendingOrders.getFirst();

                // if the user send another checkout, this condition will check the hash
                // to see if user's current cart is the same as their previous order
                // if it true then we just return the old order
                if (currentHash.equals(existingOrder.getCartHash())) {
                    log.info("Reuse existing order ID: {}", existingOrder.getId());
                    return existingOrder;
                }
                // if their current checkout is differed from their last one
                // then we remove the previous one to create their new order
                // this will prevent someone spam the checkout to reserve stock without buying
                log.info("Cart changed, restock for old order ID [{}]", existingOrder.getId());
                for (OrderItem item : existingOrder.getOrderItems()) {
                    inventoryService.restoreStock(item.getProduct().getId(), item.getQuantity());
                }
                orderRepository.delete(existingOrder);
            }

            // nothing change then we create a new one for user
            cart.getItems().forEach(
                    item -> {
                        if (item.getProduct() == null) {
                            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                        }
                        inventoryService.reduceStock(
                                item.getProduct().getId(),
                                item.getQuantity());
                    });

            Order order = Order.builder()
                    .user(user)
                    .status("PENDING")
                    .orderDate(LocalDateTime.now())
                    .orderItems(new ArrayList<>())
                    .cartHash(currentHash) // leave a fingerprint.
                    .build();
            List<OrderItem> orderItems = cart.getItems().stream()
                    .map(item -> OrderItem.builder()
                            .order(order)
                            .product(item.getProduct())
                            .productName(item.getProduct().getName())
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
            // cartService.clearCart(username);
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

        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);

        return orderRepository.findValidOrderHistory(user.getId(), threshold);
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
        Long vnpayAmount = event.getAmount();
        log.info("OrderService heard PaymentSuccessEvent yell for order ID: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.warn("Order with ID[{}] not found", orderId);
                    return new AppException(ErrorCode.ORDER_NOT_FOUND);
                });

        // check if the amount is legit or not
        if (!order.getTotalAmount().equals(vnpayAmount)) {
            log.warn(
                    "Warning: Transaction amount are not match! Order ID [{}], System record [{}] vs VNPay amount [{}]",
                    orderId, order.getTotalAmount(), vnpayAmount);
            return;
        }

        order.setPaymentStatus("PAID");
        orderRepository.save(order);

        // if the transaction is complete, then clear the user cart for their next buy
        cartService.clearCart(order.getUser().getUsername());
        log.info("Updated payment status of order with ID[{}] to PAID", orderId);
    }

    @Scheduled(fixedRate = 600000)
    @Transactional
    public void cleanupPendingOrder() {
        log.info("Initialize clean up pending order process....");
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);

        List<Order> expOrders = orderRepository.findAllByPaymentStatusAndOrderDateBefore("PENDING", threshold);

        for (Order order : expOrders) {
            log.info("Canceling order with id [{}] due to expire", order.getId());
            order.setPaymentStatus("FAILED");
            order.setStatus("CANCELLED");

            // refund to inventory
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() != null) {
                    inventoryService.restoreStock(item.getProduct().getId(), item.getQuantity());
                } else {
                    log.warn(
                            "Skipping stock restoration for OrderItem [{}]: Product is null (likely deactivated/soft-deleted)",
                            item.getId());
                }
            }

            orderRepository.save(order);
        }
    }

    private String generateCartHash(Cart cart) {
        return cart.getItems().stream()
                .sorted(Comparator.comparing(item -> item.getProduct().getId()))
                .map(item -> item.getProduct().getId() + ":" + item.getQuantity())
                .collect(Collectors.joining("|"));
    }
}
