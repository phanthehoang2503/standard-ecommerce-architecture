package com.learningmat.ecommerce.module.product;

import com.learningmat.ecommerce.dto.request.ProductRequest;
import com.learningmat.ecommerce.dto.response.ProductResponse;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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

    public Product createProduct(ProductRequest productRequest) {
        try {
            Product prod = productMapper.toProduct(productRequest);
            Product savedProd = productRepository.save(prod);
            log.info("Create product successful with ID: {}", savedProd.getId());
            return savedProd;
        } catch (Exception e) {
            log.error("Error when creating product: {}", e.getMessage());
            throw e;
        }
    }

    public Page<ProductResponse> getProducts(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        // return productRepository.findAll(pageable);
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(productMapper::toProductResponse);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    public Product updateProduct(Long id, ProductRequest productRequest) {
        try {
            Product prod = productRepository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Failed update... can't find product with id: {}", id);
                        return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                    });
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

    public void deleteProduct(Long id) {
        try {
            Product prod = productRepository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Failed to delete... can't find product with id: {}", id);
                        return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                    });
            productRepository.delete(prod);
            log.info("Deleted complete product with id: {}", id);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("System error when try to delete product with ID {}: {}", id, e.getMessage());
            throw e;
        }

    }
}
