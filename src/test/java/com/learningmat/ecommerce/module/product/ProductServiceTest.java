package com.learningmat.ecommerce.module.product;

import com.learningmat.ecommerce.exception.AppException;
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

        // return mock product
        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        Product result = productService.getProductById(productId);

        Assertions.assertEquals("Laptop", result.getName());
        Assertions.assertEquals(30000000, result.getPrice());
    }

    @Test
    void getProductById_invalidId_throwsException() {
        // Arrange
        Long productId = 25L;
        // return empty
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        AppException exception = Assertions.assertThrows(AppException.class, () -> {
            productService.getProductById(productId);
        });
    }
}
