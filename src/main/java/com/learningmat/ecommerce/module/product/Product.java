package com.learningmat.ecommerce.module.product;

import com.learningmat.ecommerce.module.category.Category;
import com.learningmat.ecommerce.module.inventory.Inventory;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "product")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SQLRestriction("is_active=true")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private long price;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
    private Inventory inventory;

    @ManyToOne
    @JoinColumn(name = "categories_id")
    private Category category;

    private String description;
    private String imageUrl;
    private boolean isActive = true;
}
