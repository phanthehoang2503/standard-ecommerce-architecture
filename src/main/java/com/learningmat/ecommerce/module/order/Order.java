package com.learningmat.ecommerce.module.order;

import com.learningmat.ecommerce.module.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    private User user;

    private Long totalAmount;
    // PROCESSING, SHIPPED, DELIVERED, CANCELLED
    @Builder.Default
    private String status = "PROCESSING";
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
    private String cartHash;

    // PENDING, PAID, FAILED, REFUNDED
    @Builder.Default
    private String paymentStatus = "PENDING";

}
