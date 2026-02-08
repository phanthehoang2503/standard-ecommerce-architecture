package com.learningmat.ecommerce.service;

import com.learningmat.ecommerce.dto.request.ProductRequest;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.ProductMapper;
import com.learningmat.ecommerce.model.Product;
import com.learningmat.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.OptimisticLocking;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public Product createProduct(ProductRequest productRequest) {
        Product prod = productMapper.toProduct(productRequest);

        return productRepository.save(prod);
    }

    public List<Product> getProduct() {
        return productRepository.findAll();
    }

    public Product getProductById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    public Product updateProduct(int id, ProductRequest productRequest) {
        Product prod = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productRepository.save(prod);
    }

    public void deleteProduct(int id) {
        Product prod = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        productRepository.delete(prod);
    }
}
