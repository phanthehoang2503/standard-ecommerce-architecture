package com.learningmat.ecommerce.module.review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductId(Long productId, Pageable pageable);

    @Query("select avg(r.rating) from Review r " +
            "Where r.product.id = :productId")
    Double getAverageRating(Long productId);

    @Query("select count(r) from Review r " +
            "where r.product.id = :productId")
    int countByProductId(Long productId);
}
