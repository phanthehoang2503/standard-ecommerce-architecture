package com.learningmat.ecommerce.repository;

import com.learningmat.ecommerce.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findUserById(String userId);
}
