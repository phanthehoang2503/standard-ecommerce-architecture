package com.learningmat.ecommerce.module.inventory;

import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public void reduceStock(Long productId, int quantity) {
        // find product from Product table and pass it to inventory
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // if the stock running low then throw error
        if (inventory.getQuantity() < quantity)
            throw new AppException(ErrorCode.OUT_OF_STOCK);

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);
    }

    public void restoreStock(Long productId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductId(productId).orElseThrow(
                () -> {
                    log.warn("Can't find product with id [{}]", productId);
                    return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                });

        inventory.setQuantity(quantity + inventory.getQuantity());
        inventoryRepository.save(inventory);
    }
}
