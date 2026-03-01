package com.learningmat.ecommerce.module.product;

import com.learningmat.ecommerce.dto.request.ProductRequest;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
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

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    public Product updateProduct(Long id, ProductRequest productRequest) {
        Product prod = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        productMapper.updateProduct(prod, productRequest);
        return productRepository.save(prod);
    }

    public void deleteProduct(Long id) {
        Product prod = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        productRepository.delete(prod);
    }
}
