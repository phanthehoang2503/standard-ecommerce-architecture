package com.learningmat.ecommerce.module.inventory;

import com.learningmat.ecommerce.module.product.Product;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductId(Long productId);

    @Modifying
    @Query("update Inventory i set i.quantity = i.quantity - :quantity " +
            "where i.product.id = :productId and i.quantity >= :quantity")
    int reduceStock(@Param("productId") Long productId, @Param("quantity") int quantity);

    @Modifying
    @Query("update Inventory  i set i.quantity = i.quantity + :quantity " +
            "where i.product.id = :productId")
    int restoreStock(@Param("productId") Long productId, @Param("quantity") int quantity);
}
