package com.learningmat.ecommerce.module.product;

import com.learningmat.ecommerce.dto.response.ProductResponse;
import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.mapper.ProductMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    @Test
    void getProductByID_validId_success() {
        Long productId = 1L;
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockProduct.setName("Laptop");
        mockProduct.setPrice(30000000);

        ProductResponse mockResponse = new ProductResponse(
                productId, "Laptop", "image.png", 30000000, 10, "Electronics", 0.0, 0);

        // return mock product
        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        when(productMapper.toProductResponse(mockProduct)).thenReturn(mockResponse);

        // Product result = productService.getProductById(productId);
        // act
        ProductResponse res = productService.getProductById(productId);

        // assert
        Assertions.assertEquals("Laptop", res.name());
        Assertions.assertEquals(30000000, res.price());
    }

    @Test
    void getProductById_invalidId_throwsException() {
        // 1. Arrange
        Long productId = 25L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // 2. Act & Assert
        AppException exception = Assertions.assertThrows(AppException.class, () -> {
            productService.getProductById(productId);
        });

        Assertions.assertEquals(ErrorCode.PRODUCT_NOT_FOUND, exception.getErrorCode());
    }

}
