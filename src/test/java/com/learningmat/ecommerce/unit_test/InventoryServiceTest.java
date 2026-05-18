package com.learningmat.ecommerce.unit_test;

import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import com.learningmat.ecommerce.module.inventory.Inventory;
import com.learningmat.ecommerce.module.inventory.InventoryRepository;
import com.learningmat.ecommerce.module.inventory.InventoryService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void reduceStock_success() {
        //arrange
        Long productId = 1L;
        int reduceQty = 3;

        when(inventoryRepository.reduceStock(productId, reduceQty)).thenReturn(1);

        //act
        inventoryService.reduceStock(productId, reduceQty);

        //assert
        verify(inventoryRepository, times(1)).reduceStock(productId, reduceQty);
        verify(inventoryRepository, never()).save(any());
    }


    @Test
    void reduceStock_productNotFound_throwsException() {
        //arrange
        Long productId = 1L;
        int reduceQty = 5;

        when(inventoryRepository.reduceStock(productId, reduceQty)).thenReturn(0);
        when(inventoryRepository.findByProductId(productId)).thenReturn(Optional.empty());

        //act & assert
        AppException exception = Assertions.assertThrows(AppException.class, () -> {
            inventoryService.reduceStock(productId, reduceQty);
        });

        Assertions.assertEquals(ErrorCode.PRODUCT_NOT_FOUND, exception.getErrorCode());
        verify(inventoryRepository, never()).save(any());
    }


    @Test
    void reduceStock_outOfStock_throwsException() {
        Long productId = 1L;
        int currentQty = 2;
        int reduceQty = 5;
        Inventory mockInventory = Inventory.builder()
                .quantity(currentQty)
                .build();

        when(inventoryRepository.reduceStock(productId, reduceQty)).thenReturn(0);
        when(inventoryRepository.findByProductId(productId)).thenReturn(Optional.of(mockInventory));

        AppException exception = Assertions.assertThrows(AppException.class, () -> {
            inventoryService.reduceStock(productId, reduceQty);
        });

        Assertions.assertEquals(ErrorCode.OUT_OF_STOCK, exception.getErrorCode());
        verify(inventoryRepository, never()).save(any());
    }

    @Test
    void restoreStock_success() {
        //arrange
        Long productId = 1L;
        int restoreQty = 5;

        when(inventoryRepository.restoreStock(productId, restoreQty)).thenReturn(1);

        //act
        inventoryService.restoreStock(productId, restoreQty);

        //assert
        verify(inventoryRepository, times(1)).restoreStock(productId, restoreQty);
        verify(inventoryRepository, never()).save(any());
    }

    @Test
    void restoreStock_productNotFound_throwsException() {
        // arrange
        Long productId = 1L;
        int restoreQty = 5;

        when(inventoryRepository.restoreStock(productId, restoreQty)).thenReturn(0);

        // act & assert
        AppException exception = Assertions.assertThrows(AppException.class, () -> {
            inventoryService.restoreStock(productId, restoreQty);
        });

        Assertions.assertEquals(ErrorCode.PRODUCT_NOT_FOUND, exception.getErrorCode());
        verify(inventoryRepository, never()).save(any());
    }
}
