package com.learningmat.ecommerce.module.order;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(String userId);

    // clean up exp pending order
    List<Order> findAllByPaymentStatusAndOrderDateBefore(String paymentStatus, LocalDateTime time);

    // Optional<Order> findFirstByUserIdAndPaymentStatusOrderByOrderDate(String
    // userId, String paymentStatus);
    // @Query("select o from Order o " +
    // "join fetch o.user u " +
    // "where u.id = :userId " +
    // "and o.paymentStatus = 'PENDING' " +
    // "order by o.orderDate desc ")
    // List<Order> findLastestPendingOrder(String userId, Pageable pageable); RAM is
    // gonna have a field days if this method called...

    // find user's latest pending order
    @Query("select o from Order o " +
            "where o.user.id = :userId " +
            "and o.paymentStatus = 'PENDING'" +
            "order by o.orderDate desc ")
    List<Order> findLastestPendingOrder(String userId, Pageable pageable);

    // filter other history include success one and the nearest pending one
    @Query("select o from Order o " +
            "where o.user.id = :userId " +
            "and (o.paymentStatus = 'PAID' or o.orderDate > :threshold)")
    List<Order> findValidOrderHistory(String userId, LocalDateTime threshold);
}
