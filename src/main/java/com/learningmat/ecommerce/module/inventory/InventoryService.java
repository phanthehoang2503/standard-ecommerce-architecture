package com.learningmat.ecommerce.module.inventory;

import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public void reduceStock(int productId, int quantity) {
        // find product from Product table and pass it to inventory
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // if the stock running low then throw error
        if (inventory.getQuantity() < quantity) throw new AppException(ErrorCode.OUT_OF_STOCK);

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);
    }
}
