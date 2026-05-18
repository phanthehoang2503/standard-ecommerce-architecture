package com.learningmat.ecommerce.module.inventory;

import com.learningmat.ecommerce.exception.AppException;
import com.learningmat.ecommerce.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    @Transactional
    public void reduceStock(Long productId, int quantity) {
        log.info("Stock reduction for product with ID [{}], quantity = [{}]", productId, quantity);

        int updateRow = inventoryRepository.reduceStock(productId, quantity);

        if (updateRow == 0) {
            log.warn("Stock reduction for product with ID [{}] failed.", productId);
            Inventory inventory = inventoryRepository.findByProductId(productId).orElseThrow(
                    () -> {
                        log.error("Product with ID [{}] not found in the inventory", productId);
                        return new AppException(ErrorCode.PRODUCT_NOT_FOUND);
                    }
            );

            if (inventory.getQuantity() < quantity) {
                log.warn("Product with ID [{}] is currently out of stock or insufficient, current stock: {}",
                        productId, inventory.getQuantity());
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            } else {
                log.error("Stock reduction failed due to concurrent modification for product ID [{}]", productId);
                throw new AppException(ErrorCode.STOCK_UPDATE_FAILED);
            }
        }
        log.info("Stock reduced for product ID [{}]", productId);
    }

    @Transactional
    public void restoreStock(Long productId, int quantity) {
        log.info("stock restoration for product ID [{}], quantity [{}]", productId, quantity);

        int updateProduct = inventoryRepository.restoreStock(productId, quantity);

        if (updateProduct == 0) {
            log.error("Cannot restock due to product with ID [{}] not found", productId);
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        log.info("Stock restored successfully for product ID [{}]", productId);
    }
}
