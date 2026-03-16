package com.learningmat.ecommerce.module.review;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.learningmat.ecommerce.module.product.Product;
import com.learningmat.ecommerce.module.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnore
    private Product product;

    private int rating;
    private String comment;
    private LocalDateTime createdAt;

}
