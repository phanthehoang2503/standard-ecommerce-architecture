package com.learningmat.ecommerce.module.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	// N+1
	/*
	 * @Query("SELECT p FROM Product p WHERE " +
	 * "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
	 * "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
	 * +
	 * "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
	 */
	@Query(value = "select p from Product p left join fetch p.category " +
			"WHERE (:categoryId is null or p.category.id = :categoryId) and " +
			"(:keyword is null or lower(p.name) like lower (concat('%', :keyword, '%')) " +
			"or lower(p.description) like lower(concat('%', :keyword, '%')))", countQuery = "select  count(p) from Product p where "
					+
					"(:categoryId is null or p.category.id = :categoryId) and " +
					"(:keyword is null or lower(p.name) like lower(concat('%', :keyword, '%')) " +
					"or lower(p.description) like lower(concat('%', :keyword, '%')))")
	Page<Product> searchProducts(@Param("categoryId") Long categoryId,
			@Param("keyword") String keyword,
			Pageable pageable);

	Product getProductById(Long id);
}
