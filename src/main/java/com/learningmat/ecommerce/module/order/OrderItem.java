package com.learningmat.ecommerce.module.order;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.learningmat.ecommerce.module.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn (name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn (name = "product_id")
    private Product product;
    private String productName;

    private int quantity;
    private double price;

}
