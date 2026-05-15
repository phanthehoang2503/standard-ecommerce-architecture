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
        int currentQty = 10;
        int reduceQty = 3;
        Inventory mockInventory = Inventory.builder()
                .quantity(currentQty)
                .build();

        when(inventoryRepository.findByProductId(productId)).thenReturn(Optional.of(mockInventory));

        //act
        inventoryService.reduceStock(productId, reduceQty);

        //assert
        Assertions.assertEquals(7, mockInventory.getQuantity());
        verify(inventoryRepository, times(1)).save(mockInventory);
    }

    @Test
    void reduceStock_outOfStock_throwsException() {
        //arrange
        Long productId = 1L;
        int currentQty = 2;
        int reduceQty = 5;
        Inventory mockInventory = Inventory.builder()
                .quantity(currentQty)
                .build();

        when(inventoryRepository.findByProductId(productId)).thenReturn(Optional.of(mockInventory));

        //act & assert
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
        int currentQty = 5;
        int restoreQty = 5;
        Inventory mockInventory = Inventory.builder()
                .quantity(currentQty)
                .build();

        when(inventoryRepository.findByProductId(productId)).thenReturn(Optional.of(mockInventory));

        //act
        inventoryService.restoreStock(productId, restoreQty);

        //assert
        Assertions.assertEquals(10, mockInventory.getQuantity());
        verify(inventoryRepository, times(1)).save(mockInventory);
    }
}
