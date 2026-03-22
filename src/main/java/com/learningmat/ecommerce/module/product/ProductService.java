package com.learningmat.ecommerce.module.product;

import com.learningmat.ecommerce.dto.request.ProductRequest;
import com.learningmat.ecommerce.dto.response.ProductResponse;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.ProductMapper;
import com.learningmat.ecommerce.module.category.Category;
import com.learningmat.ecommerce.module.category.CategoryRepository;
import com.learningmat.ecommerce.module.inventory.Inventory;
import com.learningmat.ecommerce.module.review.ReviewService;
import com.learningmat.ecommerce.utilsRecord.ReviewStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final ReviewService reviewService;

    public Product createProduct(ProductRequest productRequest) {
        try {
            Category category = categoryRepository.findById(productRequest.categoryId())
                    .orElseThrow(() -> {
                        log.warn("The category [{}] not found in system please check again", productRequest.categoryId());
                        return new AppException(ErrorCode.CATEGORY_NOT_FOUND);
                    });
            Product prod = productMapper.toProduct(productRequest);
            prod.setCategory(category);

            Inventory inventory = new Inventory();
            inventory.setQuantity(productRequest.stock());

            inventory.setProduct(prod);
            prod.setInventory(inventory);

            Product savedProd = productRepository.save(prod);
            log.info("Create product successful with ID: {}", savedProd.getId());
            return savedProd;
        } catch (Exception e) {
            log.error("Error when creating product: {}", e.getMessage());
            throw e;
        }
    }

    @Cacheable(value = "products", key = "{#page, #size, #keyword, #categoryId}")
    public Page<ProductResponse> getProducts(
            int page, int size, String sortBy, String direction,
            String keyword, Long categoryId) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        // return productRepository.findAll(pageable);
        // Page<Product> productPage = productRepository.findAll(pageable);
        Page<Product> productPage = productRepository.searchProducts(categoryId, keyword, pageable);
        return productPage.map(productMapper::toProductResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toProductResponse(product);
    }

    public ProductResponse getProductDetails(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        ReviewStats stats = reviewService.getReviewStats(productId);

        ProductResponse response = productMapper.toProductResponse(product);

        return new ProductResponse(
                response.id(),
                response.name(),
                response.imageUrl(),
                response.price(),
                response.stockQuantity(),
                response.categoryName(),
                stats.AvgRating() != null ? stats.AvgRating() : 0.0,
                stats.reviewCount()
        );
    }

    public Product updateProduct(Long id, ProductRequest productRequest) {
        try {
            Product prod = productRepository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Failed update... can't find product with id: {}", id);
                        return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                    });
            Category category = categoryRepository.findById(productRequest.categoryId())
                            .orElseThrow(() -> {
                                log.warn("Category [{}] not found in the system.", productRequest.categoryId());
                                return new AppException(ErrorCode.CATEGORY_NOT_FOUND);
                            });
            prod.setCategory(category);
            productMapper.updateProduct(prod, productRequest);
            Product updatedProduct = productRepository.save(prod);
            log.info("Updated complete product with id: {}", id);
            return updatedProduct;
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("System error when try to update product with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    public Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.warn("Can't find product with id [{}]", productId);
                    return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                });
    }

    public void deleteProduct(Long id) {
        try {
            Product prod = productRepository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Failed to delete... can't find product with id: {}", id);
                        return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                    });
            prod.setActive(false);
            productRepository.save(prod);
            log.info(" product with(id, name) [{}, {}] is now unavailable",
                    id,
                    prod.getName());
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("System error when try to delete product with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }
}
