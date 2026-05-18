package com.learningmat.ecommerce.integration_test;

import com.learningmat.ecommerce.module.inventory.Inventory;
import com.learningmat.ecommerce.module.inventory.InventoryRepository;
import com.learningmat.ecommerce.module.inventory.InventoryService;
import com.learningmat.ecommerce.module.product.Product;
import com.learningmat.ecommerce.module.product.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class InventoryConcurrencyTest {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    private Long testProductId;

    @BeforeEach
    void setUp() {
        //clear remain data from previous test
        inventoryRepository.deleteAll();
        productRepository.deleteAll();

        Product product = Product.builder()
                .name("Sản phẩm Concurrency Test")
                .price(100000L)
                .build();
        Product savedProduct = productRepository.save(product);
        testProductId = savedProduct.getId();

        Inventory inventory = Inventory.builder()
                .product(savedProduct)
                .quantity(10)
                .build();
        inventoryRepository.save(inventory);
    }

    @Test
    void testStockReduction_ShouldNotOverSell() throws InterruptedException {
        int numberOfThreads = 15;
        ExecutorService service = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(1);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < numberOfThreads; i++) {
            service.execute(() -> {
                try{
                    latch.await();
                    inventoryService.reduceStock(testProductId, 1);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                }
            });
        }
        latch.countDown();
        service.shutdown();

        assertTrue(service.awaitTermination(10, TimeUnit.SECONDS), "All threads did not complete on time");
        Inventory updatedInventory = inventoryRepository.findByProductId(testProductId).orElseThrow();

        // Expect:
        // 1. Should be out of stock (10 stock allocated, 15 buy action)
        // 2. There should be 10 transaction
        // 3. And there should be 5 failed transaction
        assertEquals(0, updatedInventory.getQuantity(), "Stock now should be 0");
        assertEquals(10, successCount.get(), "Only 10 transaction successful");
        assertEquals(5, failureCount.get(), "Only 5 transaction failed");
    }
}
