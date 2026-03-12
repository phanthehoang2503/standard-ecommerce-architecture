package com.learningmat.ecommerce.module.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(String userId);

    List<Order> findAllByPaymentStatusAndOrderDateBefore(String paymentStatus, LocalDateTime time);
}
