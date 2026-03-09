package com.learningmat.ecommerce.module.inventory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.learningmat.ecommerce.module.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", columnDefinition = "BIGINT")
    @JsonIgnore
    private Product product;

    private int quantity;

    @Version
    private Long version; // Optimistic locking
}
